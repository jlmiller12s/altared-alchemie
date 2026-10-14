import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';

const origins = ['https://altaredalchemie.com', 'https://www.altaredalchemie.com'];
const unavailable = 'The form is temporarily unavailable. Please email jimmie@altaredalchemie.com.';
// Atomic counters with expiry, shared across serverless instances. No in-memory fallback.
const limitScript = `local n = redis.call('INCR', KEYS[1])
if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return {n, redis.call('TTL', KEYS[1])}`;

export function createHandler({ env = process.env, request = (...args) => fetch(...args), send } = {}) {
  // Vercel's Upstash integration supplies KV_* names; direct Upstash uses UPSTASH_*.
  env = { ...env, UPSTASH_REDIS_REST_URL: env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL,
    UPSTASH_REDIS_REST_TOKEN: env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN };
  // Explicit operator-controlled staging origins; never infer trust from Host.
  const allowedOrigins = [...origins, ...(env.FORM_ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(value => {
    try { const url = new URL(value); return url.protocol === 'https:' && url.origin === value; } catch { return false; }
  })];
  const hosts = allowedOrigins.map(origin => new URL(origin).hostname);
  async function limit(kind, identity, maximum, seconds) {
    const digest = createHmac('sha256', env.UPSTASH_REDIS_REST_TOKEN).update(identity).digest('hex');
    const response = await request(env.UPSTASH_REDIS_REST_URL, {
      method: 'POST', headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', limitScript, '1', `aa:contact:${env.VERCEL_ENV || 'local'}:${kind}:${digest}`, String(seconds)]),
      signal: AbortSignal.timeout(5000)
    });
    const result = await response.json();
    if (!response.ok || result.error || !Array.isArray(result.result) ||
        !Number.isInteger(result.result[0]) || !Number.isInteger(result.result[1]) ||
        result.result[0] < 1 || result.result[1] < 0) throw new Error('rate_limit_unavailable');
    return { allowed: result.result[0] <= maximum, retry: Math.max(1, result.result[1]) };
  }

  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Vary', 'Origin');
    res.setHeader('Allow', 'POST, OPTIONS');
    if (!allowedOrigins.includes(req.headers.origin)) return res.status(403).json({ error: 'Request origin not allowed.' });
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {
      return res.status(415).json({ error: 'JSON required.' });
    }
    try {
      if (Number(req.headers['content-length']) > 16384 || Buffer.byteLength(JSON.stringify(req.body) || '') > 16384) {
        return res.status(413).json({ error: 'Submission too large.' });
      }
      const body = req.body;
      if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ error: 'Invalid submission.' });
      if (body.website) return res.status(200).json({ success: true });
      const field = (key, max, required = false) => {
        const value = body[key] ?? '';
        if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new Error('invalid_fields');
        return value.trim();
      };
      let name, email, message, need, formType, token;
      try {
        name = field('name', 120, true);
        email = field('email', 254, true);
        message = field('message', 5000);
        need = field('need', 120);
        formType = field('formType', 20, true);
        token = field('turnstileToken', 2048);
        if (/[\x00-\x1f\x7f]/.test(name + email + need) ||
            !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
            !['Contact', 'Inquiry', 'New Lead'].includes(formType) ||
            (formType === 'Inquiry' && !message) ||
            (formType !== 'Inquiry' && body.consent !== true)) throw new Error('invalid_fields');
      } catch {
        return res.status(400).json({ error: 'Please check the form fields and privacy consent.' });
      }
      if (!env.TURNSTILE_SECRET_KEY || !env.TURNSTILE_SITE_KEY || !env.UPSTASH_REDIS_REST_URL ||
          !env.UPSTASH_REDIS_REST_TOKEN || !env.RESEND_API_KEY) return res.status(503).json({ error: unavailable });
      if (!token) return res.status(400).json({ error: 'Please complete the security check.' });
      // Vercel overwrites this header; do not trust arbitrary client IP headers.
      const ip = env.VERCEL === '1' ? String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() : req.socket?.remoteAddress;
      if (!isIP(ip || '')) return res.status(503).json({ error: unavailable });
      const attempts = await limit('ip', ip, 10, 600);
      if (!attempts.allowed) {
        res.setHeader('Retry-After', String(attempts.retry));
        return res.status(429).json({ error: 'Too many attempts. Please wait a few minutes and try again.' });
      }
      const verification = await request('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
        signal: AbortSignal.timeout(5000)
      });
      if (!verification.ok) throw new Error('verification_unavailable');
      const verified = await verification.json();
      if (verified.success !== true || !hosts.includes(verified.hostname) || verified.action !== 'contact') {
        return res.status(400).json({ error: 'Security check failed or expired. Please try again.' });
      }
      // Only verified visitors consume the email/global budgets.
      for (const [kind, identity, max, seconds] of [['email', email.toLowerCase(), 3, 3600], ['global', 'all', 50, 3600]]) {
        const budget = await limit(kind, identity, max, seconds);
        if (!budget.allowed) {
          res.setHeader('Retry-After', String(budget.retry));
          return res.status(429).json({ error: 'Submission limit reached. Please try later or email jimmie@altaredalchemie.com.' });
        }
      }
      const result = await send({
        from: 'Altared Alchemie <noreply@altaredalchemie.com>', to: ['jimmie@altaredalchemie.com'], replyTo: email,
        subject: `${formType} Form: ${name}`,
        text: `New ${formType} Form Submission\n\nName: ${name}\nEmail: ${email}\n${need ? `Primary Need: ${need}\n` : ''}\nMessage:\n${message}\n`
      });
      if (result.error || !result.data?.id) throw new Error('delivery_failed');
      return res.status(200).json({ success: true });
    } catch {
      // Never log submitted personal data, tokens, or provider responses.
      console.error('contact_form_dependency_failure');
      return res.status(503).json({ error: unavailable });
    }
  };
}
