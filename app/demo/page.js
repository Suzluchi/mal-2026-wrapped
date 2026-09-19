'use client';
import { useState } from 'react';
import SiteHeader, { SiteFooter } from '../components/site-header';
import PersonalRecap from '../lists/personal-recap';
const titles=[['The Last Train','last-train',10,12,2024],['Paper Satellites','paper-satellites',9,24,2022],['The Blue Hour','blue-hour',8,13,1998],['Sea of Sundays','sunday-sea',8,26,2010],['Field Notes from Tomorrow','field-notes',7,12,2020],['Someone Left the Stars On','star-lights',6,6,2025]];
const make=(row,index,kind)=>({id:index+1,title:row[0],cover:`/art/${row[1]}.svg`,isSample:true,status:'completed',score:row[2],finishDate:`2026-${String(index+1).padStart(2,'0')}-12`,startDate:'2026-01-01',length:row[3],releaseYear:row[4],genres:[{id:index%2+1,name:index%2?'Adventure':'Drama'}],studios:[{id:1,name:'Fictional Studio North'}],creators:[{id:1,name:'Fictional Creator A'}],format:kind==='anime'?'tv':'manga',source:'original',repeatCount:index===0?2:0,isRepeating:false});
const anime=titles.map((row,i)=>make(row,i,'anime'));
const manga=titles.slice(1,5).map((row,i)=>make(row,i,'manga'));
export default function Demo() {
 const [period,setPeriod]=useState(2026);
 return <><SiteHeader/><main id="main-content" className="lists-page demo-page"><div className="reader-title"><div><p className="eyebrow">A LOOK INSIDE</p><h1>The sample issue.</h1></div><p className="sample-label">FICTIONAL TITLES & DATA<br/>Original sample artwork. Not your MAL account.</p></div><div className="sample-toolbar"><label>Edition <select value={period} onChange={e=>setPeriod(e.target.value==='all'?'all':2026)}><option value="2026">2026</option><option value="all">All time</option></select></label><span>Try the reveals, rankings, and chapter menu.</span></div><PersonalRecap key={period} anime={anime} manga={manga} period={period} asOf="2026-09-19" name="Sample reader"/></main><SiteFooter/></>;
}
