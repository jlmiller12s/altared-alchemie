# Downloads Page Setup Checklist

## ✅ Completed

The following has been set up for you:

- [x] Created `downloads.html` with complete payment integration
- [x] Added "Downloads" link to main navigation (index.html)
- [x] Implemented Stripe payment endpoints in server (`server/src/index.js`)
- [x] Added Stripe dependency to `server/package.json`
- [x] Installed Stripe npm package (v14.25.0)
- [x] Created comprehensive setup documentation

## 📋 TODO: Before You Can Accept Payments

### 1. Get Stripe Account & API Keys

- [ ] Sign up for Stripe account at https://stripe.com
- [ ] Navigate to Stripe Dashboard → Developers → API Keys
- [ ] Copy your **test** keys (start with `pk_test_` and `sk_test_`)

### 2. Configure Server Environment Variables

Create/update `server/.env` file with:

```env
# Stripe Test Keys (from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Server Config
PORT=5179
SUPPORT_EMAIL=jimmie@altaredalchemie.com
```

### 3. Configure Frontend Stripe Key

Update `env.js` in your website root:

```javascript
window.ENV = {
  STRIPE_PUBLIC_KEY: 'pk_test_YOUR_PUBLISHABLE_KEY_HERE'
};
```

### 4. Set Up Webhooks (Local Testing)

Option A - Stripe CLI (Recommended for local dev):
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:5179/api/stripe/webhook
# Copy the webhook signing secret to .env
```

Option B - Production webhook:
- Go to Stripe Dashboard → Developers → Webhooks
- Add endpoint: `https://yourdomain.com/api/stripe/webhook`
- Select events: `checkout.session.completed`, `payment_intent.succeeded`
- Copy webhook signing secret to `.env`

### 5. Test Payment Flow

- [ ] Start server: `cd server && npm start`
- [ ] Open: http://localhost:5177/downloads.html
- [ ] Fill form and click "Purchase Now"
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete checkout and verify success

### 6. Set Up Email Delivery

Choose an email service for sending download links:

**Option 1: SendGrid**
```bash
npm install @sendgrid/mail
```

**Option 2: Mailgun**
```bash
npm install mailgun-js
```

**Option 3: Nodemailer**
```bash
npm install nodemailer
```

Then update the webhook handler in `server/src/index.js` to send emails.

### 7. Host App Download Files

Upload your compiled Devdoc Voice Generator installers to:
- AWS S3
- DigitalOcean Spaces
- CloudFlare R2
- Or any file hosting service

Generate signed URLs for security.

### 8. Implement License Key System

- [ ] Create license key generation function
- [ ] Store licenses in database (MongoDB, PostgreSQL, etc.)
- [ ] Add license validation to your Devdoc app
- [ ] Send license key via email after purchase

### 9. Going Live

- [ ] Switch to Stripe live keys (`sk_live_` and `pk_live_`)
- [ ] Update production webhook endpoint
- [ ] Test with real card (then refund)
- [ ] Set up monitoring for failed payments
- [ ] Configure fraud detection in Stripe Dashboard

## 📁 File Structure

```
Altared-Alchemie-website/
├── downloads.html                  ← Downloads page (NEW)
├── index.html                      ← Updated with Downloads link
├── env.js                          ← Add STRIPE_PUBLIC_KEY here
├── DOWNLOADS_PAGE_README.md        ← Quick start guide (NEW)
├── STRIPE_SETUP_GUIDE.md          ← Detailed Stripe setup (NEW)
├── SETUP_CHECKLIST.md             ← This file (NEW)
└── server/
    ├── package.json                ← Updated with Stripe
    └── src/
        └── index.js                ← Payment endpoints added
```

## 🎯 Quick Commands

```bash
# Install dependencies
cd server
npm install

# Start server (from server directory)
npm start

# Start Stripe webhook forwarding (separate terminal)
stripe listen --forward-to localhost:5179/api/stripe/webhook

# Open downloads page
# Navigate to: http://localhost:5177/downloads.html
```

## 🧪 Test Cards

Use these in **test mode only**:

| Card Number         | Scenario           |
|--------------------|--------------------|
| 4242 4242 4242 4242 | Success           |
| 4000 0000 0000 0002 | Decline           |
| 4000 0027 6000 3184 | 3D Secure Required |

- Use any future expiration
- Use any 3-digit CVC
- Use any postal code

## 💰 Current Pricing

- **Price:** $49 USD one-time
- **License:** Single user
- **Updates:** Free forever
- **Platforms:** Windows, macOS (Intel & Apple Silicon)
- **Guarantee:** 30-day money-back

To change the price, edit `downloads.html` around line 462:
```javascript
price: 4900 // Amount in cents ($49.00)
```

## 🔒 Security Reminders

- ✅ Never commit `.env` files to git
- ✅ Never expose `STRIPE_SECRET_KEY` in frontend code
- ✅ Always verify webhook signatures
- ✅ Use HTTPS in production
- ✅ Start with test mode

## 📧 Email Template Structure

After successful payment, send:

1. **Order confirmation** with purchase details
2. **Download links** for selected platform
3. **License key** for app activation
4. **Getting started** guide link
5. **Support contact** information

## 📊 Monitor & Analytics

Track in Stripe Dashboard:
- Total revenue
- Successful payments
- Failed payments
- Refund requests
- Customer locations

## 🆘 Support Resources

- **Stripe Docs:** https://stripe.com/docs
- **Testing Guide:** https://stripe.com/docs/testing
- **Stripe CLI:** https://stripe.com/docs/stripe-cli
- **Your Setup Guide:** See `STRIPE_SETUP_GUIDE.md`

## ✨ Optional Enhancements

Future features to consider:

- [ ] Discount/coupon codes
- [ ] Team licenses (5-seat, 10-seat, etc.)
- [ ] Annual subscription model
- [ ] Upgrade from single to team license
- [ ] Automatic update notifications
- [ ] Usage analytics dashboard
- [ ] In-app license management

## 🎉 Ready to Launch!

Once you've completed the checklist above:

1. Test thoroughly in test mode
2. Switch to live keys
3. Test one real transaction (then refund)
4. Announce your launch!

---

**Created:** October 2025  
**Status:** Ready for configuration  
**Next Step:** Get Stripe API keys and configure environment variables

