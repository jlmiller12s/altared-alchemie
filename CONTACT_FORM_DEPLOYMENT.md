# 🚀 Contact Form Deployment Checklist

## Pre-Deployment Checklist

Before deploying to Vercel, ensure:

### ✅ 1. Environment Variables Set in Vercel

Go to https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Required:**
- `RESEND_API_KEY` = `re_...` (from Resend dashboard)

**Optional but Recommended:**
- `STRIPE_PUBLIC_KEY` = `pk_live_...` (if using Stripe)
- `STRIPE_SECRET_KEY` = `sk_live_...` (if using Stripe)
- `STRIPE_WEBHOOK_SECRET` = `whsec_...` (if using Stripe)

### ✅ 2. Resend Account Setup

1. Sign up at https://resend.com (if not already)
2. Get API key from https://resend.com/api-keys
3. (Optional) Add domain at https://resend.com/domains
   - Add DNS records to your domain
   - Wait for verification (~10-30 min)

### ✅ 3. Test Locally First

```bash
# Install dependencies
cd api
npm install

# Test the API endpoint locally with Vercel CLI
vercel dev
```

Then visit `http://localhost:3000` and test a form submission.

## Deployment Steps

### Step 1: Deploy to Vercel

```bash
# From project root
git add .
git commit -m "Update contact forms to use Zoho email via Resend API"
git push origin main
```

Vercel will auto-deploy if connected to your Git repo.

**OR manually deploy:**
```bash
vercel --prod
```

### Step 2: Verify Deployment

1. Go to your live website
2. Test each form:
   - **Homepage** - Lead form with "Primary need" dropdown
   - **Contact page** - Simple contact form
   - **Resources page** - AI Playbook request

### Step 3: Check Email Delivery

1. Submit a test form
2. Check https://resend.com/emails for delivery status
3. Check `jimmie@altaredalchemie.com` inbox
4. Verify email format and reply-to address

### Step 4: Monitor Logs

1. Go to Vercel Dashboard
2. **Deployments** → Latest → **Functions**
3. Click on `api/contact-form`
4. Check for any errors

## Common Issues & Solutions

### Issue: "Failed to send email"

**Solution:**
- Check `RESEND_API_KEY` is set in Vercel
- Verify API key is valid at https://resend.com/api-keys
- Check Vercel function logs for detailed error

### Issue: Emails go to spam

**Solution:**
- Set up custom domain in Resend (not @resend.dev)
- Add SPF, DKIM, DMARC records
- Whitelist noreply@altaredalchemie.com in Zoho

### Issue: CORS errors in browser

**Solution:**
- Verify API is deployed to same domain
- Check browser console for specific error
- CORS headers are already set in `/api/contact-form.js`

### Issue: Form submission hangs

**Solution:**
- Check browser Network tab (F12)
- Verify `/api/contact-form` endpoint is accessible
- Check Vercel function timeout (default 10s)

## Email Quotas

**Resend Free Plan:**
- 3,000 emails/month
- 100 emails/day

**Resend Pro Plan ($20/month):**
- 50,000 emails/month
- Unlimited daily sends

Monitor usage at: https://resend.com/usage

## Testing Commands

### Test API Endpoint Directly

```bash
curl -X POST https://YOUR-DOMAIN.com/api/contact-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test",
    "formType": "Test"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "id": "..."
}
```

## Rollback Plan

If something goes wrong, you can temporarily revert forms to `mailto:` links:

1. Find form submission handlers (search for `fetch('/api/contact-form')`)
2. Replace with old `mailto:` link code
3. Push to git

Or rollback deployment in Vercel:
1. Go to **Deployments**
2. Find previous working deployment
3. Click **...** → **Promote to Production**

## Post-Deployment Monitoring

**Week 1:**
- Check daily for form submissions
- Monitor Resend delivery rates
- Check spam folder for emails
- Review Vercel function logs

**Ongoing:**
- Set up Resend webhook for delivery events (optional)
- Monitor email quota usage
- Check for 500 errors in Vercel logs

## Support

- **Resend Issues:** support@resend.com or https://resend.com/docs
- **Vercel Issues:** https://vercel.com/help
- **Zoho Issues:** https://help.zoho.com/portal/en/home

---

## 🎉 Ready to Deploy!

All files are updated and ready. Just push to Git and Vercel will handle the rest!

```bash
git add .
git commit -m "Setup contact forms with Zoho email via Resend"
git push origin main
```

