# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payments for the Devdoc Voice Generator downloads page.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js and npm installed
3. Your server running (from the `server` directory)

## Step 1: Install Stripe Package

Navigate to your server directory and install the Stripe npm package:

```bash
cd server
npm install stripe
```

## Step 2: Get Your Stripe API Keys

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Click on "Developers" in the left sidebar
3. Click on "API keys"
4. You'll see two types of keys:
   - **Publishable key** (starts with `pk_test_` for test mode, `pk_live_` for production)
   - **Secret key** (starts with `sk_test_` for test mode, `sk_live_` for production)

**IMPORTANT:** Start with test mode keys to safely test your integration!

## Step 3: Configure Environment Variables

Add your Stripe keys to your `.env` file in the `server` directory:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

Also, add your Stripe publishable key to your website's `env.js` file:

```javascript
// env.js
window.ENV = {
  STRIPE_PUBLIC_KEY: 'pk_test_YOUR_PUBLISHABLE_KEY_HERE'
  // ... other env variables
};
```

## Step 4: Set Up Webhook Endpoint

Webhooks allow Stripe to notify your server when payments succeed or fail.

### For Local Development (using Stripe CLI):

1. Install the Stripe CLI: https://stripe.com/docs/stripe-cli
2. Log in to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to localhost:5179/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`) and add it to your `.env` file

### For Production:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add it to your production `.env`

## Step 5: Create a Stripe Product

1. Go to Stripe Dashboard → Products
2. Click "Add product"
3. Fill in the details:
   - **Name:** Devdoc Voice Generator
   - **Description:** Voice-powered documentation tool for developers
   - **Price:** $49.00 USD (one-time)
4. Save the product
5. Note: The code already creates price data dynamically, so you don't need to use this product ID directly

## Step 6: Test Your Integration

### Test with Stripe Test Cards:

Use these test card numbers in test mode:

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0027 6000 3184

For all test cards:
- Use any future expiration date
- Use any 3-digit CVC
- Use any billing postal code

### Testing Flow:

1. Start your server:
   ```bash
   cd server
   npm start
   ```

2. Open your website at `http://localhost:5177/downloads.html`

3. Fill out the purchase form with:
   - A test email address
   - Your name
   - Select a platform
   - Check the terms checkbox

4. Click "Purchase Now - $49"

5. You should be redirected to Stripe's checkout page

6. Use a test card to complete the payment

7. After successful payment, you'll be redirected back to your site with a success message

## Step 7: Handle Post-Payment Actions

After a successful payment, you'll want to:

1. **Send download link via email**
2. **Generate and send a license key**
3. **Store the purchase in your database**

Update the webhook handler in `server/src/index.js` to implement these actions:

```javascript
case 'checkout.session.completed':
  const session = event.data.object;
  const customerEmail = session.customer_email;
  const metadata = session.metadata;
  
  // 1. Generate license key
  const licenseKey = generateLicenseKey(); // Implement this function
  
  // 2. Send email with download link and license
  await sendPurchaseEmail(customerEmail, {
    name: metadata.customer_name,
    platform: metadata.platform,
    licenseKey: licenseKey,
    downloadUrl: getDownloadUrl(metadata.platform)
  });
  
  // 3. Store in database
  await savePurchase({
    email: customerEmail,
    name: metadata.customer_name,
    platform: metadata.platform,
    licenseKey: licenseKey,
    purchaseDate: new Date(),
    stripeSessionId: session.id
  });
  
  break;
```

## Step 8: Email Integration Options

Choose an email service to send download links:

### Option 1: SendGrid
```bash
npm install @sendgrid/mail
```

```javascript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendPurchaseEmail(email, data) {
  const msg = {
    to: email,
    from: 'support@altaredalchemie.com',
    subject: 'Your Devdoc Voice Generator License',
    html: `
      <h1>Thank you for your purchase!</h1>
      <p>Download your app: <a href="${data.downloadUrl}">Click here</a></p>
      <p>License Key: <strong>${data.licenseKey}</strong></p>
    `
  };
  await sgMail.send(msg);
}
```

### Option 2: Mailgun
```bash
npm install mailgun-js
```

### Option 3: Nodemailer (using Gmail, SMTP, etc.)
```bash
npm install nodemailer
```

## Step 9: Security Checklist

Before going live:

- [ ] Replace test API keys with live API keys
- [ ] Set up webhook endpoint in production
- [ ] Enable HTTPS on your domain
- [ ] Verify webhook signature is working
- [ ] Test refund process
- [ ] Set up Stripe fraud detection rules
- [ ] Configure email notifications
- [ ] Test the full purchase flow end-to-end
- [ ] Set up monitoring/logging for failed payments

## Step 10: Going Live

1. Switch from test mode to live mode in Stripe Dashboard
2. Update your `.env` files with live keys:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - Update `env.js` with `pk_live_...`
3. Update webhook endpoints with your production URL
4. Test with a real card (you can refund it after testing)
5. Monitor your Stripe Dashboard for payments

## Additional Features to Consider

1. **Team Licenses:** Offer multi-user licenses at different price points
2. **Subscription Model:** Monthly/yearly licensing for updates and support
3. **Discount Codes:** Use Stripe Coupons for promotional discounts
4. **Upgrade Paths:** Allow single license holders to upgrade to team licenses
5. **Automatic Updates:** Integrate with the app to check license validity

## Troubleshooting

### Payment not completing
- Check browser console for JavaScript errors
- Verify API keys are correct (test vs live)
- Check server logs for API errors

### Webhook not firing
- Verify webhook secret is correct
- Check that your server is accessible (use ngrok for local testing)
- Review Stripe Dashboard → Webhooks → Recent events

### Customer not receiving email
- Check spam folder
- Verify email service is configured correctly
- Check server logs for email sending errors

## Support Resources

- Stripe Documentation: https://stripe.com/docs
- Stripe API Reference: https://stripe.com/docs/api
- Stripe Testing: https://stripe.com/docs/testing
- Stripe CLI: https://stripe.com/docs/stripe-cli

## Need Help?

Contact support@altaredalchemie.com for assistance with the payment integration.

