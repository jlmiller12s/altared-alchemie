# Legacy Avatar Server

Dev server for Typeform intake and DocuSign webhooks.

1. Copy `.env.example` to `.env` and fill values.
2. Install deps: `npm i`
3. Run: `npm run dev` (defaults to port 5178)

Endpoints
- POST /api/intake/typeform – verifies signature, normalizes payload, returns `{ ok: true, clientId, intakeId }`
- POST /api/docusign/envelope – creates envelope from template (stub unless DocuSign creds provided)
- POST /api/docusign/webhook – receives Connect events


