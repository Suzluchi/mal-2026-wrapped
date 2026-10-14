'use client';
import {useEffect,useState,useRef} from 'react';
import Reaction from './reaction';
import Keepsake from './keepsake';
import {reactionFor} from '../../lib/reactions.mjs';
import {questionBeats} from '../../lib/presentation.mjs';
const beat=n=>({'data-beat':n,style:{'--beat':n}});
function Picture({src,label,className=''}){
 const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[src]);
 return src&&!failed?<img className={className} src={src.startsWith('https://cdn.myanimelist.net/')?'/api/image?src='+encodeURIComponent(src):src} alt={label} referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>:<span className={`${className} fx-placeholder`} aria-label={label}>{label.slice(0,1)}</span>;
}
function Covers({items,repeat=false}){return <div className="cover-pop">{items.map((x,i)=><figure key={x.galleryId||x.id} style={{'--pop':i}}><Picture className="pop-image" src={x.cover} label={x.title}/><figcaption>{x.title}</figcaption>{repeat&&<small>{x.repeatCount>0?`${x.repeatCount} recorded repeats`:''}{x.isRepeating?' · Active now':''}</small>}</figure>)}</div>;}
function Montage({items}){
 const [batch,setBatch]=useState(0);
 useEffect(()=>{if(items.length<=5||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const t=setInterval(()=>{if(!document.hidden)setBatch(n=>(n+1)%Math.ceil(items.length/5));},2100);return()=>clearInterval(t);},[items.length]);
 const shown=Array.from({length:Math.min(5,items.length)},(_,i)=>items[(batch*5+i)%items.length]);
 return <div className="cover-montage" aria-live="off"><Covers key={batch} items={shown}/></div>;
}
function CollectionGallery({items,badges=false}){
 const [page,setPage]=useState(0),startX=useRef(null),size=6;
 const pages=Math.ceil(items.length/size),shown=items.slice(page*size,(page+1)*size);
 return <section className="collection-gallery" data-gallery="true" data-badges={badges} aria-label={badges?'Browse official badges':'Browse rewatches and rereads'} onClick={e=>e.stopPropagation()} onPointerDown={e=>{e.stopPropagation();startX.current=e.clientX;}} onPointerUp={e=>{e.stopPropagation();const dx=e.clientX-startX.current;if(startX.current!==null&&Math.abs(dx)>40)setPage(p=>Math.max(0,Math.min(pages-1,p+(dx<0?1:-1))));startX.current=null;}} onPointerCancel={()=>{startX.current=null;}} onKeyDown={e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();e.stopPropagation();setPage(p=>Math.max(0,Math.min(pages-1,p+(e.key==='ArrowRight'?1:-1))));}}}>
  <div className="collection-grid">{shown.map(x=><figure key={x.galleryId||x.id}><Picture className="collection-image" src={x.cover} label={x.title}/><figcaption>{x.title}</figcaption>{!badges&&<small>{x.mediaKind==='anime'?'Anime':'Manga'} · {x.repeatCount>0?`${x.repeatCount} recorded ${x.repeatCount===1?'repeat':'repeats'}`:x.isRepeating?'Active repeat':'Repeat count unknown'}</small>}</figure>)}</div>
  <nav className="collection-controls" aria-label="Gallery pages"><button disabled={page===0} onClick={()=>setPage(p=>p-1)} aria-label="Previous gallery items">←</button><span aria-live="polite">{page*size+1}–{Math.min((page+1)*size,items.length)} of {items.length}</span><button disabled={page>=pages-1} onClick={()=>setPage(p=>p+1)} aria-label="More gallery items">→</button></nav>
 </section>;
}
function Quip({text,n=3,step=1,inline=false}){
 const lines=(text||'').split(/(?<=[.!?])\s+/);
 if(inline)return <p className="fx-quip quip-inline">{lines.map((line,i)=><span {...beat(n+i*step)} key={i}>{line}{i<lines.length-1?' ':''}</span>)}</p>;
 return <>{lines.map((line,i)=><p className="fx-quip" {...beat(n+i*step)} key={i}>{line}</p>)}</>;
}
export default function Scene({slide,data,name,avatar,period,sample,paused,onAllTime}){
 const reaction=reactionFor(slide);
 const gif=n=>reaction?<div className="reaction-stage" {...beat(n)}><Reaction name={reaction} paused={paused}/></div>:null;
 if(slide.type==='closing')return <Keepsake data={data} name={name} avatar={avatar} period={period} awards={slide.awards} sample={sample}/>;
 if(slide.type==='opening')return <><div {...beat(0)}><Picture className="fx-avatar" src={avatar} label={name||'You'}/></div><p className="fx-hello" {...beat(1)}>Hey, {name||'you'}.</p><h2 {...beat(1.5)}>{slide.title}</h2><p className="fx-quip opening-pair"><span {...beat(2)}>{slide.quip.split(/(?<=[.!?])\s+/)[0]} </span><span {...beat(2.5)}>{slide.quip.split(/(?<=[.!?])\s+/)[1]}</span></p><Quip text={slide.quip.split(/(?<=[.!?])\s+/).slice(2).join(' ')} n={3} step={.5}/></>;
 if(slide.type==='completed-intro')return <><div className="fx-number completion-total" {...beat(0)}>{slide.value}</div><h2 className="completion-label" {...beat(1)}>{slide.kind==='anime'?'Anime completed.':'Manga completed.'}</h2>{gif(slide.kind==='manga'?1.5:2)}<p className="completion-question" {...beat(slide.kind==='manga'?2:3)}><em>{slide.kind==='anime'?'But where did you find the time?':'Were you ever putting that book down?'}</em></p></>;
 if(slide.type==='montage')return <><div className="montage-stage" {...beat(0)}><Montage items={slide.items}/></div><h2 className="montage-punchline" {...beat(1)}>{slide.title}</h2></>;
 if(slide.type==='question'){
  const parts=questionBeats(slide);
  return <>{gif(0)}<h2 className="staged-question natural-question">{parts.map((p,i)=>p.emphasis?<strong key={i} {...beat(p.seconds/2)}>{p.text}</strong>:<span key={i} className={p.lead?'but-line':undefined} {...beat(p.seconds/2)}>{p.text}</span>)}</h2><Quip text={slide.quip} n={(parts.at(-1).seconds+1)/2} step={.5}/></>;
 }
 if(slide.type==='number')return <>{gif(0)}<h2 {...beat(1)}>{slide.title}</h2><div className="fx-number" {...beat(1.5)}>{slide.value}<small>{slide.unit}</small></div><p className="fx-unit" {...beat(2)}>Your average {slide.kind} score.</p><Quip text={slide.kind==='anime'?'Tough critic or generous watcher?':'The numbers don’t lie.'} n={2.5} step={.5}/></>;
 if(slide.type==='month')return <><h2 {...beat(0)}>{slide.title}</h2><div className="fx-number" {...beat(1)}>{slide.value}</div><p className="fx-unit" {...beat(2)}>{slide.kind==='anime'?'Anime completed.':'Manga completed.'}</p>{gif(3)}<Quip text={slide.quip} n={4}/></>;
 if(slide.type==='count')return <><div className="fx-number" {...beat(0)}>{slide.value}</div><h2 {...beat(1)}>{slide.title.charAt(0).toUpperCase()+slide.title.slice(1)}</h2>{slide.items?.length>0&&<div className="montage-stage" {...beat(2)}><Montage items={slide.items}/></div>}<Quip text={slide.quip} n={3}/></>;
 if(slide.type==='spotlight')return <><h2 className="fx-callout" {...beat(0)}>{slide.title}</h2><div className="spotlight-art" {...beat(1)}><Picture className="fx-hero-cover" src={slide.item.cover} label={slide.item.title}/></div><div className="spotlight-copy"><h3 className="fx-title" {...beat(2)}>{slide.item.title}</h3>{slide.genres?.length>0&&<p className="spotlight-genres" {...beat(3)}>{slide.genres.map(g=>g.name).join(' · ')}</p>}<strong className="fx-score" {...beat(3)}>{slide.item[slide.metric]}<small>{slide.unit}</small></strong><Quip text={slide.quip} n={4}/></div></>;
 if(slide.type==='ranking')return <><h2 {...beat(0)}>{slide.title}</h2>{slide.subtitle&&<p className="fx-subtitle" {...beat(1)}>{slide.subtitle}</p>}<ol className="fx-ranking" {...beat(slide.subtitle?2:1)}>{slide.items.map((x,i)=><li key={x.id}><span>{i+1}</span><Picture className="fx-small-cover" src={x.cover} label={x.title}/><div>{x.title}</div><strong>{x[slide.metric]}<small>{slide.unit}</small></strong></li>)}</ol><Quip text={slide.quip} n={slide.subtitle?3:2} inline={slide.id==='anime-bottom'}/></>;
 if(slide.type==='categories')return <><h2 {...beat(0)}>{slide.title}</h2><ol className="fx-categories" {...beat(1)}>{slide.rows.map((x,i)=><li key={x.id}><span>0{i+1}</span><div>{x.name}<small>{x.count} {x.count===1?'title':'titles'}</small></div></li>)}</ol><Quip text={slide.quip} n={2}/></>;
 if(slide.type==='repeats')return <><h2 {...beat(0)}>{slide.title}</h2><div className="fx-repeat-stats" {...beat(1)}>{['anime','manga'].map(k=><div key={k}><strong>{data[k].repeats.known?data[k].repeats.count:'—'}</strong><span>{k==='anime'?'rewatches':'rereads'}</span></div>)}</div><p className="fx-scope" {...beat(2)}>All-time counts</p><Quip text={slide.quip} n={3}/></>;
 if(slide.type==='repeat-covers')return <><h2 {...beat(0)}>{slide.title}</h2><p className="fx-unit" {...beat(1)}>{slide.summary} · All-time records</p>{slide.items.length>0&&<CollectionGallery items={slide.items}/>}<Quip text={slide.quip} n={2}/></>;
 if(slide.type==='badges')return <><h2 {...beat(0)}>{slide.title}</h2><p className="fx-unit" {...beat(1)}>{slide.total} official MAL badges · {period==='all'?'All time':period}</p>{slide.items.length>0?<CollectionGallery items={slide.items} badges/>:gif(2)}<Quip text={slide.quip} n={3}/></>;
 if(slide.type==='empty')return <><h2 {...beat(0)}>{slide.title}</h2><Quip text={slide.quip} n={1}/>{slide.offerAllTime&&<button className="story-all-time" onClick={onAllTime}>See my all-time story →</button>}</>;
 if(slide.type==='awards')return <><h2 {...beat(0)}>{slide.title}</h2><div className="taste-awards" {...beat(1)}>{slide.awards.map(a=><section key={a.kind}><div className="award-seal" aria-hidden="true">✦</div><h3>{a.title}</h3><p>{a.kind==='anime'?'Your watching title':'Your reading title'}</p></section>)}</div></>;
 if(slide.type==='energy')return <><h2 {...beat(0)}>{slide.title}</h2><h3 className="energy-name" {...beat(1)}>{slide.award.energy.title}</h3><div className="energy-covers" {...beat(2)}>{slide.award.energy.covers.map(x=><Picture key={x.id} src={x.cover} label={x.title}/>)}</div><Quip text={slide.award.energy.line} n={3}/><p className="energy-signals" {...beat(4)}>{slide.award.energy.signals.join(' · ')}</p></>;
 return <><h2 {...beat(0)}>{slide.title}</h2><Quip text={slide.quip} n={1}/></>;
}
