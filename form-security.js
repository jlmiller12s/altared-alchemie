/* Shared contact, inquiry, and homepage form controller. */
(() => {
  const form = document.querySelector('[data-protected-form]');
  if (!form) return;
  const status = form.querySelector('[role="status"]');
  const button = form.querySelector('button[type="submit"]');
  const label = button.textContent;
  let token = '';
  let widget;
  let busy = false;
  button.disabled = true;
  const unavailable = 'The form is temporarily unavailable. Please email jimmie@altaredalchemie.com, or reload to try again.';
  status.textContent = 'Loading security check…';

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    if (!token) { status.textContent = 'Please complete the security check.'; return; }
    busy = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = 'Sending your message…';
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name, email: data.email, message: data.message, need: data.need,
          consent: Boolean(form.querySelector('[name="consent"]')?.checked),
          website: data.website, formType: form.dataset.protectedForm, turnstileToken: token
        }),
        signal: AbortSignal.timeout(20000)
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || 'Unable to send. Please try again.');
      if (form.dataset.protectedForm === 'Inquiry') { window.location.assign('/thank-you.html'); return; }
      form.reset();
      status.textContent = 'Message sent! We will reply within one business day.';
    } catch (error) {
      status.textContent = error.name === 'TimeoutError' ? 'The request timed out. Please email jimmie@altaredalchemie.com if you need help.' : (error.message || unavailable);
    } finally {
      busy = false;
      token = '';
      button.textContent = label;
      button.disabled = true;
      if (widget !== undefined) window.turnstile.reset(widget);
    }
  });

  async function initialize() {
    try {
      const response = await fetch('/api/form-config', { signal: AbortSignal.timeout(8000), cache: 'no-store' });
      if (!response.ok) throw new Error('configuration_unavailable');
      const config = await response.json();
      if (!config.siteKey) throw new Error('configuration_unavailable');
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const timer = setTimeout(() => reject(new Error('widget_timeout')), 15000);
        window.aaTurnstileReady = () => { clearTimeout(timer); resolve(); };
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=aaTurnstileReady&render=explicit';
        script.async = true;
        script.onerror = () => { clearTimeout(timer); reject(new Error('widget_unavailable')); };
        document.head.appendChild(script);
      });
      widget = window.turnstile.render(form.querySelector('[data-security-widget]'), {
        sitekey: config.siteKey, action: 'contact', theme: 'dark', size: 'flexible',
        callback: value => {
          token = value;
          button.disabled = busy;
          if (['Loading security check…', 'Please complete the security check.', unavailable].includes(status.textContent)) status.textContent = '';
        },
        'expired-callback': () => { token = ''; button.disabled = true; status.textContent = 'Please complete the security check.'; },
        'error-callback': () => { token = ''; button.disabled = true; status.textContent = unavailable; }
      });
    } catch {
      status.textContent = unavailable;
    }
  }
  initialize();
})();
