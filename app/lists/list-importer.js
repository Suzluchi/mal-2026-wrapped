'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { collectPages, summarise } from '../../lib/lists.mjs';
const blank = { status: 'idle', count: 0, items: [], error: '' };
const errors = {
  expired: 'Your session expired. Sign in again to import your lists.',
  access_denied: 'MAL did not allow access to this list. Reconnect your account and try again.',
  rate_limited: 'MAL is receiving too many requests. Wait a minute before retrying.',
  configuration: 'Connection settings are missing on this deployment.',
  list_too_large: 'This list exceeds the importer limit. No partial totals have been presented.',
};
function Summary({ kind, state, year }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  if (state.status !== 'done') return null;
  const stats = summarise(state.items, year);
  const matches = state.items.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
  const count = Math.ceil(matches.length / 25);
  const current = Math.min(page, Math.max(0, count - 1));
  return <>
    <div className="list-metrics"><div><strong>{stats.total}</strong><span>titles on your current list</span></div><div><strong>{stats.completed}</strong><span>currently marked completed</span></div><div><strong>{stats.finished.length}</strong><span>completed with a finish date in {year}</span></div></div>
    <p>{stats.started} titles have a recorded start date in {year}. {stats.undatedCompleted} completed titles have missing, partial, or invalid finish dates and are excluded from the yearly count.</p>
    {state.items.length === 0 ? <p>Your {kind} list is empty in the data returned by MAL.</p> : <>
    <label className="list-search">Search {kind} titles<input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder="Search your list" /></label>
    <div className="list-table-wrap"><table><caption>Your current {kind} list · {matches.length} matching titles</caption><thead><tr><th scope="col">Title</th><th scope="col">Current status</th><th scope="col">Your score</th><th scope="col">Start date</th><th scope="col">Finish date</th></tr></thead><tbody>{matches.slice(current * 25, current * 25 + 25).map(item => <tr key={item.id}><td>{item.title}</td><td>{item.status.replaceAll('_', ' ')}</td><td>{item.score ?? 'Unrated'}</td><td>{item.startDate || 'Not recorded'}</td><td>{item.finishDate || 'Not recorded'}</td></tr>)}</tbody></table></div>
    {matches.length === 0 && <p>No titles match your search.</p>}
    {count > 1 && <nav className="list-pagination" aria-label={`${kind} table pages`}><button className="button secondary" disabled={current === 0} onClick={() => setPage(current - 1)}>Previous</button><span>Page {current + 1} of {count}</span><button className="button secondary" disabled={current + 1 >= count} onClick={() => setPage(current + 1)}>Next</button></nav>}
    </>}
  </>;
}
export default function ListImporter() {
  const [lists, setLists] = useState({ anime: blank, manga: blank });
  const [year, setYear] = useState(2026);
  const controllers = useRef({});
  const start = useCallback(async (kind) => {
    if (controllers.current[kind]) return;
    const controller = new AbortController();
    controllers.current[kind] = controller;
    const update = value => { if (!controller.signal.aborted) setLists(old => ({ ...old, [kind]: value })); };
    update({ ...blank, status: 'loading' });
    try {
      const items = await collectPages(async offset => {
        const response = await fetch(`/api/lists?kind=${kind}&offset=${offset}`, { cache: 'no-store', signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'unavailable');
        return result;
      }, count => update({ ...blank, status: 'loading', count }), controller.signal);
      update({ status: 'done', items, count: items.length, error: '' });
    } catch (error) { update({ ...blank, status: 'error', error: error.message }); }
    finally { if (controllers.current[kind] === controller) delete controllers.current[kind]; }
  }, []);
  useEffect(() => {
    start('anime');
    start('manga');
    return () => {
      Object.values(controllers.current).forEach(controller => controller.abort());
      controllers.current = {};
    };
  }, [start]);
  return <>
    <div className="list-notice"><h2>Dates tell part of the story.</h2><p>MAL lists are a current snapshot, not a complete activity history. Yearly counts below use complete dates you recorded on MAL. They do not prove how many episodes or chapters you consumed in that year. Rewatches, rereads, and activity without dates are not reconstructed.</p><label>Year to inspect <select value={year} onChange={e => setYear(Number(e.target.value))}>{Array.from({ length: 27 }, (_, i) => 2026 - i).map(y => <option key={y} value={y}>{y}</option>)}</select></label></div>
    {['anime', 'manga'].map(kind => <section className="import-section" key={kind}><div className="import-heading"><h2>{kind === 'anime' ? 'Anime' : 'Manga'}</h2><span>{lists[kind].status === 'error' && <button className="button secondary" onClick={() => start(kind)}>Try again</button>}</span></div>
    <div role="status" aria-live="polite">{lists[kind].status === 'idle' && <p>Getting your list ready…</p>}{lists[kind].status === 'loading' && <p>Loading your list… {lists[kind].count} unique titles received. Large lists can take a little longer.</p>}{lists[kind].status === 'done' && <p>List ready: {lists[kind].count} titles.</p>}</div>
    {lists[kind].status === 'error' && <p role="alert">{errors[lists[kind].error] || 'The import could not finish. Please retry. Incomplete results are not shown as full totals.'} {['expired', 'access_denied'].includes(lists[kind].error) && <Link href="/connect">Connect again</Link>}</p>}
    <Summary kind={kind} state={lists[kind]} year={year} />
    </section>)}
  </>;
}
