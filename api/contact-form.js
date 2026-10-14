import { Resend } from 'resend';
import { createHandler } from './_lib/contact-security.mjs';

export default createHandler({
  send: payload => new Resend(process.env.RESEND_API_KEY).emails.send(payload)
});
