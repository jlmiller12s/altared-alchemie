# 🔧 Vercel Environment Variables Setup

## What Just Happened

I've deployed a Vercel serverless function to handle Stripe payments. Now you need to add your Stripe secret key to Vercel's environment variables.

## ⚡ Quick Setup (5 minutes)

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Click on your **altared-alchemie** project
3. Click **Settings** tab
4. Click **Environment Variables** in the sidebar

### Step 2: Add Stripe Secret Key

Add this environment variable:

**Key:** `STRIPE_SECRET_KEY`  
**Value:** Your Stripe secret key from the Stripe Dashboard

- If testing: `sk_test_...` (your test secret key)
- If live: `sk_live_...` (your live secret key)

**Environment:** Select **Production, Preview, and Development** (all three)

Click **Save**

### Step 3: Redeploy

After adding the environment variable:
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Wait ~2 minutes for deployment

## ✅ Test It

After redeployment, go to:
**https://altaredalchemie.com/downloads**

Fill out the form and click "Purchase Now - $5"

It should now work! 🎉

## 🔑 Where to Find Your Stripe Keys

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy the **Secret key** (click "Reveal test key")
3. Paste it into Vercel as shown above

## 📝 Current Status

- ✅ API endpoint created: `/api/create-checkout-session`
- ✅ Code deployed to GitHub
- ⏳ **NEXT:** Add STRIPE_SECRET_KEY to Vercel (you do this)
- ⏳ Redeploy on Vercel

---

**Once you add the environment variable and redeploy, your downloads page will work perfectly!**

