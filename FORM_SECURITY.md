# Form security and activation

Deployed to https://altaredalchemie.com and https://www.altaredalchemie.com on October 14, 2026.

## Active production setup

- Vercel production release: `dpl_J3DuFBWFZyLL7DvPuhtu35jM9fNH` (first verified protected release).
- Cloudflare Managed Turnstile widget: `Altared Alchemie website forms`, restricted to the two website hostnames. Keys are stored in Vercel; the private key is a Secret.
- Persistent Upstash Redis resource: `altared-form-security`, free plan, automatic paid upgrades disabled. Connected to the website project. The code accepts Vercel's `KV_REST_API_URL` and `KV_REST_API_TOKEN` as well as the direct Upstash variable names below.
- Vercel firewall enabled with the published `Limit public form submissions` rule: 10 POST requests per IP per 600 seconds across `/api/contact-form`, `/api/agreement-acceptance`, and `/api/atpt-agreement-acceptance`. Stripe webhooks are excluded. This supplements Vercel's existing system mitigations; global Bot Protection and the paid OWASP ruleset were not enabled.
- Cloudflare's 18 official skills are installed for Codex under `C:\Users\jlmil\.agents\skills`. Its MCP server is registered in Codex and authenticated, with Turnstile read/write permissions and required base account access. The connection was verified with a successful widget listing.

## Verified

- 12 automated server tests and nine browser scenarios passed.
- A production-configured release was tested before domain promotion. Testing caught and fixed an ESM/CommonJS loading issue by declaring the API package as an ES module.
- Actual Redis and Cloudflare services rejected an intentionally invalid token; missing origins and tokens were rejected before mail delivery.
- Both public hostnames serve the protected form, public-only configuration endpoint, and the new CSP header.
- The live inquiry form displayed Cloudflare's successful verification and enabled Submit. No real email or payment was sent during testing, so inbox delivery itself was not tested.
- Deployment source was isolated from existing local homepage redesigns and other unrelated edits. Those local edits were preserved.

## Findings

The supplied email is consistent with automated inquiry-form spam. It does not establish that the website, mailbox, or hosting account was compromised. The contact API previously accepted a name and any email containing `@`, then sent mail without a bot check or rate limit. CORS response headers alone did not prevent direct API calls. The old handler also ignored Resend's returned `error` object and could report success when mail failed.

The public inquiry, contact, and homepage forms now share one protected submission flow. Server verification is mandatory; removing the browser widget or posting directly does not bypass it. There is no development or outage bypass.

## Configuration reference for future deployments

1. In Cloudflare Turnstile, create a Managed widget for `altaredalchemie.com` and `www.altaredalchemie.com`. This does not require moving DNS to Cloudflare. Keep hostname restrictions enabled.
2. Create or connect a persistent Upstash Redis database. Use its HTTPS REST URL and write-capable REST token, not an expiring temporary database or read-only token.
3. In Vercel project `altared-alchemie-website` (`prj_9GViC9Xdalt90vVO2nyQ2RSGuh5L`), add these environment variables for the deployment environment:

   | Variable | Purpose |
   | --- | --- |
   | `TURNSTILE_SITE_KEY` | Public widget key |
   | `TURNSTILE_SECRET_KEY` | Private server verification secret |
   | `UPSTASH_REDIS_REST_URL` | HTTPS Redis REST endpoint |
   | `UPSTASH_REDIS_REST_TOKEN` | Private Redis token |
   | `RESEND_API_KEY` | Existing mail provider credential |

   Store secrets in Vercel, never in HTML, Git, chat, or screenshots. `api/form-config.js` returns only the public site key. Vercel supplies its own `VERCEL` and `VERCEL_ENV` variables.
4. For a staging deployment, explicitly add its exact HTTPS origin to `FORM_ALLOWED_ORIGINS` in that environment and its hostname to the Turnstile widget. Comma-separated exact origins are supported; wildcards are not. Production requires no extra origins. Use a separate Redis database for staging if desired; counters are also separated by `VERCEL_ENV`.
5. Deploy the API, `form-security.js`, all three updated HTML pages, and `vercel.json` together. This checkout has pre-existing homepage edits and other unrelated changes: review them before committing or deploying the entire directory. Preserve `api/_lib/contact-security.mjs` as an API dependency.
6. Verify one real submission on each form, receipt in the owner inbox, and inquiry redirect. Confirm missing/invalid tokens are rejected and no mail arrives. Test the rate-limit boundary in staging rather than flooding production. Confirm successful browser verification from both production hostnames.

**Do not deploy this version without the required configuration:** it deliberately returns 503 and displays the direct email address instead of allowing unverified mail.

The Vercel connector initially returned HTTP 403. The official Vercel CLI successfully used the existing account authentication, allowing configuration, deployment, and verification to complete.

## Implemented controls

- Cloudflare Siteverify with a five-second timeout, exact expected hostname checks, and the `contact` action. Cloudflare enforces token expiry and single use.
- Atomic Redis counters shared across serverless instances: 10 attempts per IP per 10 minutes; 3 verified submissions per email per hour; 50 verified submissions total per hour. Limits use expiring windows starting at the first counted request. IP limits count valid-shaped attempts before verification; email/global limits count after verification, including failed delivery attempts.
- Redis identities are HMAC hashes, not plaintext IP addresses or email addresses. Provider failures stop delivery rather than disabling limits. On Vercel, the IP comes from its overwritten `x-forwarded-for` header; do not port this trust assumption unchanged to another host/proxy.
- Hidden honeypot, exact origin allowlist, JSON-only requests, 16 KiB parsed-body limit, typed and length-bounded fields, newline/control-character rejection in email header inputs, fixed recipient and form-type allowlist, and server-side privacy consent for forms that show that checkbox.
- Plaintext email, correct Resend failure handling, no personal data or tokens in new contact error logs, and no provider IDs in public success responses.
- Browser submission locking, token refresh after attempts, expired-token handling, and direct-email fallback if security services fail. Inquiry no longer uses a GET fallback that could put personal data in a URL.
- Checkout rejects untrusted/missing origins and uses fixed payment redirect URLs. Added a narrow CSP restricting embedding, plugins, and base URL changes while retaining existing scripts/integrations. This is not a full script CSP.

## Verification

Run `node --test tests/contact-security.test.mjs` from the repository. The suite uses fake providers and sends no mail. It covers accepted submissions, consent, bad origins, malformed/large payloads, honeypots, missing/invalid/replayed/wrong-host/wrong-action tokens, missing configuration, outages, Resend errors, and all three rate-limit scopes across new handler instances.

Nine browser scenarios were also run in headless Microsoft Edge against the actual three HTML pages with mocked Turnstile and API responses: success, rate-limit rejection, and unavailable configuration on each page, including token expiry, button locking, field preservation on errors, reset on success, and inquiry redirect. No real mail or payments were sent. Live vendor rejection checks and deployed routing were subsequently verified as described above. Real inbox delivery remains untested.

## Hosting protections and remaining scope

Application controls do not replace the host firewall or protect every endpoint. The live endpoint rate-limit rule is now enabled. Tune it using observed traffic, accounting for shared office networks. Consider broader Bot Protection only after checking effects on legitimate integrations and crawlers. Keep Stripe webhooks exempt from browser challenges. Review existing rules before changing them. Vercel's edge must absorb volumetric traffic before it invokes functions or Redis.

The separate agreement-acceptance endpoints have email side effects and are not covered by the contact widget. The ATPT route accepts client signer details and sends to the supplied email; publicly known signer details in the Faith Haven route are not authentication. Protect these with expiring signed invitation links, durable replay prevention, and endpoint-specific throttling before relying on them as authenticated signatures. These workflows now have edge throttling but were not redesigned with authenticated signer invitations in this change. Stripe webhook replay handling, broader dependency auditing, third-party chatbot behavior, and account security were not fully audited. No claim of comprehensive protection or compromise diagnosis is made.

## Sources

- [Cloudflare server verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare widget integration](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Upstash Redis REST API](https://upstash.com/docs/redis/features/restapi)
- [Vercel request headers](https://vercel.com/docs/headers/request-headers)
