# Downloads Page - Quick Start Guide

## What's Been Created

A complete downloads page with payment integration for your **Devdoc Voice Generator** app has been added to your Altared Alchemie website.

## Files Added/Modified

### New Files:
1. **`downloads.html`** - Complete downloads page with product info, pricing, and payment form
2. **`STRIPE_SETUP_GUIDE.md`** - Comprehensive guide for setting up Stripe payments
3. **`DOWNLOADS_PAGE_README.md`** - This file

### Modified Files:
1. **`index.html`** - Added "Downloads" link to navigation
2. **`server/src/index.js`** - Added Stripe payment endpoints
3. **`server/package.json`** - Added Stripe dependency

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

This will install the Stripe package and other dependencies.

### 2. Set Up Stripe Account (Development Mode)

1. Sign up at https://stripe.com (if you haven't already)
2. Get your test API keys from https://dashboard.stripe.com/test/apikeys
3. Create a `.env` file in the `server` directory if you don't have one:

```env
# Stripe Test Keys (start with these)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### 3. Add Public Key to Website

Update your `env.js` file to include the Stripe publishable key:

```javascript
window.ENV = {
  STRIPE_PUBLIC_KEY: 'pk_test_YOUR_PUBLISHABLE_KEY_HERE'
};
```

### 4. Start Your Server

```bash
cd server
npm start
```

Your server will run on:
- **Static files:** http://localhost:5177
- **API:** http://localhost:5179

### 5. Test the Downloads Page

1. Open http://localhost:5177/downloads.html
2. Fill out the purchase form
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete the checkout

## Page Features

### Product Information
- Professional product description
- Key features list (6 major features)
- System requirements
- Platform selection (Windows, macOS Intel, macOS Apple Silicon)

### Payment Integration
- Stripe Checkout integration
- Secure payment processing
- Email delivery of license and download link
- 30-day money-back guarantee

### Social Proof
- Customer testimonials section
- 5-star ratings

### Support
- Comprehensive FAQ section
- Contact support banner
- Email support integration

### Design
- Matches your existing website aesthetic
- Dark theme with green accent colors
- Responsive design (mobile-friendly)
- GSAP animations
- Loading states and error handling

## Pricing

Currently set to **$49 one-time purchase** with:
- Single user license
- Free lifetime updates
- Email & community support
- 30-day money-back guarantee

You can easily change the price in `downloads.html`:

```javascript
// Look for this line (around line 462):
price: 4900 // $49.00 in cents - change to any amount
```

## Customization

### Change Price
Edit `downloads.html` line ~462 to change the amount (in cents).

### Modify Features
Edit the "Key Features" section in `downloads.html` starting around line 144.

### Update Testimonials
Edit the testimonials section around line 276 in `downloads.html`.

### Change Platform Options
Edit the platform dropdown around line 256 in `downloads.html`.

## Next Steps

### For Development/Testing:
1. ✅ Install Stripe package (`npm install` in server directory)
2. ✅ Get Stripe test keys and add to `.env`
3. ✅ Test purchase flow with test credit card
4. ⬜ Set up webhook endpoint (see STRIPE_SETUP_GUIDE.md)
5. ⬜ Configure email service for sending download links

### For Production:
1. ⬜ Switch to Stripe live keys
2. ⬜ Set up production webhook endpoint
3. ⬜ Configure email delivery service (SendGrid, Mailgun, etc.)
4. ⬜ Host actual app download files
5. ⬜ Generate and deliver license keys
6. ⬜ Test full purchase flow with real card (then refund)

## Integration with Your Devdoc App

The downloads page is designed to deliver:
1. **Download link** - Links to platform-specific installers (Windows .exe, macOS .dmg)
2. **License key** - Unique key to activate the app
3. **Documentation** - Links to user guide and getting started docs

You'll need to:
- Host the compiled app installers somewhere secure (S3, DigitalOcean Spaces, etc.)
- Implement license key generation and validation in the app
- Set up email templates for sending purchase confirmations

## Testing

### Test Credit Cards (Test Mode Only):
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0027 6000 3184

Use:
- Any future expiration date
- Any 3-digit CVC
- Any billing postal code

## Support & Documentation

- **Stripe Setup Guide:** See `STRIPE_SETUP_GUIDE.md`
- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Testing Guide:** https://stripe.com/docs/testing

## Email Template Example

When a purchase is completed, you'll want to send an email like:

```
Subject: Your Devdoc Voice Generator License

Hi [Customer Name],

Thank you for purchasing Devdoc Voice Generator!

Download your app:
[Platform]: [Download Link]

Your License Key: XXXX-XXXX-XXXX-XXXX

Getting Started:
1. Download and install the app
2. Launch the app
3. Enter your license key when prompted
4. Configure your keyboard shortcut
5. Start documenting!

Need help? Check out our documentation:
[Link to documentation]

Questions? Reply to this email or visit our support page.

Best regards,
The Altared Alchemie Team
```

## File Structure

```
Altared-Alchemie-website/
├── downloads.html              ← Main downloads page
├── STRIPE_SETUP_GUIDE.md      ← Stripe integration guide
├── DOWNLOADS_PAGE_README.md   ← This file
├── index.html                 ← Updated with Downloads link
├── env.js                     ← Add STRIPE_PUBLIC_KEY here
└── server/
    ├── package.json           ← Updated with Stripe dependency
    └── src/
        └── index.js           ← Updated with payment endpoints
```

## Questions?

If you need help:
1. Check the `STRIPE_SETUP_GUIDE.md` for detailed Stripe setup
2. Review Stripe's documentation at https://stripe.com/docs
3. Test with Stripe's test mode before going live

## License & Security Notes

⚠️ **Important Security Reminders:**
- Never commit `.env` files to version control
- Never expose secret keys in frontend code
- Always validate webhook signatures
- Use HTTPS in production
- Start with test mode and thoroughly test before going live

---

**Built with:** Stripe Checkout, TailwindCSS, GSAP, Express.js
**Ready for:** Development testing, requires Stripe account setup for full functionality

