# 📧 Automatic Download Delivery Setup Guide

## What This Does

After a customer completes payment, they automatically receive an email with:
- ✅ Download link for their platform
- ✅ Unique license key
- ✅ Installation instructions
- ✅ Support information

## 🚀 Setup Steps

### Step 1: Sign Up for Resend (Free)

1. Go to: https://resend.com/signup
2. Sign up (free for 3,000 emails/month)
3. Verify your email address

### Step 2: Get Your Resend API Key

1. Go to: https://resend.com/api-keys
2. Click "Create API Key"
3. Name it: "Devdoc Downloads"
4. Click "Create"
5. **Copy the API key** (starts with `re_...`)

### Step 3: Add Domain to Resend

1. Go to: https://resend.com/domains
2. Click "Add Domain"
3. Enter: `altaredalchemie.com`
4. Follow the DNS setup instructions (add TXT and MX records)
5. Wait for verification (~10 minutes)

**OR use Resend's test domain:**
- Change `from` email in code to: `onboarding@resend.dev`
- This works immediately but shows "via resend.dev"

### Step 4: Add Environment Variables to Vercel

1. Go to: https://vercel.com/dashboard
2. Click your **altared-alchemie** project
3. **Settings** → **Environment Variables**
4. Add these two variables:

**Variable 1:**
- Name: `RESEND_API_KEY`
- Value: `re_YOUR_API_KEY_HERE` (from Step 2)
- Environments: ✅ All three

**Variable 2:**
- Name: `STRIPE_WEBHOOK_SECRET`
- Value: (we'll get this in Step 5)
- Environments: ✅ All three

### Step 5: Set Up Stripe Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. **Endpoint URL:** `https://altaredalchemie.com/api/stripe-webhook`
4. **Events to send:** Click "Select events" and choose:
   - ✅ `checkout.session.completed`
5. Click "Add endpoint"
6. **Copy the "Signing secret"** (starts with `whsec_...`)
7. Go back to Vercel and add it as `STRIPE_WEBHOOK_SECRET`

### Step 6: Upload Your App Files

You need to host the actual installer files somewhere. Options:

**Option A: Cloudflare R2 (Recommended - Free)**
1. Sign up: https://cloudflare.com/products/r2/
2. Create a bucket: `devdoc-downloads`
3. Upload your installers:
   - `devdoc-voice-generator-windows.exe`
   - `devdoc-voice-generator-mac-intel.dmg`
   - `devdoc-voice-generator-mac-arm.dmg`
4. Make them public or generate signed URLs

**Option B: AWS S3**
- Similar process, create bucket and upload files

**Option C: GitHub Releases**
- Create a release in your Devdoc repo
- Upload installers as release assets
- Use the download URLs

### Step 7: Update Download URLs

Edit `api/stripe-webhook.js` and update the download links (around line 35):

```javascript
const downloadLinks = {
  'windows': 'https://your-actual-url.com/devdoc-voice-generator-windows.exe',
  'mac-intel': 'https://your-actual-url.com/devdoc-voice-generator-mac-intel.dmg',
  'mac-arm': 'https://your-actual-url.com/devdoc-voice-generator-mac-arm.dmg'
};
```

### Step 8: Redeploy

1. Commit your changes: `git add . && git commit -m "Update download URLs"`
2. Push: `git push origin main`
3. Or in Vercel: **Deployments** → **...** → **Redeploy**

## 🧪 Testing

### Test the Full Flow:

1. Go to: https://altaredalchemie.com/downloads
2. Fill out the form
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Check your email - you should receive the download email!

### Check Webhook Logs:

1. Go to: https://dashboard.stripe.com/webhooks
2. Click your webhook endpoint
3. See recent events and any errors

## 📧 Email Customization

The email template is in `api/stripe-webhook.js` starting at line 90.

You can customize:
- Colors and styling
- Text content
- Add your logo
- Change instructions

## 🔧 Troubleshooting

### Email Not Sending?

1. Check Vercel logs: https://vercel.com/dashboard → Your project → Logs
2. Check Resend logs: https://resend.com/emails
3. Verify `RESEND_API_KEY` is set in Vercel
4. Make sure domain is verified in Resend

### Webhook Not Firing?

1. Check Stripe webhook logs
2. Verify `STRIPE_WEBHOOK_SECRET` is set in Vercel
3. Make sure endpoint URL is correct
4. Check Vercel function logs

### Wrong Download Link?

1. Verify platform mapping in webhook code
2. Check download URLs are accessible
3. Test URLs directly in browser

## 📊 Monitor Your System

### Resend Dashboard:
- See all sent emails
- Delivery status
- Open rates

### Stripe Dashboard:
- Webhook events
- Payment confirmations
- Customer details

## 🎉 You're Done!

Once set up, the system works automatically:
1. Customer pays → 
2. Stripe sends webhook → 
3. Your function generates license key → 
4. Email sent via Resend → 
5. Customer gets download link!

---

**Need help?** Check the logs in Vercel and Stripe dashboard for debugging.

