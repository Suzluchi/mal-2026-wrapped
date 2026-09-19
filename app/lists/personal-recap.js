'use client';
import { useRef, useState } from 'react';
import { recap } from '../../lib/recap.mjs';
function Picks({ items }) {
  return items.length ? <ul className="recap-picks">{items.map(x=><li key={x.id}><span>{x.title}</span><strong>{x.score}/10</strong></li>)}</ul> : <p>No scored completions in this period yet.</p>;
}
export default function PersonalRecap({ anime, manga, period }) {
  const [step,setStep] = useState(0);
  const heading = useRef(null);
  const a = recap(anime,period), m = recap(manga,period);
  const label = period === 'all' ? 'All time' : String(period);
  const slides = [{title:`${label}. Your completed stories.`,body:<><div className="list-metrics"><div><strong>{a.count}</strong><span>anime completed</span></div><div><strong>{m.count}</strong><span>manga completed</span></div></div><p>{period==='all'?'Titles currently marked completed on your MAL lists, including those without dates.':'Titles currently marked completed with a complete finish date recorded in this year.'}</p></>}];
  for (const [kind,s] of [['Anime',a],['Manga',m]]) {
    slides.push({title:`${kind}: your highest scores.`,body:<><Picks items={s.highest}/>{s.highest.length>1 && <p>These titles share your highest score.</p>}</>});
    slides.push({title:`${kind}: your top five, with ties.`,body:<><Picks items={s.top}/><p>Equal scores share their place. Ties at the fifth title are included.</p></>});
    slides.push({title:`${kind}: how you rated it.`,body:<><p className="recap-number">{s.average===null?'—':s.average.toFixed(1)}<small> / 10</small></p><p>Your current average across {s.rated} scored completions in this period. {s.count-s.rated} unrated titles are excluded.</p><p>These are your scores now; MAL does not tell us when you assigned them.</p></>});
    slides.push({title:`${kind}: your busiest completion month${s.busiest.length>1?'s':''}.`,body:s.busiest.length?<><ul>{s.busiest.map(([month,n])=><li key={month}>{new Date(month+'-01T00:00:00Z').toLocaleDateString('en',{month:'long',year:'numeric',timeZone:'UTC'})}: {n} completed</li>)}</ul><p>Based on recorded finish dates, not episodes watched or chapters read.</p></>:<p>No complete finish dates are available for this period.</p>});
  }
  slides.push({title:'A little context for your story.',body:<><p>{a.missingDates} completed anime and {m.missingDates} completed manga have missing, partial, or invalid finish dates. They count in All time, but cannot be placed in an annual recap or completion month.</p><p>This is a snapshot of your current MAL lists. It cannot reconstruct rewatches, rereads, or time spent watching and reading.</p><p>You can change the period above or explore your full lists below.</p></>});
  function move(next) { setStep(next); heading.current?.focus(); }
  return <section className="personal-recap" aria-label="Your personal recap"><p className="eyebrow">{label} · {step+1} / {slides.length}</p><h2 ref={heading} tabIndex={-1}>{slides[step].title}</h2><div className="recap-body">{slides[step].body}</div><nav className="list-pagination" aria-label="Recap pages"><button className="button secondary" disabled={step===0} onClick={()=>move(step-1)}>Previous</button>{step<slides.length-1?<button className="button primary" onClick={()=>move(step+1)}>Next chapter →</button>:<button className="button primary" onClick={()=>move(0)}>Play again</button>}</nav></section>;
}
