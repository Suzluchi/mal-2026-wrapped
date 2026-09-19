'use client';
import { useState } from 'react';
import { insights } from '../../lib/insights.mjs';
function Breakdown({ title, data, total, note }) {
  const [expanded,setExpanded] = useState(false);
  const cutoff=data.rows[4]?.count ?? 0;
  const leaders=data.rows.filter((x,i)=>i<5 || x.count===cutoff);
  const rows=expanded?data.rows:leaders;
  return <article className="insight-card"><h3>{title}</h3><p>{note}</p><p className="insight-coverage">Details available for {data.covered} of {total} completed titles. {data.missing} without usable details.</p>{rows.length?<><div className="list-table-wrap"><table><thead><tr><th scope="col">Category</th><th scope="col">Titles</th><th scope="col">Your average</th></tr></thead><tbody>{rows.map(x=><tr key={x.id}><th scope="row">{x.name}</th><td>{x.count}</td><td>{x.average===null?'Unrated':`${x.average.toFixed(1)}/10 (${x.rated} scored)`}</td></tr>)}</tbody></table></div>{data.rows.length>leaders.length && <button className="button secondary" onClick={()=>setExpanded(!expanded)}>{expanded?'Show leading categories':'Show all categories'}</button>}</>:<p>No details available for this selection.</p>}</article>;
}
export default function ListInsights({ anime,manga,period,asOf }) {
  return <section className="list-insights" aria-label="Your list insights"><h2>A closer look at your taste</h2><p>Based on completed titles in {period==='all'?'your current lists':period}. Categories are ordered by title count, with ties included. A title can belong to several genres, studios, or creators, so their counts can overlap. Averages use your current scores and exclude unrated titles.</p>{[['Anime',anime],['Manga',manga]].map(([kind,items])=>{
    const stats=insights(items,period,asOf);
    const categories=[['genres','Genres and tags','Labels supplied by MAL may include themes and demographics.'],[kind==='Anime'?'studios':'creators',kind==='Anime'?'Studios':'Creators',kind==='Anime'?'Every credited studio receives one count per title.':'Every credited creator receives one count per title, whether credited for story, art, or both.'],['formats','Formats','MAL formats distinguish TV, films, manga, novels, and other types.'],['years',kind==='Anime'?'Original release years':'Publication start years','When titles began airing or publishing, not when you watched or read them.'],...(kind==='Anime'?[['sources','Adaptation sources','The original source type recorded by MAL.']]:[])];
    return <div key={kind}><h3>{kind} · {stats.count} completed titles</h3><div className="insight-grid">{categories.map(([key,title,note])=><Breakdown key={key} title={title} note={note} data={stats[key]} total={stats.count}/>)}</div></div>;
  })}</section>;
}
