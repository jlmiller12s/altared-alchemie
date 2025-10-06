// Local client-side env shim. Edit or inject via window.__ENV before load.
window.__ENV = Object.assign({
  FEATURE_LEGACY_AVATAR_NAV: false,
  SITE_CONTACT_EMAIL: '',
  LEGACY_AVATAR_TYPEFORM_URL: '',
  LEGACY_AVATAR_WEBHOOK_URL: 'http://localhost:5179/api/intake/typeform',
  LEGACY_AVATAR_TYPEFORM_WEBHOOK_SECRET: 'LEGACY_KEY'// change in production
}, window.__ENV || {});

