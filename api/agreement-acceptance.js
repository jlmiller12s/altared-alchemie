import crypto from 'node:crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const AGREEMENT = {
  id: 'FHH-WEB-2026-0803',
  version: '2026-07-19',
  recipients: ['Faith.Haven.House@gmail.com', 'jlmiller12s@gmail.com'],
  signers: {
    'faith-haven-house': { name: 'Marshall Robinson', email: 'Faith.Haven.House@gmail.com', organization: 'Faith Haven House' },
    'altared-alchemie': { name: 'Jimmie Miller', email: 'jlmiller12s@gmail.com', organization: 'Altared Alchemie' }
  },
  terms: [
    'Website pages and services listed in the Faith Haven House website statement of work, including SEO, AI enablement training, and three PowerPoint/PDF template builds.',
    'Faith Haven House waives the photoshoot and approved existing materials will be used.',
    'Launch: Monday, August 3, 2026 at 12:01 a.m. CST.',
    'Final payment expected within two to three calendar days after launch, August 5–6, 2026.'
  ].join('\n')
};

const normalize = value => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));

export default async function handler(req, res) {
  const allowedOrigins = ['https://altaredalchemie.com', 'https://www.altaredalchemie.com'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  try {
    const { signerRole, signerName, signerEmail, signature, agreed, agreementId, agreementVersion } = req.body || {};
    const expected = AGREEMENT.signers[signerRole];
    if (!expected || agreementId !== AGREEMENT.id || agreementVersion !== AGREEMENT.version) {
      return res.status(400).json({ error: 'This agreement link is not valid.' });
    }
    if (!agreed || normalize(signerName) !== normalize(expected.name) || normalize(signature) !== normalize(expected.name) || normalize(signerEmail) !== normalize(expected.email)) {
      return res.status(400).json({ error: 'The signer information or consent is incomplete.' });
    }

    const acceptedAt = new Date();
    const acceptedAtText = acceptedAt.toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'long' });
    const ipAddress = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unavailable').split(',')[0].trim();
    const userAgent = String(req.headers['user-agent'] || 'Unavailable').slice(0, 500);
    const recordSource = [AGREEMENT.id, AGREEMENT.version, expected.name, expected.email, acceptedAt.toISOString(), ipAddress, userAgent, AGREEMENT.terms].join('|');
    const acceptanceId = crypto.createHash('sha256').update(recordSource).digest('hex').slice(0, 16).toUpperCase();

    const text = `FAITH HAVEN HOUSE WEBSITE AGREEMENT — ACCEPTANCE CONFIRMATION

Agreement ID: ${AGREEMENT.id}
Agreement version: ${AGREEMENT.version}
Acceptance ID: ${acceptanceId}

Signer: ${expected.name}
Organization: ${expected.organization}
Email: ${expected.email}
Accepted at: ${acceptedAtText}
IP address: ${ipAddress}
Browser record: ${userAgent}

The signer confirmed that they are authorized to sign for ${expected.organization}, read the statement of work, agreed to its terms, and intended their typed name to serve as their electronic signature.

KEY TERMS
${AGREEMENT.terms}

Full agreement: https://www.altaredalchemie.com/faith-haven-agreement
`;

    const html = `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#181818;line-height:1.6">
      <div style="height:6px;background:linear-gradient(90deg,#e82d05,#f3b73f)"></div>
      <h1 style="font-size:26px;margin:28px 0 8px">Agreement acceptance recorded</h1>
      <p style="color:#5d5d5d;margin-top:0">Faith Haven House new website statement of work</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0">
        ${[['Acceptance ID',acceptanceId],['Signer',expected.name],['Organization',expected.organization],['Email',expected.email],['Accepted at',acceptedAtText],['IP address',ipAddress]].map(([label,value]) => `<tr><td style="padding:9px;border-bottom:1px solid #ddd;color:#666">${label}</td><td style="padding:9px;border-bottom:1px solid #ddd;font-weight:bold">${escapeHtml(value)}</td></tr>`).join('')}
      </table>
      <p>The signer confirmed that they are authorized to sign for <strong>${escapeHtml(expected.organization)}</strong>, read the statement of work, agreed to its terms, and intended their typed name to serve as their electronic signature.</p>
      <h2 style="font-size:18px;margin-top:28px">Key terms</h2>
      <pre style="white-space:pre-wrap;font:14px/1.6 Arial,sans-serif;background:#f6f3ed;padding:18px;border-radius:8px">${escapeHtml(AGREEMENT.terms)}</pre>
      <p><a href="https://www.altaredalchemie.com/faith-haven-agreement" style="color:#c32605">View the full agreement</a></p>
      <p style="font-size:12px;color:#777;margin-top:28px">Agreement ${AGREEMENT.id} · Version ${AGREEMENT.version} · Browser record: ${escapeHtml(userAgent)}</p>
    </div>`;

    const { data, error } = await resend.emails.send({
      from: 'Altared Alchemie Agreements <noreply@altaredalchemie.com>',
      to: AGREEMENT.recipients,
      replyTo: expected.email,
      subject: `Agreement accepted by ${expected.name} — Faith Haven House website`,
      text,
      html
    });
    if (error) throw new Error(error.message || 'Email delivery failed.');

    return res.status(200).json({ success: true, acceptanceId, emailId: data?.id });
  } catch (error) {
    console.error('Agreement acceptance error:', error);
    return res.status(500).json({ error: 'The agreement could not be recorded right now.' });
  }
}
