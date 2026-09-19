import { selectCompletions, completionIssue, todayUTC } from './eligibility.mjs';
export function rankTitles(items, value, descending=true, limit=5) {
  const sorted=[...items].filter(x=>Number.isFinite(value(x))).sort((a,b)=>(descending?-1:1)*(value(a)-value(b)) || a.title.localeCompare(b.title) || a.id-b.id);
  const cutoff=sorted[Math.min(limit,sorted.length)-1];
  return cutoff ? sorted.filter(x=>descending?value(x)>=value(cutoff):value(x)<=value(cutoff)) : [];
}
export function repeatContext(items) {
  const unique=[...new Map(items.map(x=>[x.id,x])).values()];
  const known=unique.filter(x=>Number.isSafeInteger(x.repeatCount) && x.repeatCount>=0);
  return {count:known.reduce((sum,x)=>sum+x.repeatCount,0),known:known.length,total:unique.length,
    titles:known.filter(x=>x.repeatCount>0).sort((a,b)=>b.repeatCount-a.repeatCount || a.title.localeCompare(b.title)),
    activeKnown:unique.filter(x=>typeof x.isRepeating==='boolean').length, active:unique.filter(x=>x.isRepeating===true),unknown:unique.length-known.length};
}
export function recap(items, period, asOf = todayUTC()) {
  const { selected, issues } = selectCompletions(items, period, asOf);
  const rated = selected.filter(x => Number.isInteger(x.score) && x.score >= 1 && x.score <= 10);
  const top=rankTitles(rated,x=>x.score), bottom=rankTitles(rated,x=>x.score,false);
  const months = new Map();
  for (const x of selected) if (completionIssue(x, asOf) === null) {
    const key = x.finishDate.slice(0,7);
    months.set(key, (months.get(key) || 0)+1);
  }
  const peak = Math.max(0,...months.values());
  const dates=[...months].sort(([a],[b])=>a.localeCompare(b));
  const lengths=selected.filter(x=>Number.isSafeInteger(x.length) && x.length>0);
  const years=selected.filter(x=>Number.isInteger(x.releaseYear));
  return { count:selected.length, rated:rated.length, average:rated.length ? rated.reduce((n,x)=>n+x.score,0)/rated.length : null,
    missingDates:issues.undated, issues, repeats:repeatContext(items),
    highest:top.filter(x=>x.score===top[0]?.score), lowest:bottom.filter(x=>x.score===bottom[0]?.score),top,bottom,
    busiest:dates.filter(([,n])=>n===peak), months:dates,
    scores:Array.from({length:10},(_,i)=>({name:String(i+1),count:rated.filter(x=>x.score===i+1).length})),
    longest:rankTitles(lengths,x=>x.length),shortest:rankTitles(lengths,x=>x.length,false),lengthKnown:lengths.length,
    oldest:rankTitles(years,x=>x.releaseYear,false,1), newest:rankTitles(years,x=>x.releaseYear,true,1),yearKnown:years.length
  };
}
