import { cookies } from 'next/headers';
import { config, sessionName, unseal } from '../../../lib/auth.mjs';
import { fetchListPage, ListError } from '../../../lib/lists.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;
const reply = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' } });
export async function GET(request) {
  let cfg;
  try { cfg = config(); } catch { return reply({ error: 'configuration' }, 503); }
  const session = unseal((await cookies()).get(sessionName)?.value, 'session', cfg.secret);
  if (!session?.accessToken) return reply({ error: 'expired' }, 401);
  const params = new URL(request.url).searchParams;
  const raw = params.get('offset') ?? '0';
  if (!/^\d+$/.test(raw)) return reply({ error: 'invalid_request' }, 400);
  try { return reply(await fetchListPage(session.accessToken, params.get('kind'), Number(raw))); }
  catch (error) { return reply({ error: error instanceof ListError ? error.code : 'unavailable' }, error instanceof ListError ? error.status : 502); }
}
