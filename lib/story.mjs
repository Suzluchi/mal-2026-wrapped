import { recap } from './recap.mjs';
import { insights } from './insights.mjs';
function leaders(rows) {
  const cutoff=rows[4]?.count ?? 0;
  return rows.filter((x,i)=>i<5 || x.count===cutoff);
}
export function buildStory(anime,manga,period,asOf) {
  const data={anime:recap(anime,period,asOf),manga:recap(manga,period,asOf)};
  const slides=[{id:'opening',group:'Your story',type:'opening',title:period==='all'?'The stories you have finished.':`${period}, one story at a time.`}];
  for(const [key,items] of [['anime',anime],['manga',manga]]) {
    const s=data[key],i=insights(items,period,asOf),group=key==='anime'?'Anime':'Manga';
    const add=(id,title,type,extra={})=>slides.push({id:`${key}-${id}`,group,title,type,kind:key,...extra});
    add('count',s.count?`${s.count} completed ${key} titles.`:`A quieter ${key} chapter.`,'count',{stats:s});
    if(s.rated) {
      add('highest','Which titles earned your highest score?','reveal',{items:s.highest,metric:'score',unit:'/10',note:'Your current scores. Every tie is shown.'});
      add('top','Your highest-rated shelf.','picks',{items:s.top,metric:'score',unit:'/10',note:'Up to five titles, plus everyone tied at the cutoff. Unrated titles are excluded.'});
      add('scores','The way you scored these stories.','scores',{stats:s});
      // One score for all titles has no distinct lowest result worth repeating.
      if(s.highest[0].score!==s.lowest[0].score) add('bottom','The lower end of your scores.','picks',{items:s.bottom,metric:'score',unit:'/10',note:'Your lowest current scores among completions in this period, including ties at the fifth title.'});
    }
    if(s.months.length) add('months','When the stories reached their endings.','months',{stats:s});
    const categories=[['genres','The genres and tags you returned to.','MAL labels can include themes and demographics.'],[key==='anime'?'studios':'creators',key==='anime'?'The studios behind your completed titles.':'The creators behind your completed titles.',key==='anime'?'A title may credit several studios.':'Story and art credits each count once per creator per title.'],['formats','The forms your stories took.','Formats come from MAL.'],...(key==='anime'?[['sources','Where those adaptations began.','Original source types recorded by MAL.']]:[])];
    for(const [field,title,note] of categories) if(i[field].rows.length) add(field,title,'categories',{rows:leaders(i[field].rows),coverage:i[field],total:s.count,note:`${note} Ranked by completed-title count; ties at the fifth category are included.`});
    if(s.oldest.length) add('years','Your stories crossed release years.','years',{stats:s,note:'Original airing/publication years, not the years you watched or read them.'});
    if(s.longest.length) {
      const unit=key==='anime'?'episodes':'chapters';
      add('longest',`The longest titles on this shelf.`,'picks',{items:s.longest,metric:'length',unit:` ${unit}`,note:`Catalog length, not ${unit} consumed during this period. Length available for ${s.lengthKnown} of ${s.count} titles.`});
      if(s.longest[0].length!==s.shortest[0].length) add('shortest','The shorter stories had a place too.','picks',{items:s.shortest,metric:'length',unit:` ${unit}`,note:`Catalog length, including ties at the fifth title. This is not a measure of time spent.`});
    }
  }
  slides.push({id:'repeats',group:'Beyond the year',title:'Some stories invite you back.',type:'repeats'});
  slides.push({id:'context',group:'Your data',title:'What this story can tell us.',type:'context'});
  slides.push({id:'closing',group:'Your summary',title:'Your reading and watching, together.',type:'closing'});
  return {slides,data};
}
