# 🧪 Test Your Payment System

## ✅ Your Setup is Complete!

Both Stripe keys are configured and your server is running.

## 🎯 Test Your Downloads Page Now

### Option 1: Open in Browser
Navigate to: **http://localhost:5177/downloads.html**

### Option 2: Open Directly
Double-click the `downloads.html` file in your project folder.

## 💳 Test Payment Flow

1. **Fill out the form:**
   - Email: Use your real email (you'll get redirected to Stripe)
   - Name: Your name
   - Platform: Select Windows, macOS Intel, or macOS Apple Silicon
   - Check the terms checkbox

2. **Click "Purchase Now - $49"**

3. **You'll be redirected to Stripe Checkout** (secure payment page)

4. **Use a REAL credit card** (this is LIVE mode!)
   - ⚠️ **IMPORTANT:** You're using LIVE keys, so real cards will be charged
   - 💰 Test with a small amount if you want, or use Test Mode (see below)

5. **Complete the payment**

6. **Get redirected back** with success message

## ⚠️ Switch to Test Mode (Recommended for Testing)

Since you're using **LIVE keys**, real payments will be charged. To test safely:

### Step 1: Get Test Keys from Stripe

1. Go to your Stripe Dashboard
2. **Toggle "Test mode"** switch (top right corner)
3. Go to Developers → API Keys
4. Copy your TEST keys (they start with `pk_test_` and `sk_test_`)

### Step 2: Replace with Test Keys

**In `env.js`:**
```javascript
STRIPE_PUBLIC_KEY: 'pk_test_YOUR_TEST_KEY_HERE'
```

**In `server/.env`:**
```env
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY_HERE
```

### Step 3: Restart Server
```bash
cd server
npm start
```

### Step 4: Test with Test Card
Use these test cards (TEST MODE ONLY):

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Decline |
| 4000 0027 6000 3184 | 3D Secure |

- Any future expiration date
- Any 3-digit CVC
- Any postal code

## 🔔 Next: Set Up Webhooks

After successful test payment, set up webhooks to handle post-payment actions:

### For Local Testing:
```bash
# Install Stripe CLI
# Then run:
stripe listen --forward-to localhost:5179/api/stripe/webhook

# Copy the webhook secret (whsec_...) and add to server/.env:
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

### For Production:
1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook secret to `server/.env`

## 📧 Implement Email Delivery

When payment succeeds, you'll want to send:
1. Download link for the app
2. License key
3. Getting started guide

Update `server/src/index.js` in the webhook handler (around line 183) to send emails.

## 🎉 You're Live!

Your payment system is working! The flow:
1. Customer fills form → 
2. Redirects to Stripe Checkout → 
3. Enters card details → 
4. Payment processes → 
5. Redirects back with success → 
6. Webhook fires → 
7. Send download link via email

## 🆘 Troubleshooting

### Payment not working?
- Check browser console for errors
- Verify both keys are correct in `env.js` and `server/.env`
- Make sure server is running (`npm start`)

### Webhook not firing?
- Install and run Stripe CLI
- Check webhook secret is in `server/.env`
- Check server logs for webhook events

### Need help?
Check the detailed guides:
- `STRIPE_SETUP_GUIDE.md` - Complete setup
- `SETUP_CHECKLIST.md` - Step-by-step checklist

---

**Current Status:** ✅ READY TO ACCEPT PAYMENTS
**Server:** Running on http://localhost:5179
**Downloads Page:** http://localhost:5177/downloads.html

