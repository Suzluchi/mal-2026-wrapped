import { selectCompletions } from './eligibility.mjs';
import { tasteAwards } from './awards.mjs';
import { recap } from './recap.mjs';
import { insights } from './insights.mjs';
export function buildStory(anime,manga,period,asOf) {
 const data={anime:recap(anime,period,asOf),manga:recap(manga,period,asOf)};
 const slides=[{id:'opening',group:'Your story',type:'opening',title:`Ready to see what your ${period==='all'?'all-time story':period} looked like?`,quip:'The scores. The binges. The questionable decisions. We kept the receipts.'}];
 for(const [key,items] of [['anime',anime],['manga',manga]]) {
  const s=data[key],i=insights(items,period,asOf),a=key==='anime';
  const add=(id,type,title,extra={})=>slides.push({id:`${key}-${id}`,group:a?'Anime':'Manga',type,title,kind:key,...extra});
  if(!s.count)continue;
  add('count','count',a?'anime completed. But where did you find the time?':'manga completed.',{eyebrow:a?'':'THE PAGES WERE TURNING.',value:s.count,items:selectCompletions(items,period,asOf).selected.slice().sort((a,b)=>(b.score||0)-(a.score||0)||a.title.localeCompare(b.title)).slice(0,5),quip:a?'“One more episode” really added up.':'“Just one more chapter” was clearly a lie.'});
  if(s.rated){
   add('question','question',a?'And the anime that got your highest score?':'But which manga earned your highest score?',{emphasis:'highest score?',quip:a?'You know the one. Or do you?':'Think you know?'});
   add('highest','spotlight',a?'AND THERE IT IS.':'FOUND IT. YOUR #1.',{item:s.highest[0],metric:'score',unit:'/10',quip:a?'Apparently, this one could do no wrong.':'Yeah... this one clearly had you hooked.'});
   const n=Math.min(5,s.top.length);
   add('top','ranking',n===5?'THE ELITE FIVE.':'THE ELITE LINEUP.',{subtitle:`Your top ${n} ${key}.`,items:s.top.slice(0,5),metric:'score',unit:'/10',quip:a?'Getting into this lineup was not easy.':'Your personal hall of fame.'});
   if(s.highest[0].score!==s.lowest[0].score)add('bottom','ranking',a?'...AND THEN THERE WERE THESE.':'WELL... THEY CAN’T ALL BE WINNERS.',{items:s.bottom.slice(0,5),metric:'score',unit:'/10',quip:a?'You watched them. You finished them. You had thoughts.':'At least you gave them a chance.'});
   add('scores','number','THE VERDICT IS IN.',{value:s.average.toFixed(1),unit:'/10',quip:a?'Your average anime score. Tough critic or generous watcher?':'Your average manga score. The numbers don’t lie.'});
  }
  if(s.months.length){
   const month=s.busiest[0],label=new Date(month[0]+'-01T00:00:00Z').toLocaleDateString('en',{month:'long',year:'numeric',timeZone:'UTC'}).toUpperCase();
   add('month-question','question',a?'So... when did the binge really hit?':'When did the reading spree take over?',{emphasis:a?'when did the binge really hit?':'reading spree',quip:a?'One month had a lot of endings.':'One month had you turning a lot of pages.'});
   add('month','month',`${label} ${a?'WAS SOMETHING ELSE.':'BELONGED TO MANGA.'}`,{value:month[1],unit:a?'anime completed.':'completed.',quip:a?'Sleep was optional. Apparently.':'Chapter after chapter after chapter...'});
  }
  if(i.genres.rows.length)add('genres','categories',a?'OH, YOU DEFINITELY HAVE A TYPE.':'YEP. YOU HAVE A TYPE HERE TOO.',{rows:i.genres.rows.slice(0,3),quip:a?'Your watch history has spoken. Loudly.':'Your bookshelf has exposed you.'});
  const credits=a?i.studios:i.creators;
  if(credits.rows.length)add('credits','categories',a?'THE STUDIOS BEHIND THE OBSESSION.':'WHO KEPT YOU TURNING THE PAGES?',{rows:credits.rows.slice(0,3),quip:a?'Somehow, they kept pulling you back in.':'Recognise any favourites?'});
  if(s.longest.length){
   add('length-question','question',a?'But which anime had you in it for the long haul?':'Which manga had chapters for DAYS?',{emphasis:a?'long haul?':'chapters for DAYS?',quip:a?'This was definitely not a weekend watch.':'How long did you last?'});
   add('longest','spotlight',a?'NOW THAT’S COMMITMENT.':'THAT WAS A JOURNEY.',{item:s.longest[0],metric:'length',unit:a?' episodes':' chapters',scope:'CATALOG LENGTH',quip:a?'You started it. You stayed. You survived.':'Somewhere along the way, this became a lifestyle.'});
  }
 }
 if(data.anime.repeats.count+data.manga.repeats.count||data.anime.repeats.active.length||data.manga.repeats.active.length)slides.push({id:'repeats',group:'Encore',type:'repeats',title:'YOU REALLY SAID, “RUN IT BACK.”',quip:'Because apparently once was not enough.'});
 if(!data.anime.count&&!data.manga.count)slides.push({id:'empty',group:'Your story',type:'question',title:'Your story is still out there.',quip:period==='all'?'No completed titles were returned by MAL.':'No dated completions here. Try All time from the page behind this card.'});
 for(const kind of ['anime','manga']){
  const r=data[kind].repeats;
  const covers=[...new Map([...r.titles,...r.active].map(x=>[x.id,x])).values()];
  if(covers.length)slides.push({id:kind+'-repeat-covers',group:kind==='anime'?'Rewatches':'Rereads',kind,type:'repeat-covers',title:kind==='anime'?'BACK FOR ANOTHER EPISODE.':'BACK BETWEEN THE PAGES.',items:covers.slice(0,5),total:covers.length,quip:'Some stories are worth returning to.'});
 }
 const awards=tasteAwards(anime,manga,period,asOf);
 if(awards.length)slides.push({id:'awards',group:'Your Wrapped awards',type:'awards',title:'YOUR TASTE EARNED A TITLE.',awards});
 for(const award of awards)if(award.character)slides.push({id:award.kind+'-character',group:'Your '+award.kind+' match',type:'character',kind:award.kind,title:'YOUR STORY ENERGY.',award});
 slides.push({id:'closing',group:'Your keepsake',type:'closing',title:'THE RECEIPTS ARE YOURS.',awards});
 return {slides,data};
}
