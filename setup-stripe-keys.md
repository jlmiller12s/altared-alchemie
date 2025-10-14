# 🔑 Stripe API Keys Setup Guide

## ✅ Step 1: Frontend Key (DONE!)

I've already added your **Publishable Key** to `env.js`:
```
pk_live_51JgZ0RBDrwLkdqgwLygv64vJLaUDPRjPTMaZAOIEc2u00yyuCA4XnkvN8v0xkPj3zeVDsa0wbo75s8AR47SvYcv800noI4Hshm
```

## 📝 Step 2: Backend Secret Key (DO THIS NOW)

1. **Go back to your Stripe Dashboard** (the screenshot you showed)
2. **Click the "Reveal live key" button** next to "Secret key"
3. **Copy** the secret key (it starts with `sk_live_...`)

4. **Create/Edit** the file: `server/.env`

   You can do this by:
   - Opening VS Code or your editor
   - Creating a new file at: `server/.env`
   - Or using command line: `notepad server\.env` (Windows) or `nano server/.env` (Mac/Linux)

5. **Paste this content** into `server/.env`:

```env
# Server Configuration
PORT=5179

# Stripe Configuration
# Paste your secret key below (the one you just revealed)
STRIPE_SECRET_KEY=sk_live_PUT_YOUR_SECRET_KEY_HERE

# Stripe Webhook Secret (we'll add this later)
STRIPE_WEBHOOK_SECRET=

# Support Email
SUPPORT_EMAIL=jimmie@altaredalchemie.com

# Application URLs
FRONTEND_URL=http://localhost:5177
API_URL=http://localhost:5179
```

6. **Replace** `sk_live_PUT_YOUR_SECRET_KEY_HERE` with the actual secret key from Stripe

## ⚠️ IMPORTANT Security Notes

- ✅ **Publishable key** (`pk_live_...`) - Safe to use in frontend, already added to `env.js`
- ⚠️ **Secret key** (`sk_live_...`) - MUST stay on backend only, never commit to git
- 🔒 The `.env` file should already be in your `.gitignore`

## 🧪 Step 3: Test Mode First (Recommended)

If you want to test before going live with real payments:

1. **Switch to "Test mode"** in your Stripe Dashboard (toggle at top)
2. Get your **test keys** instead:
   - Test Publishable: `pk_test_...`
   - Test Secret: `sk_test_...`
3. Use test keys in your config files
4. Test with card: `4242 4242 4242 4242`

## 🎯 Step 4: Verify Setup

After adding your secret key to `server/.env`:

```bash
# Start your server
cd server
npm start

# In another terminal, test the API
curl http://localhost:5179/healthz
```

You should see: `{"ok":true}`

## 📋 Quick Reference

| Key Type | Location | Starts With | Safe for Frontend? |
|----------|----------|-------------|-------------------|
| Publishable | `env.js` | `pk_live_` or `pk_test_` | ✅ Yes |
| Secret | `server/.env` | `sk_live_` or `sk_test_` | ❌ No - Backend only |
| Webhook Secret | `server/.env` | `whsec_` | ❌ No - Backend only |

## 🚀 Next Steps After Keys Are Set

1. ✅ Set up webhook endpoint (see below)
2. ✅ Test payment flow
3. ✅ Configure email delivery

## 🔔 Setting Up Webhooks (Step 5)

After your keys are working:

### For Local Development:
```bash
# Install Stripe CLI
# Windows (with Scoop): scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login and forward webhooks
stripe login
stripe listen --forward-to localhost:5179/api/stripe/webhook

# Copy the webhook signing secret (whsec_...) 
# and add it to your server/.env file
```

### For Production:
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/stripe/webhook`
4. Events: Select `checkout.session.completed` and `payment_intent.succeeded`
5. Copy the signing secret and add to production `.env`

## ✨ You're Almost Done!

Once you complete Step 2 (adding the secret key), your payment system will be fully functional!

Test it at: http://localhost:5177/downloads.html

---

**Need help?** Check `STRIPE_SETUP_GUIDE.md` for detailed instructions.

