import { coverURL } from './insights.mjs';
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes, timingSafeEqual } from 'node:crypto';
export const sessionName = '__Host-mal-session';
const flowName = '__Host-mal-flow';
export function config(env = process.env) {
  const { MAL_CLIENT_ID: id, MAL_CLIENT_SECRET: secret, MAL_REDIRECT_URI: uri } = env;
  if (!id || !secret || !uri) throw new Error('configuration');
  const url = new URL(uri);
  if (url.protocol !== 'https:' || url.pathname !== '/api/auth/callback/mal' || url.search || url.hash || url.username || url.password) throw new Error('configuration');
  return { id, secret, uri, origin: url.origin };
}
function key(secret) { return Buffer.from(hkdfSync('sha256', secret, 'mal-wrapped', 'cookie-encryption-v1', 32)); }
export function seal(value, purpose, secret) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(secret), iv);
  cipher.setAAD(Buffer.from(purpose));
  const body = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  const result = Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url');
  if (result.length > 3600) throw new Error('session_too_large');
  return result;
}
export function unseal(value, purpose, secret, now = Date.now()) {
  try {
    if (!value || value.length > 3600 || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
    const data = Buffer.from(value, 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', key(secret), data.subarray(0, 12));
    decipher.setAAD(Buffer.from(purpose));
    decipher.setAuthTag(data.subarray(12, 28));
    const decoded = JSON.parse(Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString('utf8'));
    return Number.isFinite(decoded.exp) && decoded.exp > now ? decoded : null;
  } catch { return null; }
}
function cookie(request, name) {
  return (request.headers.get('cookie') || '').split(';').map(x => x.trim()).find(x => x.startsWith(name + '='))?.slice(name.length + 1);
}
function setCookie(response, name, value, seconds) {
  response.headers.append('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${seconds}`);
}
function redirect(url) {
  return new Response(null, { status: 303, headers: { Location: url, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
}
export async function login(request, env = process.env) {
  let cfg;
  try { cfg = config(env); } catch { return redirect('/connect?error=configuration'); }
  if (request.headers.get('origin') !== cfg.origin) return new Response('Please start sign-in from the production website.', { status: 403 });
  const state = randomBytes(32).toString('base64url');
  const verifier = randomBytes(64).toString('base64url');
  const target = new URL('https://myanimelist.net/v1/oauth2/authorize');
  // MAL's official documentation currently supports only plain PKCE.
  target.search = new URLSearchParams({ response_type: 'code', client_id: cfg.id, redirect_uri: cfg.uri, state, code_challenge: verifier, code_challenge_method: 'plain' }).toString();
  const response = redirect(target.toString());
  setCookie(response, flowName, seal({ state, verifier, exp: Date.now() + 600000 }, 'flow', cfg.secret), 600);
  return response;
}
export async function callback(request, env = process.env, fetcher = fetch) {
  let cfg;
  try { cfg = config(env); } catch { return redirect('/connect?error=configuration'); }
  const finish = (path) => {
    const response = redirect(cfg.origin + path);
    setCookie(response, flowName, '', 0);
    return response;
  };
  const params = new URL(request.url).searchParams;
  const flow = unseal(cookie(request, flowName), 'flow', cfg.secret);
  const state = Buffer.from(params.get('state') || '');
  const expected = Buffer.from(flow?.state || '');
  if (!flow || state.length !== expected.length || !timingSafeEqual(state, expected)) return finish('/connect?error=expired');
  if (params.has('error')) return finish('/connect?error=cancelled');
  const code = params.get('code');
  if (!code || code.length > 2048) return finish('/connect?error=failed');
  try {
    const tokens = await fetcher('https://myanimelist.net/v1/oauth2/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: cfg.id, client_secret: cfg.secret, code, code_verifier: flow.verifier, grant_type: 'authorization_code', redirect_uri: cfg.uri }),
      cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000),
    });
    if (!tokens.ok) throw new Error('exchange');
    const token = await tokens.json();
    if (typeof token.access_token !== 'string' || !Number.isFinite(token.expires_in) || token.expires_in < 1) throw new Error('token');
    const profile = await fetcher('https://api.myanimelist.net/v2/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000),
    });
    if (!profile.ok) throw new Error('profile');
    const user = await profile.json();
    if (!Number.isSafeInteger(user.id) || typeof user.name !== 'string' || user.name.length > 100) throw new Error('profile');
    const seconds = Math.min(3600, Math.floor(token.expires_in));
    const value = seal({ user: { id: user.id, name: user.name, avatar: typeof user.picture === 'string' && user.picture.length < 500 ? coverURL(user.picture) : null }, accessToken: token.access_token, exp: Date.now() + seconds * 1000 }, 'session', cfg.secret);
    const response = finish('/lists');
    setCookie(response, sessionName, value, seconds);
    return response;
  } catch { return finish('/connect?error=failed'); }
}
export function logout(request, env = process.env) {
  let cfg;
  try { cfg = config(env); } catch { return redirect('/connect?error=configuration'); }
  if (request.headers.get('origin') !== cfg.origin) return new Response('Forbidden', { status: 403 });
  const response = redirect(cfg.origin + '/');
  setCookie(response, sessionName, '', 0);
  setCookie(response, flowName, '', 0);
  return response;
}
