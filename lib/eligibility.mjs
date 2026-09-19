export function dateYear(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + 'T00:00:00.000Z');
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== value) return null;
  return Number(value.slice(0,4));
}
export const todayUTC = () => new Date().toISOString().slice(0,10);
export function completionIssue(item, asOf = todayUTC()) {
  if (dateYear(item.finishDate) === null) return 'undated';
  if (item.finishDate > asOf) return 'future';
  if (dateYear(item.startDate) !== null && item.startDate > item.finishDate) return 'reversed';
  return null;
}
export function selectCompletions(items, period, asOf = todayUTC()) {
  if (dateYear(asOf) === null) throw new Error('Invalid snapshot date');
  const entries = [...new Map(items.map(item=>[item.id,item])).values()];
  const completed = entries.filter(item=>item.status==='completed');
  const issues = {undated:0,future:0,reversed:0};
  const dated = completed.filter(item=>{
    const issue=completionIssue(item,asOf);
    if(issue) issues[issue]++;
    return !issue;
  });
  return {entries,completed,dated,issues,selected:period==='all'?completed:dated.filter(item=>dateYear(item.finishDate)===period)};
}
