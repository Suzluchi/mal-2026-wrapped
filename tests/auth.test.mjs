import test from 'node:test';
import assert from 'node:assert/strict';
import { login, callback, logout, seal, unseal, config } from '../lib/auth.mjs';
const env = { MAL_CLIENT_ID: 'test-id', MAL_CLIENT_SECRET: 'test-secret-not-real', MAL_REDIRECT_URI: 'https://example.com/api/auth/callback/mal' };
const origin = 'https://example.com';
const post = (path, source = origin) => new Request(origin + path, { method: 'POST', headers: { origin: source } });
async function attempt() {
  const response = await login(post('/api/auth/login/mal'), env);
  return { response, url: new URL(response.headers.get('location')), cookie: response.headers.getSetCookie()[0].split(';')[0] };
}
function back(a, query) { return new Request(env.MAL_REDIRECT_URI + '?' + new URLSearchParams(query), { headers: { cookie: a.cookie } }); }
const neverFetch = () => { assert.fail('Network must not be called'); };

test('configuration rejects invalid callback URLs and missing secrets', () => {
  assert.throws(() => config({}));
  for (const url of ['http://example.com/api/auth/callback/mal', 'https://example.com/wrong', 'https://example.com/api/auth/callback/mal?x=1']) assert.throws(() => config({ ...env, MAL_REDIRECT_URI: url }));
});
test('encryption rejects tampering, wrong purpose/key, and expiry', () => {
  const value = seal({ user: 'test', exp: 200 }, 'session', env.MAL_CLIENT_SECRET);
  assert.equal(unseal(value, 'session', env.MAL_CLIENT_SECRET, 100).user, 'test');
  assert.equal(unseal(value, 'session', env.MAL_CLIENT_SECRET, 200), null);
  assert.equal(unseal(value, 'flow', env.MAL_CLIENT_SECRET, 100), null);
  assert.equal(unseal(value, 'session', 'wrong', 100), null);
  const bytes = Buffer.from(value, 'base64url'); bytes[30] ^= 1;
  assert.equal(unseal(bytes.toString('base64url'), 'session', env.MAL_CLIENT_SECRET, 100), null);
});
test('login uses random state and PKCE, keeps secret out of redirect', async () => {
  const a = await attempt(), b = await attempt();
  assert.equal(a.url.origin, 'https://myanimelist.net');
  assert.equal(a.url.searchParams.get('code_challenge_method'), 'plain');
  assert.match(a.url.searchParams.get('code_challenge'), /^[A-Za-z0-9_-]{43,128}$/);
  assert.notEqual(a.url.searchParams.get('state'), b.url.searchParams.get('state'));
  assert.ok(!a.url.href.includes(env.MAL_CLIENT_SECRET));
  assert.match(a.response.headers.getSetCookie()[0], /HttpOnly; Secure; SameSite=Lax; Max-Age=600/);
});
test('cross-origin login and logout are rejected', async () => {
  assert.equal((await login(post('/api/auth/login/mal', 'https://evil.example'), env)).status, 403);
  assert.equal(logout(post('/api/auth/logout', 'https://evil.example'), env).status, 403);
});
test('invalid state or missing cookie prevents token exchange', async () => {
  const a = await attempt();
  for (const request of [back(a, { state: 'wrong', code: 'code' }), new Request(env.MAL_REDIRECT_URI + '?code=code')]) {
    const r = await callback(request, env, neverFetch);
    assert.equal(r.headers.get('location'), origin + '/connect?error=expired');
    assert.match(r.headers.getSetCookie()[0], /Max-Age=0/);
  }
});
test('cancelled sign-in clears flow without a network call', async () => {
  const a = await attempt();
  const r = await callback(back(a, { state: a.url.searchParams.get('state'), error: 'access_denied' }), env, neverFetch);
  assert.equal(r.headers.get('location'), origin + '/connect?error=cancelled');
});
test('successful callback exchanges code, fetches profile and creates bounded encrypted session', async () => {
  const a = await attempt(); let calls = 0;
  const fake = async (url, options) => {
    calls++;
    assert.equal(options.cache, 'no-store');
    assert.equal(options.redirect, 'error');
    if (calls === 1) {
      assert.equal(url, 'https://myanimelist.net/v1/oauth2/token');
      assert.equal(options.body.get('client_secret'), env.MAL_CLIENT_SECRET);
      assert.equal(options.body.get('code_verifier'), a.url.searchParams.get('code_challenge'));
      return Response.json({ access_token: 'private-token', refresh_token: 'discard-me', expires_in: 2678400 });
    }
    assert.equal(url, 'https://api.myanimelist.net/v2/users/@me');
    assert.equal(options.headers.Authorization, 'Bearer private-token');
    return Response.json({ id: 123, name: 'TestUser' });
  };
  const r = await callback(back(a, { state: a.url.searchParams.get('state'), code: 'private-code' }), env, fake);
  assert.equal(calls, 2);
  assert.equal(r.headers.get('location'), origin + '/lists');
  assert.equal(r.headers.get('cache-control'), 'no-store');
  const cookie = r.headers.getSetCookie().find(x => x.startsWith('__Host-mal-session='));
  assert.match(cookie, /Max-Age=3600/);
  assert.ok(!cookie.includes('private-token'));
  const data = unseal(cookie.split(';')[0].split('=')[1], 'session', env.MAL_CLIENT_SECRET);
  assert.equal(data.user.name, 'TestUser');
  assert.equal(data.accessToken, 'private-token');
  assert.ok(!JSON.stringify(data).includes('discard-me'));
});
test('provider failures are handled without exposing codes or creating sessions', async () => {
  for (const fake of [async () => new Response('secret provider detail', { status: 400 }), async () => { throw new Error('private error'); }, async () => Response.json({ access_token: 'x', expires_in: -1 })]) {
    const a = await attempt();
    const r = await callback(back(a, { state: a.url.searchParams.get('state'), code: 'secret-code' }), env, fake);
    assert.equal(r.headers.get('location'), origin + '/connect?error=failed');
    assert.equal(r.headers.getSetCookie().length, 1);
    assert.equal(await r.text(), '');
  }
});
test('logout expires both cookies', () => {
  const r = logout(post('/api/auth/logout'), env);
  assert.equal(r.headers.get('location'), origin + '/');
  assert.equal(r.headers.getSetCookie().length, 2);
  for (const c of r.headers.getSetCookie()) assert.match(c, /Max-Age=0/);
});
