import { recap } from './recap.mjs';
import { insights } from './insights.mjs';
export function buildStory(anime,manga,period,asOf) {
  const data={anime:recap(anime,period,asOf),manga:recap(manga,period,asOf)};
  const slides=[{id:'opening',group:'Your story',type:'opening',title:'Ready for your plot twist?',quip:'You brought the taste. We brought the receipts.'}];
  for(const [key,items] of [['anime',anime],['manga',manga]]) {
    const s=data[key],i=insights(items,period,asOf),group=key==='anime'?'Anime':'Manga';
    const add=(id,type,title,extra={})=>slides.push({id:`${key}-${id}`,group,type,title,kind:key,...extra});
    if(!s.count) continue;
    add('count','count',`${key} completed.`,{value:s.count,quip:key==='anime'?'“One more episode” really added up.':'“One more chapter” really added up.'});
    if(s.rated) {
      add('question','question',key==='anime'?'And the anime that got your highest score?':'But which manga got your highest score?',{quip:'You know the one. Or do you?'});
      add('highest','spotlight','This one understood the assignment.',{item:s.highest[0],metric:'score',unit:'/10',quip:'Straight to the favourites conversation.'});
      add('top','ranking',`Your top ${Math.min(5,s.top.length)}.`,{items:s.top.slice(0,5),metric:'score',unit:'/10',quip:'The company it keeps? Pretty good.'});
      if(s.highest[0].score!==s.lowest[0].score) add('bottom','ranking','Not quite your thing.',{items:s.bottom.slice(0,5),metric:'score',unit:'/10',quip:'You gave them a chance. That counts.'});
      add('scores','number','Your average score.',{value:s.average.toFixed(1),unit:'/10',quip:s.average>=8?'You found your people. And your stories.':s.average>=6?'You know what you like.':'A tough crowd. A crowd of one.'});
    }
    if(s.months.length) {
      const month=s.busiest[0];
      add('month-question','question','When did you go all in?',{quip:'One month had a lot of endings.'});
      add('month','month',new Date(month[0]+'-01T00:00:00Z').toLocaleDateString('en',{month:'long',year:'numeric',timeZone:'UTC'}),{value:month[1],quip:'completed titles. A busy chapter.'});
    }
    if(i.genres.rows.length) add('genres','categories','You clearly have a type.',{rows:i.genres.rows.slice(0,3),quip:'Your most-completed genres & tags.'});
    const credits=key==='anime'?i.studios:i.creators;
    if(credits.rows.length) add('credits','categories',key==='anime'?'They kept you watching.':'They kept you turning pages.',{rows:credits.rows.slice(0,3),quip:key==='anime'?'Your top studios. Take a bow.':'Your top manga creators. Take a bow.'});
    if(s.longest.length) {
      add('length-question','question',key==='anime'?'Which title went the distance?':'Which title had pages for days?',{quip:'Short and sweet? Not this time.'});
      add('longest','spotlight','That was a commitment.',{item:s.longest[0],metric:'length',unit:key==='anime'?' episodes':' chapters',quip:'Full title length. Quite the story.'});
    }
  }
  const repeats=data.anime.repeats.count+data.manga.repeats.count;
  if(repeats || data.anime.repeats.active.length || data.manga.repeats.active.length) slides.push({id:'repeats',group:'Encore',type:'repeats',title:'You came back for more.',quip:'Some stories deserve another round.'});
  if(!data.anime.count&&!data.manga.count) slides.push({id:'empty',group:'Your story',type:'question',title:'Your story is still out there.',quip:'No dated completions here. Try All time from the page behind this card.'});
  slides.push({id:'closing',group:'The end… for now',type:'closing',title:'Now that’s a story.',quip:'Same time, next obsession?'});
  return {slides,data};
}
