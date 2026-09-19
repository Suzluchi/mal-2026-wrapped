'use client';
import { useMemo, useRef, useState } from 'react';
import { buildStory } from '../../lib/story.mjs';
const monthName=value=>new Date(value+'-01T00:00:00Z').toLocaleDateString('en',{month:'short',year:'numeric',timeZone:'UTC'});
function Cover({item}) {
  const [failed,setFailed]=useState(false);
  return item.cover && !failed ? <img className="story-cover" src={item.cover} alt="" loading="lazy" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/> : <span className="story-cover story-placeholder" aria-hidden="true">{item.title.slice(0,1)}</span>;
}
function Picks({items,metric='score',unit='/10',kind}) {
  return <ol className="story-picks">{items.map((item,index)=>{
    const rank=items.findIndex(x=>x[metric]===item[metric])+1;
    return <li key={item.id}><span className="story-rank">{rank}</span><Cover item={item}/><div><a href={`https://myanimelist.net/${kind}/${item.id}`} target="_blank" rel="noreferrer">{item.title}</a><p>{item[metric]}{unit}{index>0 && items[index-1][metric]===item[metric]?' · tied':''}</p></div></li>;
  })}</ol>;
}
function Bars({rows}) {
  const max=Math.max(1,...rows.map(x=>x.count));
  return <ul className="story-bars">{rows.map((row,index)=><li key={row.id??row.name??index}><div><span>{row.name}</span><strong>{row.count}</strong></div><span className="story-track" aria-hidden="true"><span style={{width:`${row.count/max*100}%`}}/></span></li>)}</ul>;
}
function Totals({data}) {
  return <div className="story-totals">{['anime','manga'].map(kind=><div key={kind}><strong>{data[kind].count}</strong><span>{kind} titles completed</span><small>{data[kind].average===null?'No scored completions':`${data[kind].average.toFixed(1)}/10 average · ${data[kind].rated} scored`}</small></div>)}</div>;
}
function RepeatBlock({stats,kind}) {
  const label=kind==='anime'?'rewatches':'rereads';
  return <div><h3>{kind==='anime'?'Anime':'Manga'}</h3><p><strong>{stats.known?stats.count:'Unknown'}</strong> recorded {label} · <strong>{stats.activeKnown?stats.active.length:'Unknown'}</strong> {stats.active.length===1?'title':'titles'} currently being revisited.</p><p className="story-note">Repeat counts returned for {stats.known} of {stats.total} list entries. Current repeat flags returned for {stats.activeKnown} of {stats.total} entries. A recorded zero does not prove you never revisited a title.</p>{stats.titles.length>0 && <details><summary>Titles with recorded {label}</summary><ul>{stats.titles.map(x=><li key={x.id}>{x.title} — {x.repeatCount}</li>)}</ul></details>}{stats.active.length>0 && <details><summary>Currently revisiting</summary><ul>{stats.active.map(x=><li key={x.id}>{x.title}</li>)}</ul></details>}</div>;
}
function Chapter({slide,data,period,name,asOf,onStart}) {
  const [revealed,setRevealed]=useState(false);
  const s=slide.stats;
  switch(slide.type) {
    case 'opening':return <><p className="story-greeting">{name?`${name}, this is your shelf.`:'This is your shelf.'}</p><Totals data={data}/><p>{period==='all'?'Your completed collection, including titles you are currently revisiting.':`Completions with usable finish dates in ${period}, through ${asOf} (UTC).`}</p></>;
    case 'count':return <><p className="story-big">{s.count}</p><p>{s.count?'Distinct completed titles in this selection. Repeat events are counted separately as all-time context.':'There are no eligible completions in this selection. That does not mean you watched or read nothing.'}</p>{!s.count && <p>Try All time, or inspect the dates on your MAL list. Watching, reading, and undated annual activity are not treated as new completions.</p>}</>;
    case 'reveal':return revealed?<Picks items={slide.items} metric={slide.metric} unit={slide.unit} kind={slide.kind}/>:<div className="story-reveal"><p>Your highest recorded score in this selection is <strong>{slide.items[0].score}/10</strong>.</p><button className="button primary" onClick={()=>setRevealed(true)}>Reveal {slide.items.length===1?'the title':`${slide.items.length} tied titles`}</button></div>;
    case 'picks':return <Picks items={slide.items} metric={slide.metric} unit={slide.unit} kind={slide.kind}/>;
    case 'scores':return <><p className="story-big">{s.average.toFixed(1)}<small>/10</small></p><p>Your average across {s.rated} scored titles. {s.count-s.rated} unrated titles are excluded. These are your current ratings, not a record of when you rated.</p><Bars rows={s.scores.map(x=>({...x,name:`${x.name}/10`}))}/></>;
    case 'months':return <><p>{s.busiest.map(([month])=>monthName(month)).join(', ')} {s.busiest.length===1?'had':'shared'} the most recorded completions: <strong>{s.busiest[0][1]}</strong>{s.busiest.length>1?' each':''}.</p><Bars rows={s.months.map(([name,count])=>({name:monthName(name),count}))}/><p className="story-note">Only months with eligible completions are shown. Finish dates do not measure episodes, chapters, or repeat events.</p></>;
    case 'categories':return <><Bars rows={slide.rows}/><p className="story-note">Details available for {slide.coverage.covered} of {slide.total} titles. {slide.coverage.missing} without usable details. Categories can overlap.</p></>;
    case 'years':return <><h3>Earliest: {s.oldest[0].releaseYear}</h3><Picks items={s.oldest} metric="releaseYear" unit="" kind={slide.kind}/>{s.newest[0].releaseYear!==s.oldest[0].releaseYear && <><h3>Most recent: {s.newest[0].releaseYear}</h3><Picks items={s.newest} metric="releaseYear" unit="" kind={slide.kind}/></>}<p className="story-note">Release years available for {s.yearKnown} of {s.count} titles. Titles sharing the earliest or latest year stay tied.</p></>;
    case 'repeats':return <><p className="story-scope">ALL-TIME CONTEXT · THROUGH {asOf}</p><p>MAL gives us recorded repeat counts and current repeat flags, but no dates for each repeat. These totals cannot be assigned to {period==='all'?'individual years':period}; repeat events stay separate from distinct-title totals.</p><RepeatBlock kind="anime" stats={data.anime.repeats}/><RepeatBlock kind="manga" stats={data.manga.repeats}/></>;
    case 'context':return <><p>One title counts once per list. Scores reflect your ratings now. Anime and manga totals stay separate.</p>{['anime','manga'].map(kind=>{const x=data[kind].issues;return <div key={kind}><h3>{kind==='anime'?'Anime':'Manga'} date coverage</h3><ul><li>{x.undated} missing, partial, or invalid finish dates</li><li>{x.future} future finish dates</li><li>{x.reversed} finish dates before start dates</li><li>{x.activeRepeat} titles currently being revisited</li></ul></div>;})}<p>These groups are excluded from yearly results and completion-month rankings. All time keeps them in the completed collection. During a rewatch or reread, MAL may show a watching/reading status; the repeat flag tells us the title was previously completed.</p><p>We cannot reconstruct your full activity history or time spent from this snapshot. Catalog episode/chapter lengths are not personal activity totals.</p></>;
    case 'closing':return <><p className="story-greeting">{name?`${name}'s`:'Your'} {period==='all'?'completed collection':`${period} recap`}</p><Totals data={data}/>{['anime','manga'].map(kind=>data[kind].highest.length>0 && <div key={kind}><h3>Highest-rated {kind}</h3><Picks items={data[kind].highest} kind={kind}/></div>)}<p>There is more detail in your insights and lists below. Change the period above to explore another chapter of your history.</p></>;
    default:return null;
  }
}
export default function PersonalRecap({anime,manga,period,asOf,name}) {
  const {slides,data}=useMemo(()=>buildStory(anime,manga,period,asOf),[anime,manga,period,asOf]);
  const [step,setStep]=useState(0),heading=useRef(null),root=useRef(null);
  const slide=slides[step];
  function move(next){setStep(Math.max(0,Math.min(slides.length-1,next))); requestAnimationFrame(()=>{heading.current?.focus({preventScroll:true});root.current?.scrollIntoView({block:'start',behavior:'instant'});});}
  function keys(event){if(event.target.closest('button,a,input,select,textarea,summary'))return;if(event.key==='ArrowRight'){event.preventDefault();move(step+1);}if(event.key==='ArrowLeft'){event.preventDefault();move(step-1);}}
  return <section ref={root} className="personal-recap story-player" aria-label="Your personal recap" onKeyDown={keys}>
    <header className="story-header"><span>{period==='all'?'ALL TIME':period} · {slide.group}</span><label>Chapters <select aria-label="Jump to chapter" value={step} onChange={e=>move(Number(e.target.value))}>{slides.map((x,index)=><option key={x.id} value={index}>{index+1}. {x.group}: {x.title}</option>)}</select></label></header>
    <progress value={step+1} max={slides.length} aria-label="Recap progress"/>
    <p className="story-position" aria-live="polite">Chapter {step+1} of {slides.length}</p>
    <div key={slide.id} className="story-chapter"><h2 ref={heading} tabIndex={-1}>{slide.title}</h2><Chapter slide={slide} data={data} period={period} asOf={asOf} name={name} onStart={()=>move(1)}/>{slide.note && <p className="story-note">{slide.note}</p>}</div>
    <nav className="story-controls" aria-label="Recap pages"><button className="button secondary" disabled={step===0} onClick={()=>move(step-1)}>Previous</button>{step<slides.length-1?<button className="button primary" onClick={()=>move(step+1)}>{step===0?'Begin your recap':'Next chapter'} →</button>:<button className="button primary" onClick={()=>move(0)}>Play again</button>}</nav>
  </section>;
}
