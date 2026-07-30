import crypto from 'node:crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const AGREEMENT = {
  id: 'ATPT-P1-2026-0729',
  version: '2026-07-29',
  title: 'EMC Studios / ATPT Phase One Strategic Concept and Partner Prototype',
  url: 'https://www.altaredalchemie.com/atpt-phase-one-agreement',
  pdfUrl: 'https://www.altaredalchemie.com/docs/Altared_Alchemie_EMC_ATPT_Phase_One_SOW.pdf',
  providerEmail: 'jlmiller12s@gmail.com',
  organizations: {
    'emc-atpt': 'EMC Studios / ATPT',
    'altared-alchemie': 'Altared Alchemie AI Services'
  },
  terms: [
    'Fixed fee: $10,000 USD.',
    'Payment: $5,000 deposit due upon signing and before work begins; $5,000 due at Phase One completion and before editable source files are released.',
    'Duration: approximately 6 to 8 weeks after signing, cleared deposit, and receipt of kickoff materials.',
    'Scope: discovery, prototype architecture, one visual direction, approximately 8 to 10 desktop-first concept screens, up to three representative mobile compositions, a clickable private prototype, two TRAINTRAX hero concepts, one sponsor-neutral activation concept, handoff, and a preliminary production roadmap.',
    'Revisions: two structured checkpoints. Additional work requires a written change order or is billed at $100 per hour when authorized.',
    'Phase One is a private visual concept engagement. Public website development, production code, live integrations, working accounts, payments, voting, streaming, databases, and other production infrastructure are excluded.',
    'The deposit becomes nonrefundable after work begins.',
    'Client is responsible for approved content, timely consolidated feedback, permissions, and legal review of partner references, claims, privacy concepts, and intellectual property.',
    'Client-specific final design deliverables transfer after full payment, excluding Provider background materials and third-party materials.',
    'All work is confidential. Prospective partner representations require Client authorization and Client Legal approval.',
    'Acceptance, termination, liability, and professional terms are stated in the full agreement at the agreement URL and incorporated into this acceptance record.'
  ].join('\n')
};

const normalize = value => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));

export default async function handler(req, res) {
  const allowedOrigins = ['https://altaredalchemie.com', 'https://www.altaredalchemie.com'];
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'This request origin is not allowed.' });
  }
  if (allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  try {
    const {
      signerRole,
      signerName,
      signerEmail,
      signature,
      authority,
      agreed,
      website,
      agreementId,
      agreementVersion
    } = req.body || {};

    if (website) return res.status(200).json({ success: true });

    const organization = AGREEMENT.organizations[signerRole];
    if (!organization || agreementId !== AGREEMENT.id || agreementVersion !== AGREEMENT.version) {
      return res.status(400).json({ error: 'This agreement link is not valid.' });
    }

    const cleanName = String(signerName || '').trim().replace(/\s+/g, ' ');
    const cleanEmail = String(signerEmail || '').trim().toLowerCase();
    if (!authority || !agreed || cleanName.length < 3 || cleanName.length > 120 || !validEmail(cleanEmail) || normalize(signature) !== normalize(cleanName)) {
      return res.status(400).json({ error: 'The signer information, authority confirmation, signature, or consent is incomplete.' });
    }

    if (signerRole === 'altared-alchemie' && (normalize(cleanName) !== 'jimmie miller' || cleanEmail !== AGREEMENT.providerEmail)) {
      return res.status(400).json({ error: 'The Altared Alchemie signer information is not valid.' });
    }

    const acceptedAt = new Date();
    const acceptedAtText = acceptedAt.toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      dateStyle: 'full',
      timeStyle: 'long'
    });
    const ipAddress = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unavailable').split(',')[0].trim().slice(0, 100);
    const userAgent = String(req.headers['user-agent'] || 'Unavailable').slice(0, 500);
    const termsHash = crypto.createHash('sha256').update(AGREEMENT.terms).digest('hex');
    const recordSource = [
      AGREEMENT.id,
      AGREEMENT.version,
      organization,
      cleanName,
      cleanEmail,
      acceptedAt.toISOString(),
      ipAddress,
      userAgent,
      termsHash
    ].join('|');
    const acceptanceId = crypto.createHash('sha256').update(recordSource).digest('hex').slice(0, 16).toUpperCase();

    const text = `EMC STUDIOS / ATPT PHASE ONE AGREEMENT - ACCEPTANCE CONFIRMATION

Agreement: ${AGREEMENT.title}
Agreement ID: ${AGREEMENT.id}
Agreement version: ${AGREEMENT.version}
Acceptance ID: ${acceptanceId}
Terms SHA-256: ${termsHash}

Signer: ${cleanName}
Organization: ${organization}
Email: ${cleanEmail}
Accepted at: ${acceptedAtText}
IP address: ${ipAddress}
Browser record: ${userAgent}

The signer confirmed that they are authorized to sign for ${organization}, read the complete statement of work, agreed to its terms, and intended their typed name to serve as their electronic signature.

KEY TERMS
${AGREEMENT.terms}

Full agreement: ${AGREEMENT.url}
Branded PDF: ${AGREEMENT.pdfUrl}
`;

    const html = `<div style="font-family:Arial,sans-serif;max-width:720px;margin:auto;color:#15171a;line-height:1.6">
      <div style="height:7px;background:#e10600"></div>
      <h1 style="font-size:26px;margin:28px 0 8px">Agreement acceptance recorded</h1>
      <p style="color:#64676d;margin-top:0">${escapeHtml(AGREEMENT.title)}</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0">
        ${[
          ['Acceptance ID', acceptanceId],
          ['Signer', cleanName],
          ['Organization', organization],
          ['Email', cleanEmail],
          ['Accepted at', acceptedAtText],
          ['IP address', ipAddress],
          ['Terms SHA-256', termsHash]
        ].map(([label,value]) => `<tr><td style="padding:9px;border-bottom:1px solid #ddd;color:#666;vertical-align:top">${label}</td><td style="padding:9px;border-bottom:1px solid #ddd;font-weight:bold;word-break:break-word">${escapeHtml(value)}</td></tr>`).join('')}
      </table>
      <p>The signer confirmed that they are authorized to sign for <strong>${escapeHtml(organization)}</strong>, read the complete statement of work, agreed to its terms, and intended their typed name to serve as their electronic signature.</p>
      <h2 style="font-size:18px;margin-top:28px">Key terms</h2>
      <pre style="white-space:pre-wrap;font:14px/1.6 Arial,sans-serif;background:#f4f1ea;padding:18px;border-radius:8px">${escapeHtml(AGREEMENT.terms)}</pre>
      <p><a href="${AGREEMENT.url}" style="color:#e10600">View the full agreement</a> | <a href="${AGREEMENT.pdfUrl}" style="color:#e10600">Download the branded PDF</a></p>
      <p style="font-size:12px;color:#777;margin-top:28px">Agreement ${AGREEMENT.id} | Version ${AGREEMENT.version} | Browser record: ${escapeHtml(userAgent)}</p>
    </div>`;

    const recipients = [...new Set([cleanEmail, AGREEMENT.providerEmail])];
    const { data, error } = await resend.emails.send({
      from: 'Altared Alchemie Agreements <noreply@altaredalchemie.com>',
      to: recipients,
      replyTo: cleanEmail,
      subject: `Agreement accepted by ${cleanName} - EMC Studios / ATPT Phase One`,
      text,
      html
    });
    if (error) throw new Error(error.message || 'Email delivery failed.');

    return res.status(200).json({ success: true, acceptanceId, emailId: data?.id });
  } catch (error) {
    console.error('ATPT agreement acceptance error:', error);
    return res.status(500).json({ error: 'The agreement could not be recorded right now.' });
  }
}
