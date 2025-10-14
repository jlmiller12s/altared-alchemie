# 📧 Email Contact Form Setup Guide

## Overview

All contact forms on your website now send emails to **jimmie@altaredalchemie.com** using Resend.

## ✅ What's Been Updated

### Contact Forms Updated:
1. **Homepage** (`index.html`) - Lead capture form
2. **Contact Page** (`contact.html`) - Main contact form  
3. **Resources Page** (`resources.html`) - AI Playbook request form

### Files Changed:
- ✅ Created `/api/contact-form.js` - API endpoint for form submissions
- ✅ Updated all forms to use fetch API instead of `mailto:` links
- ✅ Updated email addresses in chatbot and footer links
- ✅ All emails now go to `jimmie@altaredalchemie.com`

## 🚀 Required Setup Steps

### Step 1: Verify Resend API Key

You should already have Resend configured from the Stripe webhook setup. Verify:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Confirm `RESEND_API_KEY` exists (starts with `re_...`)

### Step 2: Configure Domain in Resend

To send from `@altaredalchemie.com` instead of `@resend.dev`:

1. Go to https://resend.com/domains
2. Click **Add Domain**
3. Enter: `altaredalchemie.com`
4. Add the DNS records shown to your domain registrar:

**TXT Record:**
```
Name: _resend
Value: (provided by Resend)
```

**MX Records:**
```
Name: altaredalchemie.com
Priority: 10
Value: feedback-smtp.us-east-1.amazonses.com
```

5. Wait 10-30 minutes for DNS propagation
6. Verify in Resend dashboard

### Step 3: Test the Forms

1. Go to your website
2. Fill out the contact form on the homepage
3. Submit the form
4. Check `jimmie@altaredalchemie.com` for the email

## 📝 How It Works

### Before (Old System):
- Forms used `mailto:` links
- Opened user's email client
- Unreliable and clunky UX

### After (New System):
1. User fills out form
2. Form data sent to `/api/contact-form` endpoint
3. API validates data
4. Resend sends email to your Zoho inbox
5. User sees success message
6. Reply-to is set to user's email for easy responses

## 🔧 Troubleshooting

### Email Not Received?

**Check Spam Folder:**
- Emails from new domains may go to spam initially
- Mark as "Not Spam" to train Zoho's filter

**Check Resend Dashboard:**
1. Go to https://resend.com/emails
2. View recent sends
3. Check delivery status

**Check Vercel Logs:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Deployments** → Latest deployment → **Functions**
4. Check `/api/contact-form` logs

### Form Shows Error?

**Verify Environment Variable:**
```bash
# Check that RESEND_API_KEY is set in Vercel
```

**Check Browser Console:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Using Test Domain Temporarily?

If you haven't set up DNS yet, you can test with Resend's domain:

Edit `/api/contact-form.js` line 54:
```javascript
from: 'Altared Alchemie <noreply@resend.dev>',  // Temporary test
```

This works immediately but shows "via resend.dev" in emails.

## 📧 Email Format

Emails will look like this:

```
From: Altared Alchemie <noreply@altaredalchemie.com>
Reply-To: customer@example.com
To: jimmie@altaredalchemie.com
Subject: Contact Form: John Doe

New Contact Form Submission

Name: John Doe
Email: customer@example.com
Primary Need: AI strategy

Message:
Looking to implement AI in our workflow.
```

## 🔐 Security

- ✅ CORS configured for your domain
- ✅ Email validation on both client and server
- ✅ Rate limiting via Vercel serverless functions
- ✅ No sensitive data exposed to client

## 💡 Tips

1. **Reply Directly:** Just hit reply - it goes to the customer's email
2. **Check Logs:** Monitor Resend dashboard for delivery issues
3. **Update Spam Filter:** Add noreply@altaredalchemie.com to safe senders
4. **Monitor Limits:** Free Resend plan = 3,000 emails/month

## 🆘 Need Help?

- Resend Docs: https://resend.com/docs
- Resend Support: support@resend.com
- Vercel Docs: https://vercel.com/docs

---

**All set!** Your contact forms are now connected to your Zoho email. 🎉

