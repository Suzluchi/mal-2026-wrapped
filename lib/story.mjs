import {timeEstimate} from './keepsake.mjs';
import {discover,graveyard} from './discoveries.mjs';
import {personalRanking} from './personal-ranking.mjs';
import { selectCompletions,selectTaste,dateYear } from './eligibility.mjs';
import { tasteAwards,officialBadgeCopy } from './awards.mjs';
import { recap } from './recap.mjs';
import { insights } from './insights.mjs';
// Stable mixed order with no relationship to scores; full collection, never top-five spoilers.
export function montage(items){return [...items].sort((a,b)=>((a.id*2654435761)>>>0)-((b.id*2654435761)>>>0));}
export function activity(items,kind,period,asOf){
 const unique=[...new Map(items.map(x=>[x.id,x])).values()];
 return {started:unique.filter(x=>!x.isRepeating&&dateYear(x.startDate)!==null&&x.startDate<=asOf&&(period==='all'||dateYear(x.startDate)===period)&&!(dateYear(x.finishDate)!==null&&x.finishDate<x.startDate)),current:unique.filter(x=>x.status===(kind==='anime'?'watching':'reading')),planned:unique.filter(x=>x.status===(kind==='anime'?'plan_to_watch':'plan_to_read'))};
}
export function buildStory(anime,manga,period,asOf,badges={status:'unknown'}) {
 const data={anime:recap(anime,period,asOf),manga:recap(manga,period,asOf,'manga')};
 data.time={anime:timeEstimate(anime,'anime',period,asOf),manga:timeEstimate(manga,'manga',period,asOf)};
 data.anime.tv=recap(anime.filter(x=>x.format==='tv'),period,asOf);
 data.discoveries={anime:discover(anime,'anime',period,asOf),manga:discover(manga,'manga',period,asOf)};
 const slides=[{id:'opening',group:'Your story',type:'opening',title:`Ready to see what your ${period==='all'?'all-time story':period} looked like?`,quip:data.anime.rated+data.manga.rated?'The scores. The binges. The questionable decisions. We kept the receipts.':anime.length+manga.length?'The stories. The possibilities. Your next chapter is waiting.':'A fresh page. A new beginning. Your next favourite is out there.'}];
 for(const [key,items] of [['anime',anime],['manga',manga]]) {
  const s=data[key],i=insights(items,period,asOf,key),a=key==='anime',rank=a?s.tv:s,states=activity(items,key,period,asOf);
  const add=(id,type,title,extra={})=>slides.push({id:`${key}-${id}`,group:a?'Anime':'Manga',type,title,kind:key,...extra});
  if(items.length){
   if(states.started.length)add('started','count',`${key} started ${period==='all'?'on record':'in '+period}.`,{value:states.started.length,scope:'RECORDED START DATES',items:montage(states.started),quip:'Every story starts somewhere.'});
   if(states.current.length)add('current','count',a?'STILL IN THE WATCHING ERA.':'THE BOOKMARK IS STILL IN.',{value:states.current.length,scope:a?'CURRENTLY WATCHING · ALL START YEARS':'CURRENTLY READING · ALL START YEARS',items:montage(states.current),quip:a?'The credits haven’t rolled on these yet.':"Some favourites are still being written."});
   if(states.planned.length)add('planned','count',a?'THE “SOMEDAY” SHELF':'THE NEXT CHAPTER IS WAITING.',{value:states.planned.length,scope:a?'CURRENT PLAN TO WATCH':'CURRENT PLAN TO READ',items:montage(states.planned),quip:'So many stories. One very optimistic schedule.'});
  }
  if(!s.tasteCount)continue;
  if(s.count){
  add('count','completed-intro',a?'anime completed. But where did you find the time?':'manga completed.',{eyebrow:a?'':'THE PAGES WERE TURNING.',value:s.count,items:montage(selectCompletions(items,period,asOf).selected),quip:a?'“One more episode” really added up.':'“Just one more chapter” was clearly a lie.'});
  add('completed-covers','montage',a?'“One more episode” really added up.':'“Just one more chapter” was clearly a lie.',{items:montage(selectCompletions(items,period,asOf).selected)});
  }
  if(rank.rated){
   add('question','question',a?'And the TV anime that got your highest score?':'But which manga earned your highest score?',{emphasis:'highest score?',quip:a?'You know the one. Or do you?':'Think you know?'});
   const history=selectTaste(items,key,period,asOf);
   const winner=personalRanking(rank.highest,history)[0];
   const ordered=personalRanking(rank.top,history);rank.showcase=ordered;
   add('highest','spotlight','YOUR CROWN JEWEL',{item:winner,metric:'score',unit:'/10',genres:(winner.genres||[]).filter(g=>!/^eligible titles for /i.test(g.name)).slice(0,3),quip:a?'Apparently, this one could do no wrong.':'Yeah… this one clearly had you hooked.'});
   const n=Math.min(5,rank.top.length);
   add('top','ranking',n===5?'THE ELITE FIVE.':'THE ELITE LINEUP.',{subtitle:`Your top ${n} ${a?'TV anime':'manga'}.`,items:ordered.slice(0,5),metric:'score',unit:'/10',quip:a?'Getting into this lineup was not easy.':'Your personal hall of fame.'});
  }
  if(s.rated){
   if(s.highest[0].score!==s.lowest[0].score)add('bottom','ranking',a?'THE DISAPPOINTMENTS DEPARTMENT':'WELL... THEY CAN’T ALL BE WINNERS.',{items:s.bottom.slice(0,5),metric:'score',unit:'/10',quip:a?'You watched them. You finished them. You had thoughts.':'At least you gave them a chance.'});
   add('scores','number','THE VERDICT IS IN.',{value:s.average.toFixed(1),unit:'/10',verdict:s.average>=8?'You give a good story its flowers.':s.average<=6?'Every chapter had to earn those points.':'You give credit where it’s due.',quip:a?'Your average anime score. Tough critic or generous watcher?':'Your average manga score. The numbers don’t lie.'});
  }
  if(s.months.length){const month=s.busiest[0],label=new Date(month[0]+'-01T00:00:00Z').toLocaleDateString('en',{month:'long',year:'numeric',timeZone:'UTC'}).toUpperCase();
   add('month-question','question',a?'So... when did the binge really hit?':'When did the reading spree take over?',{emphasis:a?'when did the binge really hit?':'reading spree',quip:a?'One month had a lot of endings.':'One month had you turning a lot of pages.'});
   add('month','month',a?'YOUR BINGE ERA':`${label} BELONGED TO MANGA.`,{monthLabel:label,value:month[1],unit:a?'anime completed.':'completed.',quip:a?`${label} had other plans for you, apparently.`:'Chapter after chapter after chapter...'});
  }
  if(i.genres.rows.length)add('genres','categories',a?'OH, YOU DEFINITELY HAVE A TYPE.':'YEP. YOU HAVE A TYPE HERE TOO.',{rows:i.genres.rows.slice(0,5),quip:a?'Your watch history has spoken. Loudly.':'Your bookshelf has exposed you.'});
  const credits=a?i.studios:i.creators;
  if(credits.rows.length)add('credits','categories',a?'THE STUDIOS BEHIND THE OBSESSION.':'YOUR AUTHOR OBSESSION',{rows:credits.rows.slice(0,5),quip:a?'Somehow, they kept pulling you back in.':credits.rows[0].count>1?'Different titles. One familiar name.':'Different stories. Different voices.'});
  if(s.longest.length){add('length-question','question',a?'But which anime had you in it for the long haul?':'Which manga had chapters for DAYS?',{emphasis:a?'long haul?':'chapters for DAYS?',quip:a?'This was definitely not a weekend watch.':'How long did you last?'});
   add('longest','spotlight',a?'THE LONG HAUL':'MANGA MOUNTAIN',{item:s.longest[0],metric:'length',unit:a?' episodes':' chapters',scope:'CATALOG LENGTH',quip:a?'You started it. You stayed. You survived.':'That was no casual climb.'});}
  for(const [concept,value] of Object.entries(data.discoveries[key]))slides.push({id:`${key}-${concept}`,kind:key,group:a?'Anime discoveries':'Manga discoveries',type:'discovery',concept,...value});
 }
 const graves=graveyard(anime,manga,period,asOf).filter(x=>x.items.length);
 if(graves.length)slides.push({id:'graveyard',group:'Anime & Manga Graveyard',type:'graveyard',title:'WE’RE NOT FINISHING THIS',quip:'You gave it a chance. That was enough.',groups:graves});
 const repeatItems=['anime','manga'].flatMap(kind=>{const r=data[kind].repeats;return [...new Map([...r.titles,...r.active].map(x=>[x.id,x])).values()].map(x=>({...x,mediaKind:kind,galleryId:kind+'-'+x.id}));});
 const hasLists=anime.length+manga.length>0;
 if(hasLists){
  const unknown=data.anime.repeats.unknown+data.manga.repeats.unknown;
  slides.push({id:'repeat-gallery',group:'Encore',type:'repeat-covers',summary:['anime','manga'].filter(k=>data[k].repeats.total>0).map(k=>`${data[k].repeats.known?data[k].repeats.count:'Unknown'} ${k==='anime'?'rewatches':'rereads'}`).join(' · '),title:repeatItems.length?'YOU REALLY SAID, “RUN IT BACK.”':unknown?'ANOTHER ROUND?':'YOU KEPT MOVING FORWARD.',items:repeatItems,total:repeatItems.length,quip:repeatItems.length?'Some stories are worth returning to.':unknown?'MAL hasn’t recorded enough repeat details to tell this part of your story.':'No recorded rewatches or rereads. New stories were calling.'});
 }
 if(!data.anime.tasteCount&&!data.manga.tasteCount)slides.push({id:'empty',group:'Your story',type:'empty',title:hasLists?'YOUR STORY IS STILL UNFOLDING.':'YOUR STORY IS JUST GETTING STARTED.',quip:!hasLists?'Your lists are empty for now. The first story is yours to choose.':period==='all'?'No completed titles on record yet. Every story starts somewhere.':'No dated completions for this year. Your all-time story may have more to tell.',offerAllTime:hasLists&&period!=='all'});
 if(badges.status==='ok'){
  const selected=badges.items.filter(x=>period==='all'||x.year===period);
  if(selected.length)slides.push({id:'badges-0',type:'badges',group:'Official MAL badges',title:selected.length>10?'YOU’RE AN EVENT OG.':'PROOF YOU SHOWED UP.',items:selected,total:selected.length,quip:selected.length>10?'Over ten badges. You didn’t just show up—you made yourself known.':officialBadgeCopy.earned.short[0]});
  else if(period==='all'||!badges.items.some(x=>!x.year))slides.push({id:'badges-empty',type:'badges',group:'Official MAL badges',title:'THE BADGE SHELF IS QUIET.',items:[],total:0,quip:period==='all'?'Zero activities claimed. The showcase remains in total silence.':officialBadgeCopy.zero.short[0]});
 }
 const awards=tasteAwards(anime,manga,period,asOf);
 if(awards.length)slides.push({id:'awards',group:'Your Wrapped awards',type:'awards',title:'YOUR TASTE EARNED A TITLE.',awards});
 for(const award of awards)slides.push({id:award.kind+'-character',group:'Your '+award.kind+' match',type:'energy',kind:award.kind,title:award.kind==='anime'?'YOUR WATCHING ENERGY.':'YOUR READING ENERGY.',award});
 slides.push({id:'closing',group:'Your keepsake',type:'closing',title:'THE RECEIPTS ARE YOURS.',awards});return {slides,data};
}
