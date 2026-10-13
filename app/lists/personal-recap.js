'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { downloadCard } from '../../lib/card-export';
import Scene from './story-scene';
import RecapMusic from './recap-music';


import { buildStory } from '../../lib/story.mjs';
export default function PersonalRecap({anime,manga,period,asOf,name,avatar,badges}) {
  const {slides,data}=useMemo(()=>buildStory(anime,manga,period,asOf,badges),[anime,manga,period,asOf,badges]);
  const [step,setStep]=useState(0),[open,setOpen]=useState(true),[info,setInfo]=useState(false);
  const dialog=useRef(null),launcher=useRef(null),surface=useRef(null),gesture=useRef(null),suppressClick=useRef(0);
  
  const [exporting,setExporting]=useState(false),[exportMessage,setExportMessage]=useState('');
  const slide=slides[Math.min(step,slides.length-1)];
  const coverLed=['montage','spotlight','ranking','repeat-covers','energy'].includes(slide.type)||(slide.type==='count'&&slide.items?.length>0);
  async function saveCard(){setExporting(true);setExportMessage('');try{await downloadCard(surface.current,`mal-wrapped-${period}-${slide.id}.png`);setExportMessage('Card downloaded.');}catch{setExportMessage('Download failed. Please try again.');}finally{setExporting(false);}}
  const infoClose=useRef(null),infoTrigger=useRef(null);
  useEffect(()=>{if(info)infoClose.current?.focus({preventScroll:true});},[info]);
  function closeInfo(){setInfo(false);infoTrigger.current?.focus({preventScroll:true});}
  const covers=useMemo(()=>[...anime,...manga].filter(x=>x.cover).slice(0,8),[anime,manga]);
  useEffect(()=>{
    const el=dialog.current;
    if(!open){if(el.open)el.close();launcher.current?.focus({preventScroll:true});return;}
    const old=document.body.style.overflow;document.body.style.overflow='hidden';if(!el.open)el.showModal();
    surface.current?.focus({preventScroll:true});
    return ()=>{document.body.style.overflow=old;if(el.open)el.close();};
  },[open]);
  function move(next){setStep(Math.max(0,Math.min(slides.length-1,next)));setInfo(false);surface.current?.focus({preventScroll:true});}
  function key(event){if(info){if(event.key==='Escape'){event.preventDefault();closeInfo();}return;}if(event.target.closest('select,input,textarea'))return;if(event.target===surface.current && (event.key===' '||event.key==='Enter')){event.preventDefault();move(step+1);return;}if(event.key==='ArrowRight'){event.preventDefault();move(step+1);}if(event.key==='ArrowLeft'){event.preventDefault();move(step-1);}}
  function tap(event){if(info||Date.now()<suppressClick.current||event.target.closest('button,a,select,input'))return;const rect=event.currentTarget.getBoundingClientRect();move(step+(event.clientX-rect.left<rect.width*.28?-1:1));}
  function pointerDown(event){if(!info&&!event.target.closest('button,a,select,input'))gesture.current={x:event.clientX,y:event.clientY};}
  function pointerUp(event){const start=gesture.current;gesture.current=null;if(!start||info)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4){suppressClick.current=Date.now()+400;move(step+(dx<0?1:-1));}}
  const fullTitles=slide.items|| (slide.item?[slide.item]:[]);
  return <><div className="fx-launch"><p>Your recap is ready.</p><button ref={launcher} className="button primary" onClick={()=>setOpen(true)}>Open my Wrapped ↗</button><span>Tap, swipe, or use the arrow keys.</span></div>
    <dialog ref={dialog} className="fx-dialog" aria-label="Your interactive Wrapped" onCancel={event=>{event.preventDefault();if(info)closeInfo();else setOpen(false);}} onKeyDown={key}>
      <div className="fx-atmosphere" aria-hidden="true">{(covers.length?covers:[{id:'art',cover:'/art/issue-cover.svg'}]).map((x,index)=><img key={`${x.id}-${index}`} src={x.cover} alt="" referrerPolicy="no-referrer" style={{'--i':index}}/>)}</div>
      <div className="fx-shell"><div className="fx-toolbar"><span>{anime.some(x=>x.isSample)?'FICTIONAL DEMO':'MW'} / {period==='all'?'ALL TIME':period}</span><div><RecapMusic open={open}/><button className="download-card" disabled={exporting} onClick={saveCard}>{exporting?"Saving…":"Download card ↓"}</button><button ref={infoTrigger} aria-label="About these numbers" aria-expanded={info} onClick={()=>setInfo(!info)}>ⓘ</button><button aria-label="Close recap" onClick={()=>setOpen(false)}>×</button></div></div>
      <div ref={surface} tabIndex={0} className="fx-card" data-cover-led={coverLed} data-theme={step%6} data-kind={slide.kind||'intro'} data-type={slide.type} onClick={tap} onPointerDown={pointerDown} onPointerUp={pointerUp} onPointerCancel={()=>{gesture.current=null;}} aria-label={`${slide.group}, card ${step+1} of ${slides.length}`}>
        <div className="fx-progress" role="progressbar" aria-label="Recap progress" aria-valuenow={step+1} aria-valuemin={1} aria-valuemax={slides.length}>{slides.map((x,index)=><span key={x.id} className={index<=step?'is-read':''}/>)}</div>
        <p className="fx-section">{slide.group}<span>{String(step+1).padStart(2,'0')} / {slides.length}</span></p>
        <div key={slide.id} className="fx-scene" inert={info} aria-hidden={info} aria-live="polite" aria-atomic="true"><Scene paused={!open||info||exporting} sample={anime.some(x=>x.isSample)||manga.some(x=>x.isSample)} slide={slide} data={data} period={period} name={name} avatar={avatar}/></div>
        <nav inert={info} aria-hidden={info} className="fx-nav" aria-label="Story controls"><button disabled={step===0} onClick={()=>move(step-1)} aria-label="Previous card">←</button><span>{step===0?'TAP TO BEGIN':slide.type==='closing'?'REPLAY ↗':'TAP OR SWIPE'}</span>{step<slides.length-1?<button onClick={()=>move(step+1)} aria-label={step===0?'Begin recap':'Next card'}>→</button>:<button onClick={()=>move(0)} aria-label="Replay recap">↺</button>}</nav>
        {info&&<section className="fx-info" aria-label="About these numbers"><button ref={infoClose} onClick={closeInfo} aria-label="Close information">×</button><h2>Behind the numbers</h2><p>Watching and reading energy use completed-title counts, genre variety, current scores, recorded repeat counters, and catalog length. These are playful list-based descriptions, not personality diagnoses. Wrapped titles are separate from official MAL event badges.</p><p>Snapshot: {asOf} (UTC). Annual totals use valid recorded finish dates, not a complete watch/read history. Undated activity and active repeats cannot be assigned to a year. All time includes previously completed titles currently being revisited.</p><p>Scores are your current MAL scores. Top anime includes TV series only. One highest scorer is spotlighted: equal scores use repeat count, rewatch/reread value, then genre-score affinity from other rated titles, then ID. These are tie-breakers, not a higher MAL score. Reviews, episode posts, and viewing hours are not inferred. Categories show five entries. Current and planned lists are today’s snapshot, not additions during the selected year. Started counts require valid recorded start dates.</p><p>Repeat counts are recorded all-time counters, not dated events. Missing counters are unknown. Catalog episode/chapter lengths are not hours watched or activity within the chosen year.</p>{['anime','manga'].map(kind=><p key={kind}>{kind}: {data[kind].missingDates} completed titles lack a full valid finish date; {data[kind].issues.future} have future dates; {data[kind].issues.reversed} have reversed dates; {data[kind].issues.activeRepeat} are being revisited.</p>)}{fullTitles.length>0&&<><h3>On this card</h3><ul>{fullTitles.map(x=><li key={x.id}>{x.title}</li>)}</ul></>}</section>}
      </div><p className="fx-bottom-hint" role="status">{exportMessage||"Your taste. Your story."}</p></div>
    </dialog></>;
}

