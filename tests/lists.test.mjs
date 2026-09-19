import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchListPage, collectPages, dateYear, summarise } from '../lib/lists.mjs';
const entry = (id, status = {}) => ({ node: { id, title: `Title ${id}` }, list_status: { status: 'completed', score: 0, ...status } });
const json = body => async () => Response.json(body);
test('anime and manga requests use only fixed read endpoints with server token', async () => {
  for (const kind of ['anime', 'manga']) {
    const result = await fetchListPage('private-token', kind, 100, async (address, options) => {
      const url = new URL(address);
      assert.equal(url.pathname, `/v2/users/@me/${kind}list`);
      assert.equal(url.searchParams.get('offset'), '100');
      assert.equal(url.searchParams.get('nsfw'), 'true');
      assert.match(url.searchParams.get('fields'), /finish_date/);
      assert.equal(options.headers.Authorization, 'Bearer private-token');
      assert.equal(options.cache, 'no-store');
      assert.equal(options.redirect, 'error');
      return Response.json({ data: [entry(1, { start_date: '2025-03-02', finish_date: '2026-01-02', score: 8 })], paging: {} });
    });
    assert.equal(result.items[0].finishDate, '2026-01-02');
    assert.equal(result.items[0].score, 8);
    assert.equal(result.nextOffset, null);
    assert.ok(!JSON.stringify(result).includes('private-token'));
  }
});
test('empty lists succeed and missing dates/unrated scores remain unknown', async () => {
  assert.deepEqual(await fetchListPage('x', 'anime', 0, json({ data: [], paging: {} })), { items: [], nextOffset: null });
  const result = await fetchListPage('x', 'manga', 0, json({ data: [entry(2)], paging: {} }));
  assert.equal(result.items[0].score, null);
  assert.equal(result.items[0].finishDate, '');
});
test('invalid inputs cannot send provider requests', async () => {
  const never = async () => assert.fail('must not fetch');
  for (const [kind, offset] of [['__proto__', 0], ['anime', -1], ['anime', NaN], ['manga', 100001], ['anime', 1.2]]) await assert.rejects(fetchListPage('x', kind, offset, never), { code: 'invalid_request' });
});
test('provider error responses are sanitised', async () => {
  for (const [status, code] of [[401, 'expired'], [403, 'access_denied'], [429, 'rate_limited'], [500, 'unavailable']]) {
    await assert.rejects(fetchListPage('x', 'anime', 0, async () => new Response('secret', { status })), { code });
  }
  await assert.rejects(fetchListPage('x', 'anime', 0, async () => { throw new Error('private failure'); }), { code: 'unavailable' });
});
test('invalid provider payload cannot look like a complete empty list', async () => {
  for (const body of [{}, { data: [entry(1), {}] }, { data: 'bad' }]) await assert.rejects(fetchListPage('x', 'anime', 0, json(body)), { code: 'invalid_response' });
});
test('pagination extracts offset without following remote URLs', async () => {
  const result = await fetchListPage('x', 'anime', 0, json({ data: [entry(1)], paging: { next: 'https://api.myanimelist.net/v2/users/@me/animelist?offset=100' } }));
  assert.equal(result.nextOffset, 100);
  for (const next of ['https://evil.example/?offset=100', 'https://api.myanimelist.net/v2/users/@me/animelist?offset=0', 'https://api.myanimelist.net/v2/users/@me/animelist?offset=NaN']) await assert.rejects(fetchListPage('x', 'anime', 0, json({ data: [entry(1)], paging: { next } })), { code: 'invalid_paging' });
});
test('multi-page import deduplicates titles and completes only at the final page', async () => {
  const offsets = [], progress = [];
  const items = await collectPages(async offset => { offsets.push(offset); return offset === 0 ? { items: [{ id: 1 }, { id: 2 }], nextOffset: 100 } : { items: [{ id: 2 }, { id: 3 }], nextOffset: null }; }, n => progress.push(n));
  assert.deepEqual(offsets, [0, 100]);
  assert.deepEqual(progress, [2, 3]);
  assert.deepEqual(items.map(x => x.id), [1, 2, 3]);
});
test('a failed second page rejects instead of returning partial totals', async () => {
  await assert.rejects(collectPages(async offset => { if(offset) throw new Error('rate_limited'); return { items: [{ id: 1 }], nextOffset: 100 }; }), /rate_limited/);
  await assert.rejects(collectPages(async () => ({ items: [], nextOffset: 0 })), /invalid_paging/);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(collectPages(async () => assert.fail(), () => {}, controller.signal), /cancelled/);
});
test('only complete real calendar dates qualify', () => {
  for (const value of ['', '2026', '2026-04', '2026-00-00', '2026-02-30', '2025-02-29', null, '2026-12-31T00:00:00Z']) assert.equal(dateYear(value), null);
  assert.equal(dateYear('2024-02-29'), 2024);
  assert.equal(dateYear('2026-01-01'), 2026);
  assert.equal(dateYear('2026-12-31'), 2026);
});
test('yearly counts use recorded completion dates, not updates or current progress', () => {
  const items = [
    { id: 1, status: 'completed', finishDate: '2026-01-01', startDate: '2025-12-01' },
    { id: 2, status: 'completed', finishDate: '', updatedAt: '2026-03-01', episodes: 500 },
    { id: 3, status: 'watching', finishDate: '2026-01-02', startDate: '2026-01-01' },
    { id: 4, status: 'completed', finishDate: '2025-12-31' },
    { id: 5, status: 'completed', finishDate: '2026' },
  ];
  const summary = summarise([...items, items[0]], 2026);
  assert.equal(summary.total, 5);
  assert.equal(summary.completed, 4);
  assert.equal(summary.finished.length, 1);
  assert.equal(summary.undatedCompleted, 2);
  assert.equal(summary.started, 1);
});

test('nullable MAL list status is preserved as unknown', async () => {
 const result = await fetchListPage('x','anime',0,json({data:[entry(1,{status:null})],paging:{}}));
 assert.equal(result.items[0].status,'unknown');
});
