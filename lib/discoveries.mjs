import {selectTaste,dateYear} from './eligibility.mjs';
import {personalRanking} from './personal-ranking.mjs';
const rated=x=>Number.isInteger(x.score)&&x.score>=1&&x.score<=10;
export function discover(items,kind,period,asOf){
 const list=selectTaste(items,kind,period,asOf),scores=list.filter(rated),result={};
 const years=list.filter(x=>Number.isInteger(x.releaseYear)&&x.releaseYear<=Number(asOf.slice(0,4))&&x.releaseYear>=1900).map(x=>x.releaseYear).sort((a,b)=>a-b);
 if(kind==='anime'&&years.length>=5){
  const year=years[Math.floor((years.length-1)/2)],reference=period==='all'?Number(asOf.slice(0,4)):period;
  const bins=new Map();years.forEach(y=>bins.set(Math.floor(y/10)*10,(bins.get(Math.floor(y/10)*10)||0)+1));
  const spread=Math.max(...bins.values())/years.length<.5&&Math.max(...years)-Math.min(...years)>=20;
  const mode=spread?'mixed':reference-year>=15?'classic':reference-year<=5?'recent':'middle';
  const copy={classic:["You've got an old soul.",'Your anime taste belongs to another era. Some stories never get old.'],recent:['You kept up with the times.','New releases found a place in your story.'],mixed:['Your taste has been travelling through time.','Different decades. Plenty worth watching.'],middle:['Your favourites have had time to settle in.','Good stories do not come with an expiry date.']}[mode];
  result.era={year,mode,title:'YOUR ANIME ERA',line:copy[0],quip:copy[1],detail:`Middle release year of ${years.length} titles · ${Math.min(...years)}–${Math.max(...years)}`};
 }
 const comparable=scores.filter(x=>Number.isFinite(x.communityScore)&&x.communityScore>0&&x.communityScore<=10);
 if(comparable.length>=5){
  const average=comparable.reduce((n,x)=>n+Math.abs(x.score-x.communityScore),0)/comparable.length;
  const ordered=[...comparable].sort((a,b)=>Math.abs(b.score-b.communityScore)-Math.abs(a.score-a.communityScore)||a.id-b.id);
  const line=average>=1.5?"Apparently, popular opinion isn't your thing.":Math.abs(ordered[0].score-ordered[0].communityScore)>=2?'Mostly on the same page. Except for these.':'The fandom agrees with you. How suspicious.';
  result.community={title:'YOU VS. EVERYONE',line,average,item:ordered[0],detail:`Average score difference across ${comparable.length} rated titles. Community scores are today's snapshot.`};
 }
 // Require an established genre across at least five other titles, and a rare genre on the exception.
 if(scores.length>=8){
  const candidates=scores.filter(x=>x.score>=8).filter(x=>{
   const others=scores.filter(y=>y.id!==x.id),counts=new Map();
   others.forEach(y=>(y.genres||[]).forEach(g=>counts.set(g.id,(counts.get(g.id)||0)+1)));
   const dominant=[...counts].filter(([,n])=>n>=5&&n/others.length>=.5).map(([id])=>id);
   return dominant.length&&(x.genres||[]).length&&!x.genres.some(g=>dominant.includes(g.id))&&x.genres.some(g=>(counts.get(g.id)||0)/others.length<=.15);
  });
  if(candidates.length)result.twist={title:'YOUR PLOT TWIST',line:'You thought you had a type. Then this happened.',item:personalRanking(candidates,list)[0],quip:"Even you didn't see this coming."};
 }
 const gems=scores.filter(x=>x.score>=8&&Number.isSafeInteger(x.audience)&&x.audience>0&&x.audience<=(kind==='anime'?50000:20000));
 if(gems.length)result.gem={title:'HIDDEN GEM HUNTER',line:'Not everyone found this one. You did.',item:[...gems].sort((a,b)=>b.score-a.score||a.audience-b.audience||a.id-b.id)[0],detail:`Rated 8+ by you · at most ${kind==='anime'?'50,000':'20,000'} MAL list members. A discovery rule, not a claim of quality.`};
 return result;
}
export function graveyard(anime,manga,period,asOf){
 return ['anime','manga'].map(kind=>{
  const all=[...new Map((kind==='anime'?anime:manga).filter(x=>x.status==='dropped').map(x=>[x.id,x])).values()];
  const dated=x=>dateYear(x.droppedAt)!==null&&x.droppedAt<=asOf;
  const eligible=all.filter(x=>period==='all'||(dated(x)&&dateYear(x.droppedAt)===period));
  const items=eligible.sort((a,b)=>(dated(b)?b.droppedAt:'').localeCompare(dated(a)?a.droppedAt:'')||a.title.localeCompare(b.title)).slice(0,5).map(x=>({...x,mediaKind:kind,age:dated(x)?Math.floor((Date.parse(asOf)-Date.parse(x.droppedAt))/86400000):null}));
  return {kind,items,total:eligible.length,dated:items.every(dated)};
 });
}
