'use client';
import {useEffect,useState} from 'react';
import Reaction from './reaction';
import Keepsake from './keepsake';
import {reactionFor} from '../../lib/reactions.mjs';
import {questionBeats} from '../../lib/presentation.mjs';
const beat=n=>({'data-beat':n,style:{'--beat':n}});
function Picture({src,label,className=''}){
 const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[src]);
 return src&&!failed?<img className={className} src={src.startsWith('https://cdn.myanimelist.net/')?'/api/image?src='+encodeURIComponent(src):src} alt={label} referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>:<span className={`${className} fx-placeholder`} aria-label={label}>{label.slice(0,1)}</span>;
}
function Covers({items,repeat=false}){return <div className="cover-pop">{items.map((x,i)=><figure key={x.id} style={{'--pop':i}}><Picture className="pop-image" src={x.cover} label={x.title}/><figcaption>{x.title}</figcaption>{repeat&&<small>{x.repeatCount>0?`${x.repeatCount} recorded repeats`:''}{x.isRepeating?' · Active now':''}</small>}</figure>)}</div>;}
function Montage({items}){
 const [batch,setBatch]=useState(0);
 useEffect(()=>{if(items.length<=5||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const t=setInterval(()=>{if(!document.hidden)setBatch(n=>(n+1)%Math.ceil(items.length/5));},5000);return()=>clearInterval(t);},[items.length]);
 const shown=Array.from({length:Math.min(5,items.length)},(_,i)=>items[(batch*5+i)%items.length]);
 return <div className="cover-montage" aria-live="off"><Covers key={batch} items={shown}/></div>;
}
function Quip({text,n=3,step=1}){
 const lines=(text||'').split(/(?<=[.!?])\s+/);
 return <>{lines.map((line,i)=><p className="fx-quip" {...beat(n+i*step)} key={i}>{line}</p>)}</>;
}
export default function Scene({slide,data,name,avatar,period,sample,paused}){
 const reaction=reactionFor(slide);
 const gif=n=>reaction?<div className="reaction-stage" {...beat(n)}><Reaction name={reaction} paused={paused}/></div>:null;
 if(slide.type==='closing')return <Keepsake data={data} name={name} avatar={avatar} period={period} awards={slide.awards} sample={sample}/>;
 if(slide.type==='opening')return <><div {...beat(0)}><Picture className="fx-avatar" src={avatar} label={name||'You'}/></div><p className="fx-hello" {...beat(1)}>Hey, {name||'you'}.</p><h2 {...beat(2)}>{slide.title}</h2><Quip text={slide.quip} n={3}/></>;
 if(slide.type==='completed-intro')return <><div className="fx-number completion-total" {...beat(0)}>{slide.value}</div><h2 className="completion-label" {...beat(1)}>{slide.kind==='anime'?'Anime completed.':'Manga completed.'}</h2>{gif(2)}<p className="completion-question" {...beat(3)}><em>{slide.kind==='anime'?'But where did you find the time?':'Were you ever putting that book down?'}</em></p></>;
 if(slide.type==='montage')return <><div className="montage-stage" {...beat(0)}><Montage items={slide.items}/></div><h2 className="montage-punchline" {...beat(1)}>{slide.title}</h2></>;
 if(slide.type==='question'){
  const parts=questionBeats(slide);
  return <>{gif(0)}<h2 className="staged-question natural-question">{parts.map((p,i)=>p.emphasis?<strong key={i} {...beat(p.seconds/2)}>{p.text}</strong>:<span key={i} className={p.lead?'but-line':undefined} {...beat(p.seconds/2)}>{p.text}</span>)}</h2><Quip text={slide.quip} n={(parts.at(-1).seconds+1)/2} step={.5}/></>;
 }
 if(slide.type==='number')return <>{gif(0)}<h2 {...beat(1)}>{slide.title}</h2><div className="fx-number" {...beat(2)}>{slide.value}<small>{slide.unit}</small></div><p className="fx-unit" {...beat(3)}>Your average {slide.kind} score.</p><Quip text={slide.kind==='anime'?'Tough critic or generous watcher?':'The numbers don’t lie.'} n={4}/></>;
 if(slide.type==='month')return <><h2 {...beat(0)}>{slide.title}</h2><div className="fx-number" {...beat(1)}>{slide.value}</div><p className="fx-unit" {...beat(2)}>{slide.kind==='anime'?'Anime completed.':'Manga completed.'}</p>{gif(3)}<Quip text={slide.quip} n={4}/></>;
 if(slide.type==='count')return <><div className="fx-number" {...beat(0)}>{slide.value}</div><h2 {...beat(1)}>{slide.title.charAt(0).toUpperCase()+slide.title.slice(1)}</h2>{slide.items?.length>0&&<div className="montage-stage" {...beat(2)}><Montage items={slide.items}/></div>}<Quip text={slide.quip} n={3}/></>;
 if(slide.type==='spotlight')return <><h2 className="fx-callout" {...beat(0)}>{slide.title}</h2><div className="spotlight-art" {...beat(1)}><Picture className="fx-hero-cover" src={slide.item.cover} label={slide.item.title}/></div><div className="spotlight-copy"><h3 className="fx-title" {...beat(2)}>{slide.item.title}</h3>{slide.genres?.length>0&&<p className="spotlight-genres" {...beat(3)}>{slide.genres.map(g=>g.name).join(' · ')}</p>}<strong className="fx-score" {...beat(3)}>{slide.item[slide.metric]}<small>{slide.unit}</small></strong><Quip text={slide.quip} n={4}/></div></>;
 if(slide.type==='ranking')return <><h2 {...beat(0)}>{slide.title}</h2>{slide.subtitle&&<p className="fx-subtitle" {...beat(1)}>{slide.subtitle}</p>}<ol className="fx-ranking" {...beat(2)}>{slide.items.map((x,i)=><li key={x.id}><span>{i+1}</span><Picture className="fx-small-cover" src={x.cover} label={x.title}/><div>{x.title}</div><strong>{x[slide.metric]}<small>{slide.unit}</small></strong></li>)}</ol><Quip text={slide.quip} n={3}/></>;
 if(slide.type==='categories')return <><h2 {...beat(0)}>{slide.title}</h2><ol className="fx-categories" {...beat(1)}>{slide.rows.map((x,i)=><li key={x.id}><span>0{i+1}</span><div>{x.name}<small>{x.count} {x.count===1?'title':'titles'}</small></div></li>)}</ol><Quip text={slide.quip} n={2}/></>;
 if(slide.type==='repeats')return <><h2 {...beat(0)}>{slide.title}</h2><div className="fx-repeat-stats" {...beat(1)}>{['anime','manga'].map(k=><div key={k}><strong>{data[k].repeats.known?data[k].repeats.count:'—'}</strong><span>{k==='anime'?'rewatches':'rereads'}</span></div>)}</div><p className="fx-scope" {...beat(2)}>All-time counts</p><Quip text={slide.quip} n={3}/></>;
 if(slide.type==='repeat-covers')return <><h2 {...beat(0)}>{slide.title}</h2><div className="montage-stage" {...beat(1)}><Covers items={slide.items} repeat/></div><p className="fx-scope" {...beat(2)}>All-time records · {slide.start+1}–{slide.start+slide.items.length} of {slide.total} titles</p><Quip text={slide.quip} n={3}/></>;
 if(slide.type==='badges')return <><h2 {...beat(0)}>{slide.title}</h2><p className="fx-unit" {...beat(1)}>{slide.total} official MAL badges · {period==='all'?'All time':period}</p>{slide.items.length>0?<div className="montage-stage" {...beat(2)}><Covers items={slide.items}/></div>:gif(2)}<Quip text={slide.quip} n={3}/></>;
 if(slide.type==='awards')return <><h2 {...beat(0)}>{slide.title}</h2><div className="taste-awards" {...beat(1)}>{slide.awards.map(a=><section key={a.kind}><div className="award-seal" aria-hidden="true">✦</div><h3>{a.title}</h3><p>{a.kind==='anime'?'Your watching title':'Your reading title'}</p></section>)}</div></>;
 if(slide.type==='energy')return <><h2 {...beat(0)}>{slide.title}</h2><h3 className="energy-name" {...beat(1)}>{slide.award.energy.title}</h3><div className="energy-covers" {...beat(2)}>{slide.award.energy.covers.map(x=><Picture key={x.id} src={x.cover} label={x.title}/>)}</div><Quip text={slide.award.energy.line} n={3}/><p className="energy-signals" {...beat(4)}>{slide.award.energy.signals.join(' · ')}</p></>;
 return <><h2 {...beat(0)}>{slide.title}</h2><Quip text={slide.quip} n={1}/></>;
}
