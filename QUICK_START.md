# 🚀 Quick Start - Contact Forms Setup

## What Just Happened?

All your contact forms now send emails to **jimmie@altaredalchemie.com** via Resend API.

---

## Deploy Now (3 Steps)

### 1. Push to Git

```bash
git add .
git commit -m "Setup contact forms with Zoho email"
git push origin main
```

Vercel will auto-deploy (if connected to Git).

### 2. Verify Environment Variable

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Check:** `RESEND_API_KEY` exists (you set this up for Stripe webhooks)

If missing, get it from: https://resend.com/api-keys

### 3. Test Forms

Visit your live site and test:
- **Homepage** - Lead form
- **Contact page** - Contact form
- **Resources page** - Playbook request

Check `jimmie@altaredalchemie.com` for emails!

---

## That's It! 🎉

**Forms are now connected to your Zoho email.**

---

## Optional: Better Email Deliverability

To send from `@altaredalchemie.com` instead of `@resend.dev`:

1. Go to: https://resend.com/domains
2. Add domain: `altaredalchemie.com`
3. Add DNS records shown
4. Wait 10-30 min

See `EMAIL_SETUP_GUIDE.md` for details.

---

## Need Help?

- ❓ Setup questions → See `EMAIL_SETUP_GUIDE.md`
- 🚀 Deployment help → See `CONTACT_FORM_DEPLOYMENT.md`
- 📋 All changes → See `CONTACT_FORM_CHANGES_SUMMARY.md`
- 🔍 Not receiving emails → Check Resend dashboard: https://resend.com/emails

