import Stripe from 'stripe';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { email, name, platform, productId, price } = req.body;

    // Validate input
    if (!email || !name || !platform || !productId) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not configured');
      return res.status(500).json({ ok: false, error: 'Payment system not configured' });
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      success_url: `${req.headers.origin || 'https://altaredalchemie.com'}/downloads?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://altaredalchemie.com'}/downloads?canceled=true`,
      metadata: {
        customer_name: name,
        platform: platform,
        product_id: productId,
      },
    });

    console.log('Checkout session created:', session.id, 'for', email);
    return res.status(200).json({ ok: true, sessionId: session.id });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Failed to create checkout session' });
  }
}

