import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from '../api/_lib/contact-security.mjs';

const env = {
  TURNSTILE_SITE_KEY: 'test-site', TURNSTILE_SECRET_KEY: 'test-secret', RESEND_API_KEY: 'test-mail',
  UPSTASH_REDIS_REST_URL: 'https://redis.example', UPSTASH_REDIS_REST_TOKEN: 'test-redis', VERCEL: '1', VERCEL_ENV: 'test'
};
const good = { name: 'Alex Smith', email: 'alex@example.com', message: 'Can we discuss a website?', formType: 'Inquiry', turnstileToken: 'valid' };
function setup(options = {}) {
  const sent = [], calls = [], counts = new Map(), tokens = new Set();
  const dependencies = {
    env: { ...env, ...options.env },
    async request(url, init) {
      const data = JSON.parse(init.body); calls.push({ url, data });
      if (url === env.UPSTASH_REDIS_REST_URL) {
        if (options.redisFailure) throw new Error('offline');
        assert.equal(data[0], 'EVAL');
        assert.match(data[1], /EXPIRE/);
        const key = data[3];
        const count = (counts.get(key) || 0) + 1; counts.set(key, count);
        return { ok: true, json: async () => ({ result: [count, Number(data[4])] }) };
      }
      assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
      assert.equal(data.secret, 'test-secret');
      if (options.verifyFailure) throw new Error('offline');
      const success = !tokens.has(data.response) && data.response !== 'bad'; tokens.add(data.response);
      return { ok: true, json: async () => ({ success, hostname: 'altaredalchemie.com', action: 'contact', ...options.verified }) };
    },
    async send(payload) { sent.push(payload); return options.sendError ? { error: { message: 'failed' } } : { data: { id: 'mail-1' }, error: null }; }
  };
  async function run(body = good, override = {}) {
    const req = { method: 'POST', headers: { origin: 'https://altaredalchemie.com', 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.1', ...override.headers }, body };
    if (override.method) req.method = override.method;
    const res = { headers: {}, code: 200, setHeader(k,v) { this.headers[k] = v; }, status(n) { this.code = n; return this; }, json(data) { this.body = data; return this; }, end() { return this; } };
    // A fresh handler for every request verifies that limits are not process-local.
    await createHandler(dependencies)(req, res); return res;
  }
  return { run, sent, calls, counts };
}
test('valid inquiry delivers to fixed owner and does not expose provider identifiers', async () => {
  const s = setup(); const r = await s.run(); assert.equal(r.code,200); assert.deepEqual(r.body,{success:true});
  assert.deepEqual(s.sent[0].to,['jimmie@altaredalchemie.com']); assert.equal(s.sent[0].replyTo,good.email);
  assert.equal(s.calls.length,4);
  for (const key of s.counts.keys()) { assert.ok(!key.includes(good.email)); assert.ok(!key.includes('192.0.2.1')); }
});
test('supports credentials provided by the Vercel Upstash integration', async () => {
  const s=setup({env:{UPSTASH_REDIS_REST_URL:undefined,UPSTASH_REDIS_REST_TOKEN:undefined,
    KV_REST_API_URL:env.UPSTASH_REDIS_REST_URL,KV_REST_API_TOKEN:env.UPSTASH_REDIS_REST_TOKEN}});
  assert.equal((await s.run()).code,200); assert.equal(s.sent.length,1);
});
test('Contact and New Lead preserve optional messages and require boolean consent', async () => {
  for (const formType of ['Contact','New Lead']) {
    const s=setup(); assert.equal((await s.run({...good,formType,message:'',consent:true})).code,200);
    for (const consent of [false,undefined,'true']) assert.equal((await s.run({...good,formType,consent})).code,400);
    assert.equal(s.sent.length,1);
  }
});
test('rejects missing/hostile origins, wrong methods and content types before any provider call', async () => {
  const s=setup();
  for (const origin of [undefined,'null','https://evil.example']) assert.equal((await s.run(good,{headers:{origin}})).code,403);
  assert.equal((await s.run(good,{method:'GET'})).code,405);
  assert.equal((await s.run(good,{method:'OPTIONS'})).code,204);
  assert.equal((await s.run(good,{headers:{'content-type':'text/plain'}})).code,415);
  assert.equal(s.calls.length,0);
});
test('rejects malformed fields, header injection, oversized bodies and missing token', async () => {
  const s=setup();
  for (const body of [null,[], 'text', {...good,name:{}}, {...good,name:' '}, {...good,email:'a@b'}, {...good,name:'A\r\nBcc: victim@example.com'}, {...good,message:''}, {...good,message:'x'.repeat(5001)}, {...good,formType:'Spam'}, {...good,turnstileToken:''}, {...good,turnstileToken:'x'.repeat(2049)}]) {
    assert.equal((await s.run(body)).code,400);
  }
  assert.equal((await s.run({...good,extra:'x'.repeat(17000)})).code,413);
  assert.equal(s.sent.length,0); assert.equal(s.calls.length,0);
});
test('honeypot returns success without verification or email', async () => {
  const s=setup(); assert.equal((await s.run({...good,website:'bot.example'})).code,200);
  assert.equal(s.calls.length,0); assert.equal(s.sent.length,0);
});
test('invalid, replayed, wrong-host and wrong-action tokens cannot send', async () => {
  const s=setup(); assert.equal((await s.run({...good,turnstileToken:'bad'})).code,400);
  assert.equal((await s.run()).code,200); assert.equal((await s.run()).code,400); assert.equal(s.sent.length,1);
  for (const verified of [{hostname:'evil.example'},{action:'login'},{success:false}]) {
    const blocked=setup({verified}); assert.equal((await blocked.run()).code,400); assert.equal(blocked.sent.length,0);
  }
});
test('missing configuration, missing trusted IP, and dependency outages fail closed', async () => {
  for (const key of Object.keys(env).filter(key=>!key.startsWith('VERCEL'))) {
    const s=setup({env:{[key]:''}}); assert.equal((await s.run()).code,503); assert.equal(s.sent.length,0);
  }
  for (const options of [{redisFailure:true},{verifyFailure:true}]) {
    const s=setup(options); assert.equal((await s.run()).code,503); assert.equal(s.sent.length,0);
  }
  const s=setup(); assert.equal((await s.run(good,{headers:{'x-forwarded-for':undefined,'x-real-ip':'192.0.2.2'}})).code,503);
});
test('Resend returned errors are not reported as success', async () => {
  assert.equal((await setup({sendError:true}).run()).code,503);
});
test('IP limit survives handler recreation and stops verification after ten attempts', async () => {
  const s=setup();
  for(let i=0;i<10;i++) assert.equal((await s.run({...good,turnstileToken:'bad'})).code,400);
  const r=await s.run(); assert.equal(r.code,429); assert.equal(r.headers['Retry-After'],'600');
  assert.equal(s.calls.filter(c=>c.url.includes('cloudflare')).length,10);
});
test('email budget is shared across IPs and normalizes case', async () => {
  const s=setup();
  for(let i=0;i<4;i++) {
    const r=await s.run({...good,email:i%2?'ALEX@example.com':good.email,turnstileToken:`token-${i}`},{headers:{'x-forwarded-for':`192.0.2.${i+1}`}});
    assert.equal(r.code,i<3?200:429);
  }
  assert.equal(s.sent.length,3);
});
test('global budget caps distributed verified mail', async () => {
  const s=setup();
  for(let i=0;i<51;i++) {
    const r=await s.run({...good,email:`alex${i}@example.com`,turnstileToken:`token-${i}`},{headers:{'x-forwarded-for':`192.0.2.${i+1}`}});
    assert.equal(r.code,i<50?200:429);
  }
  assert.equal(s.sent.length,50);
});
