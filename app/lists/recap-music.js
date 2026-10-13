'use client';
import { useEffect,useRef,useState,useImperativeHandle } from 'react';
import { musicTracks,musicMix } from '../../lib/music.mjs';
const tracks=musicTracks.filter(t=>t.enabled);
export default function RecapMusic({open,controlRef}){
 const audio=useRef(null),userPaused=useRef(false),isOpen=useRef(open),[index,setIndex]=useState(0),[playing,setPlaying]=useState(false),[error,setError]=useState(false),[ready,setReady]=useState(false);
 const track=tracks[index];
 useImperativeHandle(controlRef,()=>({start(){isOpen.current=true;userPaused.current=false;play();}}));
 useEffect(()=>{
  isOpen.current=open;
  if(!open){audio.current?.pause();setPlaying(false);return;}
  userPaused.current=false;
  play();
  const start=event=>{if(event.target?.closest?.('.recap-music,.recap-music-next'))return;if(!userPaused.current&&audio.current?.paused)play();};
  window.addEventListener('pointerup',start);window.addEventListener('click',start);window.addEventListener('keydown',start);
  return()=>{window.removeEventListener('pointerup',start);window.removeEventListener('click',start);window.removeEventListener('keydown',start);};
 },[open]);
 if(!track)return null;
 async function play(){try{audio.current.volume=.55;await audio.current.play();setError(false);}catch{setPlaying(false);setError(true);}}
 function toggle(){if(playing){userPaused.current=true;audio.current.pause();}else{userPaused.current=false;play();}}
 function next(){const i=(index+1)%tracks.length;audio.current.currentTime=tracks[i].start+1.5;setIndex(i);if(playing)play();}
 return <><button className="recap-music" onClick={toggle} title={track.title+' — '+track.artist} aria-label={(playing?'Pause':'Play')+' music: '+track.title+' — '+track.artist}>{error?'Tap for music':(playing?'♫ ':'▷ ')+track.title}</button><button className="recap-music-next" disabled={!ready} onClick={next} title="Next song" aria-label="Next song">↠</button><audio ref={audio} src={musicMix.src} preload="auto" autoPlay loop onLoadedMetadata={()=>setReady(true)} onPlay={()=>{if(!isOpen.current){audio.current.pause();return;}setPlaying(true);setError(false);}} onPause={()=>setPlaying(false)} onTimeUpdate={()=>{const t=audio.current.currentTime;let current=0;for(let i=0;i<tracks.length;i++)if(t>=tracks[i].start)current=i;setIndex(current);}} onError={()=>{setPlaying(false);setError(true);}}/></>;
}
