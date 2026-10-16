import {selectCompletions} from './eligibility.mjs';

export const backgrounds = [
 {id:'twilight-sky',name:'Twilight sky'},
 {id:'purple-clouds',name:'Purple clouds'},
 {id:'sunset-sea',name:'Sunset sea'},
 {id:'orange-sky',name:'Orange sky'},
 {id:'autumn-canal',name:'Autumn canal'},
];
const artwork = new Map([
 [73935,{src:'/keepsake/characters/saitama.png',name:'Saitama'}],
]);
export function chooseCharacter(favourites=[]){
 // A curated full-size illustration takes priority, but only if this user
 // actually lists that character as a favourite. Never invent a favourite.
 const match=favourites.find(c=>artwork.has(c.id));
 if(match)return {...match,art:artwork.get(match.id).src,cutout:true};
 const first=favourites.find(c=>c.cover);
 return first?{...first,art:first.cover,cutout:false}:null;
}
const positive=n=>Number.isFinite(n)&&n>0;
export function timeEstimate(items,kind,period,asOf){
 // Year views count content belonging to completed titles in that year,
 // not an invented timeline of the user's actual reading/watching sessions.
 const selected=selectCompletions(items,period,asOf).selected;
 let minutes=0,known=0;
 for(const item of selected){
  if(!positive(item.length))continue;
  if(kind==='anime'&&!positive(item.episodeSeconds))continue;
  minutes+=item.length*(kind==='anime'?item.episodeSeconds/60:5);
  known++;
 }
 return {hours:known?Math.round(minutes/60):selected.length?null:0,known,total:selected.length,partial:known<selected.length};
}
