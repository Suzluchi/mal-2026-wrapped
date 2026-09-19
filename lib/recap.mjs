import { dateYear } from './lists.mjs';
export function recap(items, period) {
  const completed = [...new Map(items.map(x => [x.id, x])).values()].filter(x => x.status === 'completed');
  const selected = completed.filter(x => period === 'all' || dateYear(x.finishDate) === period);
  const rated = selected.filter(x => Number.isInteger(x.score) && x.score >= 1 && x.score <= 10);
  const ordered = [...rated].sort((a,b) => b.score-a.score || a.title.localeCompare(b.title) || a.id-b.id);
  const cutoff = ordered[Math.min(4, ordered.length-1)]?.score;
  const months = new Map();
  for (const x of selected) if (dateYear(x.finishDate) !== null) {
    const key = x.finishDate.slice(0,7);
    months.set(key, (months.get(key) || 0)+1);
  }
  const peak = Math.max(0,...months.values());
  return { count:selected.length, rated:rated.length, average:rated.length ? rated.reduce((n,x)=>n+x.score,0)/rated.length : null,
    missingDates:completed.filter(x=>dateYear(x.finishDate)===null).length,
    highest:ordered.filter(x=>x.score===ordered[0]?.score),
    top:ordered.filter(x=>x.score>=cutoff),
    busiest:[...months].filter(([,n])=>n===peak).sort(([a],[b])=>a.localeCompare(b)),
  };
}
