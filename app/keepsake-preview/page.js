'use client';
import Keepsake from '../lists/keepsake';
import {buildStory} from '../../lib/story.mjs';
import {chooseCharacter} from '../../lib/keepsake.mjs';
const names=['The Last Train','Paper Satellites','The Blue Hour','Sea of Sundays','Field Notes from Tomorrow'];
const make=(kind)=>names.map((title,i)=>({id:i+1,title,status:'completed',score:10-i,length:kind==='anime'?24:120,episodeSeconds:1440,format:kind==='anime'?'tv':'manga',releaseYear:2000+i*2,startDate:'2026-01-01',finishDate:'2026-02-01',genres:[{id:1,name:'Drama'}],repeatCount:0}));
const {data}=buildStory(make('anime'),make('manga'),2026,'2026-10-16');
export default function Preview(){return <main style={{background:'#080d20',minHeight:'100vh',padding:'20px 0'}}><p style={{color:'white',textAlign:'center'}}>Keepsake preview · fictional statistics · sample character</p><div className="fx-card" data-type="closing" style={{width:'min(1200px,100%)',height:'auto',margin:'auto',containerType:'inline-size'}}><div className="fx-scene" style={{padding:0}}><Keepsake data={data} name="Sample reader" period={2026} sample favourite={chooseCharacter([{id:73935,name:'Saitama'}])} awards={[{title:'The Curious Explorer'},{title:'The Selective Critic'}]}/></div></div></main>}
