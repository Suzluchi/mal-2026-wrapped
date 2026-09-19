import { normaliseMetadata } from './insights.mjs';
export class ListError extends Error {
  constructor(code, status = 502) { super(code); this.code = code; this.status = status; }
}
const kinds = { anime: 'animelist', manga: 'mangalist' };
export async function fetchListPage(token, kind, offset = 0, fetcher = fetch) {
  if (!Object.hasOwn(kinds, kind) || !Number.isSafeInteger(offset) || offset < 0 || offset > 100000) throw new ListError('invalid_request', 400);
  const url = new URL(`https://api.myanimelist.net/v2/users/@me/${kinds[kind]}`);
  url.search = new URLSearchParams({ fields: `list_status{status,score,start_date,finish_date},genres,start_date,media_type,${kind === 'anime' ? 'studios,source' : 'authors{first_name,last_name}'}`, limit: '100', offset: String(offset), nsfw: 'true' }).toString();
  let response;
  try { response = await fetcher(url.toString(), { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000) }); }
  catch { throw new ListError('unavailable'); }
  if (response.status === 401) throw new ListError('expired', 401);
  if (response.status === 403) throw new ListError('access_denied', 403);
  if (response.status === 429) throw new ListError('rate_limited', 429);
  if (!response.ok) throw new ListError('unavailable');
  let payload;
  try { payload = await response.json(); } catch { throw new ListError('invalid_response'); }
  if (!Array.isArray(payload?.data) || payload.data.length > 100) throw new ListError('invalid_response');
  const items = payload.data.map(entry => {
    if (!Number.isSafeInteger(entry?.node?.id) || typeof entry.node.title !== 'string' || !entry.list_status || (entry.list_status.status != null && typeof entry.list_status.status !== 'string')) throw new ListError('invalid_response');
    const s = entry.list_status;
    return { ...normaliseMetadata(entry.node, kind), id: entry.node.id, title: entry.node.title, status: s.status || 'unknown',
      score: Number.isInteger(s.score) && s.score >= 1 && s.score <= 10 ? s.score : null,
      startDate: typeof s.start_date === 'string' ? s.start_date : '', finishDate: typeof s.finish_date === 'string' ? s.finish_date : '' };
  });
  let nextOffset = null;
  if (payload.paging?.next) {
    let next;
    try { next = new URL(payload.paging.next); } catch { throw new ListError('invalid_paging'); }
    const raw = next.searchParams.get('offset');
    if (next.origin !== url.origin || next.pathname !== url.pathname || next.username || next.password || !/^\d+$/.test(raw || '')) throw new ListError('invalid_paging');
    nextOffset = Number(raw);
    if (!Number.isSafeInteger(nextOffset) || nextOffset <= offset || nextOffset > 100000 || items.length === 0) throw new ListError('invalid_paging');
  }
  return { items, nextOffset };
}
export function dateYear(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + 'T00:00:00.000Z');
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
  return Number(value.slice(0, 4));
}
export function summarise(items, year) {
  const entries = [...new Map(items.map(item => [item.id, item])).values()];
  const completed = entries.filter(item => item.status === 'completed');
  return { total: entries.length, completed: completed.length,
    finished: completed.filter(item => dateYear(item.finishDate) === year),
    undatedCompleted: completed.filter(item => dateYear(item.finishDate) === null).length,
    started: entries.filter(item => dateYear(item.startDate) === year).length };
}
export async function collectPages(loadPage, onProgress = () => {}, signal) {
  const entries = new Map(); let offset = 0;
  for (let page = 0; page < 1000; page++) {
    if (signal?.aborted) throw new Error('cancelled');
    const result = await loadPage(offset);
    if (!Array.isArray(result?.items)) throw new Error('invalid_response');
    for (const item of result.items) entries.set(item.id, item);
    onProgress(entries.size);
    if (result.nextOffset === null) return [...entries.values()];
    if (!Number.isSafeInteger(result.nextOffset) || result.nextOffset <= offset) throw new Error('invalid_paging');
    offset = result.nextOffset;
  }
  throw new Error('list_too_large');
}
