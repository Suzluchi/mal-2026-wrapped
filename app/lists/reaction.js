'use client';
import { useEffect, useState } from 'react';
export default function Reaction({name,paused=false,className=''}) {
 const [reduced,setReduced]=useState(true),[failed,setFailed]=useState(false);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(q.matches);update();q.addEventListener('change',update);return()=>q.removeEventListener('change',update);},[]);
 if(!name||failed)return null;
 const still=paused||reduced;
 return <span className={`recap-reaction ${className}`} aria-hidden="true"><img className="reaction-live" src={`/reactions/${name}.${still?'png':'gif'}`} alt="" onError={()=>setFailed(true)}/><img className="reaction-still" src={`/reactions/${name}.png`} alt=""/></span>;
}
