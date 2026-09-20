'use client';
import { useState } from 'react';
function summaryText({data,name,period}){
 return `${name||'My'} · ${period==='all'?'All-time':period} MAL Wrapped\n${data.anime.count} anime completed · ${data.manga.count} manga completed\n\n`+['anime','manga'].map(k=>`Top ${k}\n`+data[k].top.slice(0,5).map((x,i)=>`${i+1}. ${x.title} — ${x.score}/10`).join('\n')).join('\n\n');
}
async function makeImage({data,name,period,awards,sample}){
 await document.fonts.ready;
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1200;
 const c=canvas.getContext('2d');if(!c)throw new Error('Canvas unavailable');
 c.fillStyle='#171d29';c.fillRect(0,0,1600,1200);c.fillStyle='#ffcfa6';c.fillRect(0,0,22,1200);
 c.strokeStyle='#ffffff26';c.lineWidth=2;c.strokeRect(55,55,1490,1090);
 const line=(text,x,y,max,font,color='#f4eee8')=>{c.font=font;c.fillStyle=color;let t=String(text);while(c.measureText(t).width>max&&t.length>1)t=t.slice(0,-2);c.fillText(t===String(text)?t:t+'…',x,y);};
 line(sample?'FICTIONAL SAMPLE / MAL WRAPPED':'MAL WRAPPED / YOUR KEEPSAKE',100,120,1400,'22px Arial','#ffcfa6');
 line(name||'Your story',100,205,1390,'56px Transcity, Georgia');
 line(`${period==='all'?'ALL TIME':period} · THE RECEIPTS ARE YOURS.`,100,270,1390,'38px Transcity, Georgia');
 ['anime','manga'].forEach((k,col)=>{const x=100+col*735;line(`TOP ${k.toUpperCase()}`,x,365,650,'25px Arial','#ffcfa6');const items=data[k].top.slice(0,5);if(!items.length)line('No rated completions',x,425,650,'26px Arial');items.forEach((item,i)=>{line(`${i+1}. ${item.title}`,x,425+i*75,550,'27px Arial');line(`${item.score}/10`,x+560,425+i*75,100,'26px Arial','#ffcfa6');});});
 line(`${data.anime.count}`,100,915,620,'82px Peachy, Georgia','#ffcfa6');line('ANIME COMPLETED',100,960,620,'22px Arial');line(`${data.manga.count}`,835,915,620,'82px Peachy, Georgia','#d5b8ff');line('MANGA COMPLETED',835,960,620,'22px Arial');
 line(awards.map(a=>a.title).join(' · '),100,1035,1380,'26px Transcity, Georgia');line('Recorded completions · current scores · mal-2026-wrapped.vercel.app',100,1100,1400,'21px Arial','#b6b5c3');
 return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Export failed')),'image/png'));
}
export default function Keepsake(props){
 const {data,name,avatar,period,awards=[],sample}=props;
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function act(mode){setBusy(true);setMessage('');try{
  if(mode==='copy'){await navigator.clipboard.writeText(summaryText(props));setMessage('Summary copied.');return;}
  const blob=await makeImage(props),file=new File([blob],`mal-wrapped-${period}.png`,{type:'image/png'});
  if(mode==='share'&&navigator.canShare?.({files:[file]})&&navigator.share){await navigator.share({files:[file],title:'My MAL Wrapped'});setMessage('Share menu closed.');}
  else {const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=file.name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);setMessage(mode==='share'?'Image downloaded—attach it in your favourite app.':'Your recap image is downloaded.');}
 }catch(e){setMessage(e.name==='AbortError'?'Sharing cancelled.':'Could not complete that action. Try downloading or copying the summary.');}finally{setBusy(false);}}
 return <div className="keepsake"><header>{avatar&&<img src={avatar} alt="" referrerPolicy="no-referrer"/>}<div><p className="fx-scope">{sample?'FICTIONAL SAMPLE':'YOUR KEEPSAKE'} / {period==='all'?'ALL TIME':period}</p><h2>{name||'Your'} Wrapped.</h2></div></header><div className="keepsake-stats"><span><b>{data.anime.count}</b> anime completed</span><span><b>{data.manga.count}</b> manga completed</span></div><div className="keepsake-lists">{['anime','manga'].map(k=><section key={k}><h3>Top {k}</h3>{data[k].top.length?<ol>{data[k].top.slice(0,5).map(x=><li key={x.id}><span title={x.title}>{x.title}</span><b>{x.score}<small>/10</small></b></li>)}</ol>:<p>No rated completions.</p>}</section>)}</div>{awards.length>0&&<p className="keepsake-awards">{awards.map(x=>x.title).join(' · ')}</p>}<div className="keepsake-actions"><button disabled={busy} onClick={()=>act('download')}>Download image</button><button disabled={busy} onClick={()=>act('share')}>Share</button><button disabled={busy} onClick={()=>act('copy')}>Copy summary</button></div><p role="status" className="keepsake-status">{message||'Share only when you’re ready. Your list stays private until you choose.'}</p></div>;
}
