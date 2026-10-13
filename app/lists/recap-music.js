'use client';
import { useEffect,useRef,useState } from 'react';
import { musicTracks,musicMix } from '../../lib/music.mjs';
const tracks=musicTracks.filter(t=>t.enabled);
export default function RecapMusic({open}){
 const audio=useRef(null),[index,setIndex]=useState(0),[playing,setPlaying]=useState(false),[error,setError]=useState(false);
 const track=tracks[index];
 useEffect(()=>{if(!open){audio.current?.pause();setPlaying(false);}},[open]);
 if(!track)return null;
 async function play(){try{audio.current.volume=.55;await audio.current.play();setError(false);}catch{setPlaying(false);setError(true);}}
 function toggle(){if(playing)audio.current.pause();else play();}
 function next(){const i=(index+1)%tracks.length;audio.current.currentTime=tracks[i].start+1.5;setIndex(i);if(playing)play();}
 return <><button className="recap-music" onClick={toggle} title={track.title+' — '+track.artist} aria-label={(playing?'Pause':'Play')+' music: '+track.title+' — '+track.artist}>{error?'Retry music':(playing?'♫ ':'▷ ')+track.title}</button><button className="recap-music-next" onClick={next} title="Next song" aria-label="Next song">↠</button><audio ref={audio} src={musicMix.src} preload="metadata" loop onPlay={()=>{if(!open){audio.current.pause();return;}setPlaying(true);}} onPause={()=>setPlaying(false)} onTimeUpdate={()=>{const t=audio.current.currentTime;let current=0;for(let i=0;i<tracks.length;i++)if(t>=tracks[i].start)current=i;setIndex(current);}} onError={()=>{setPlaying(false);setError(true);}}/></>;
}
