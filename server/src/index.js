import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import getRawBody from 'raw-body';
import { getCurrentUser, requireUser } from './lib/auth.js';
import { saveStory } from './lib/store.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

dotenv.config();

// Initialize Stripe (add STRIPE_SECRET_KEY to your .env file)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const app = express();
const API_PORT = process.env.PORT || 5179;
const STATIC_PORT = 5177;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log paths for debugging
console.log('__dirname:', __dirname);
console.log('Static files served from:', path.join(__dirname, '../..'));

// Serve static files from the Altared-Alchemie-website directory (two levels up)
app.use(express.static(path.join(__dirname, '../..')));

app.use(morgan('dev'));

// Minimal CORS for local dev (allows the static site on 5177)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = [`http://localhost:${STATIC_PORT}`, `http://127.0.0.1:${STATIC_PORT}`];
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Typeform-Signature, Typeform-Signature');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

app.use(express.json({ limit: '2mb' }));

// Health
app.get('/healthz', (req,res)=> res.json({ ok:true }));
app.get('/api/whoami', async (req,res)=>{ const user = await getCurrentUser(); res.json({ user }); });

// Typeform webhook receiver: verifies HMAC if secret configured
app.post('/api/intake/typeform', async (req, res) => {
  try {
    // For providers that send with HMAC over raw body, we need raw buffer
    const raw = await getRawBody(req, { length: req.headers['content-length'], limit: '5mb' }).catch(()=>null);
    let body;
    try { body = raw ? JSON.parse(raw.toString()) : req.body; } catch { body = req.body; }

    // TODO: verify signature if TYPEFORM_SECRET present (implementation omitted for brevity)
    // const signature = req.headers['typeform-signature'] || req.headers['x-typeform-signature'];

    // Normalize minimal fields
    const normalized = { intakeId: body.event_id || body.form_response?.token || `intake_${Date.now()}`, hidden: body.hidden || body.form_response?.hidden || {}, answers: body.answers || body.form_response?.answers || [] };

    // Example persistence placeholder
    console.log('Intake received:', JSON.stringify(normalized).slice(0,500));

    return res.json({ ok: true, intakeId: normalized.intakeId });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ ok:false, error: 'Invalid payload' });
  }
});

// DocuSign envelope creator (stub until creds provided)
app.post('/api/docusign/envelope', async (req, res) => {
  try {
    // In a real implementation, exchange JWT for access token and call Envelopes:create
    // Here we stub success for dev
    console.log('Create envelope with:', Object.keys(req.body));
    return res.json({ ok: true, envelopeId: `env_${Date.now()}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok:false, error:'Failed to create envelope' });
  }
});

// DocuSign Connect webhook
app.post('/api/docusign/webhook', express.text({ type: '*/*' }), (req, res) => {
  console.log('DocuSign Connect event:', req.body?.slice?.(0,500));
  res.status(200).send('OK');
});

app.post('/api/stories', async (req,res)=>{
  try{
    const u = await requireUser();
    const { s1, s2, s3 } = req.body || {};
    if(!s1||!s2||!s3) return res.status(400).json({ ok:false, error:'Missing stories' });
    const ts = new Date().toISOString();
    saveStory({ userId: u.id, email: u.email, s1, s2, s3, ts });
    return res.json({ ok:true });
  }catch(err){
    if((err?.message||'').includes('Auth')) return res.status(401).json({ ok:false, error:'Auth required' });
    console.error(err); return res.status(500).json({ ok:false, error:'Server error' });
  }
});

// Stripe Checkout Session Creator for Devdoc Voice Generator
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      console.error('Stripe not initialized. Add STRIPE_SECRET_KEY to .env');
      return res.status(500).json({ ok: false, error: 'Payment system not configured' });
    }

    const { email, name, platform, productId, price } = req.body;

    // Validate input
    if (!email || !name || !platform || !productId) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Devdoc Voice Generator',
              description: `Voice-powered documentation tool for developers (${platform})`,
            },
            unit_amount: price || 500, // $5.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin || 'http://localhost:5177'}/downloads.html?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'http://localhost:5177'}/downloads.html?canceled=true`,
      metadata: {
        customer_name: name,
        platform: platform,
        product_id: productId,
      },
    });

    console.log('Checkout session created:', session.id, 'for', email);
    return res.json({ ok: true, sessionId: session.id });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ ok: false, error: 'Failed to create checkout session' });
  }
});

// Stripe Webhook Handler (for payment confirmation and license delivery)
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.warn('Stripe webhook received but not configured');
    return res.status(400).send('Webhook not configured');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session.id);
      
      // TODO: Send download link and license key via email
      const customerEmail = session.customer_email;
      const metadata = session.metadata;
      
      console.log(`Send license to ${customerEmail} for platform ${metadata.platform}`);
      // In production, integrate with email service (SendGrid, Mailgun, etc.)
      // and store license in database
      
      break;

    case 'payment_intent.succeeded':
      console.log('Payment intent succeeded:', event.data.object.id);
      break;

    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Explicitly serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'index.html'));
});

app.listen(STATIC_PORT, () => console.log(`Static server listening on :${STATIC_PORT}`));
app.listen(API_PORT, () => console.log(`API server listening on :${API_PORT}`));


