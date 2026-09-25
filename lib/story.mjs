import { selectCompletions,dateYear } from './eligibility.mjs';
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
 const data={anime:recap(anime,period,asOf),manga:recap(manga,period,asOf)};
 data.anime.tv=recap(anime.filter(x=>x.format==='tv'),period,asOf);
 const slides=[{id:'opening',group:'Your story',type:'opening',title:`Ready to see what your ${period==='all'?'all-time story':period} looked like?`,quip:'The scores. The binges. The questionable decisions. We kept the receipts.'}];
 for(const [key,items] of [['anime',anime],['manga',manga]]) {
  const s=data[key],i=insights(items,period,asOf),a=key==='anime',rank=a?s.tv:s,states=activity(items,key,period,asOf);
  const add=(id,type,title,extra={})=>slides.push({id:`${key}-${id}`,group:a?'Anime':'Manga',type,title,kind:key,...extra});
  if(items.length){
   add('started','count',`${key} started ${period==='all'?'on record':'in '+period}.`,{value:states.started.length,scope:'RECORDED START DATES',items:montage(states.started),quip:'Every story starts somewhere.'});
   add('current','count',a?'STILL IN THE WATCHING ERA.':'THE BOOKMARK IS STILL IN.',{value:states.current.length,scope:a?'CURRENTLY WATCHING · ALL START YEARS':'CURRENTLY READING · ALL START YEARS',items:montage(states.current),quip:a?'The credits haven’t rolled on these yet.':'A few stories are still unfolding.'});
   add('planned','count',a?'THE WATCHLIST IS WAITING.':'THE NEXT CHAPTER IS WAITING.',{value:states.planned.length,scope:a?'CURRENT PLAN TO WATCH':'CURRENT PLAN TO READ',items:montage(states.planned),quip:'So many stories. One very optimistic schedule.'});
  }
  if(!s.count)continue;
  add('count','count',a?'anime completed. But where did you find the time?':'manga completed.',{eyebrow:a?'':'THE PAGES WERE TURNING.',value:s.count,items:montage(selectCompletions(items,period,asOf).selected),quip:a?'“One more episode” really added up.':'“Just one more chapter” was clearly a lie.'});
  if(rank.rated){
   add('question','question',a?'And the TV anime that got your highest score?':'But which manga earned your highest score?',{emphasis:'highest score?',quip:a?'You know the one. Or do you?':'Think you know?'});
   // Equal personal scores cannot identify a unique favourite. Reveal each highest scorer without a false winner.
   for(let start=0;start<rank.highest.length;start+=5){
    const batch=rank.highest.slice(start,start+5);
    if(rank.highest.length===1)add('highest','spotlight',a?'AND THERE IT IS.':'FOUND IT. YOUR #1.',{item:batch[0],metric:'score',unit:'/10',scope:a?'TV ANIME':'MANGA',quip:a?'Apparently, this one could do no wrong.':'Yeah... this one clearly had you hooked.'});
    else add(start===0?'highest':`highest-${start}`,'ranking','YOUR HIGHEST-SCORED STORIES.',{items:batch,metric:'score',unit:'/10',subtitle:`${rank.highest.length} ${a?'TV anime':'manga'} earned ${rank.highest[0].score}/10.`,shared:true,start,quip:'More than one story earned that score.'});
   }
   const n=Math.min(5,rank.top.length);
   add('top','ranking',n===5?'THE ELITE FIVE.':'THE ELITE LINEUP.',{subtitle:`Your top ${n} ${a?'TV anime':'manga'}.`,items:rank.top.slice(0,5),metric:'score',unit:'/10',quip:a?'Getting into this lineup was not easy.':'Your personal hall of fame.'});
  }
  if(s.rated){
   if(s.highest[0].score!==s.lowest[0].score)add('bottom','ranking',a?'...AND THEN THERE WERE THESE.':'WELL... THEY CAN’T ALL BE WINNERS.',{items:s.bottom.slice(0,5),metric:'score',unit:'/10',quip:a?'You watched them. You finished them. You had thoughts.':'At least you gave them a chance.'});
   add('scores','number','THE VERDICT IS IN.',{value:s.average.toFixed(1),unit:'/10',quip:a?'Your average anime score. Tough critic or generous watcher?':'Your average manga score. The numbers don’t lie.'});
  }
  if(s.months.length){const month=s.busiest[0],label=new Date(month[0]+'-01T00:00:00Z').toLocaleDateString('en',{month:'long',year:'numeric',timeZone:'UTC'}).toUpperCase();
   add('month-question','question',a?'So... when did the binge really hit?':'When did the reading spree take over?',{emphasis:a?'when did the binge really hit?':'reading spree',quip:a?'One month had a lot of endings.':'One month had you turning a lot of pages.'});
   add('month','month',`${label} ${a?'WAS SOMETHING ELSE.':'BELONGED TO MANGA.'}`,{value:month[1],unit:a?'anime completed.':'completed.',quip:a?'Sleep was optional. Apparently.':'Chapter after chapter after chapter...'});
  }
  if(i.genres.rows.length)add('genres','categories',a?'OH, YOU DEFINITELY HAVE A TYPE.':'YEP. YOU HAVE A TYPE HERE TOO.',{rows:i.genres.rows.slice(0,5),quip:a?'Your watch history has spoken. Loudly.':'Your bookshelf has exposed you.'});
  const credits=a?i.studios:i.creators;
  if(credits.rows.length)add('credits','categories',a?'THE STUDIOS BEHIND THE OBSESSION.':'WHO KEPT YOU TURNING THE PAGES?',{rows:credits.rows.slice(0,5),quip:a?'Somehow, they kept pulling you back in.':'Recognise any favourites?'});
  if(s.longest.length){add('length-question','question',a?'But which anime had you in it for the long haul?':'Which manga had chapters for DAYS?',{emphasis:a?'long haul?':'chapters for DAYS?',quip:a?'This was definitely not a weekend watch.':'How long did you last?'});
   add('longest','spotlight',a?'NOW THAT’S COMMITMENT.':'THAT WAS A JOURNEY.',{item:s.longest[0],metric:'length',unit:a?' episodes':' chapters',scope:'CATALOG LENGTH',quip:a?'You started it. You stayed. You survived.':'Somewhere along the way, this became a lifestyle.'});}
 }
 if(data.anime.repeats.count+data.manga.repeats.count||data.anime.repeats.active.length||data.manga.repeats.active.length)slides.push({id:'repeats',group:'Encore',type:'repeats',title:'YOU REALLY SAID, “RUN IT BACK.”',quip:'Because apparently once was not enough.'});
 if(!data.anime.count&&!data.manga.count)slides.push({id:'empty',group:'Your story',type:'question',title:'Your story is still out there.',quip:period==='all'?'No completed titles were returned by MAL.':'No dated completions here. Try All time from the page behind this card.'});
 for(const kind of ['anime','manga']){const r=data[kind].repeats,covers=[...new Map([...r.titles,...r.active].map(x=>[x.id,x])).values()];for(let start=0;start<covers.length;start+=5)slides.push({id:kind+'-repeat-covers'+(start?'-'+start:''),group:kind==='anime'?'Rewatches':'Rereads',kind,type:'repeat-covers',title:kind==='anime'?'BACK FOR ANOTHER EPISODE.':'BACK BETWEEN THE PAGES.',items:covers.slice(start,start+5),start,total:covers.length,quip:'Some stories are worth returning to.'});}
 if(badges.status==='ok'){
  const selected=badges.items.filter(x=>period==='all'||x.year===period);
  if(selected.length)for(let start=0;start<selected.length;start+=5)slides.push({id:'badges-'+start,type:'badges',group:'Official MAL badges',title:'PROOF YOU SHOWED UP.',items:selected.slice(start,start+5),total:selected.length,quip:officialBadgeCopy.earned.short[0]});
  else if(period==='all'||!badges.items.some(x=>!x.year))slides.push({id:'badges-empty',type:'badges',group:'Official MAL badges',title:'THE BADGE SHELF IS QUIET.',items:[],total:0,quip:period==='all'?'Zero activities claimed. The showcase remains in total silence.':officialBadgeCopy.zero.short[0]});
 }
 const awards=tasteAwards(anime,manga,period,asOf);
 if(awards.length)slides.push({id:'awards',group:'Your Wrapped awards',type:'awards',title:'YOUR TASTE EARNED A TITLE.',awards});
 for(const award of awards)if(award.character)slides.push({id:award.kind+'-character',group:'Your '+award.kind+' match',type:'character',kind:award.kind,title:'YOUR STORY ENERGY.',award});
 slides.push({id:'closing',group:'Your keepsake',type:'closing',title:'THE RECEIPTS ARE YOURS.',awards});return {slides,data};
}
