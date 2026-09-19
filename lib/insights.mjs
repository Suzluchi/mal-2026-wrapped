const text = value => typeof value === 'string' ? value.trim() : '';
function named(values) {
  return Array.isArray(values) ? [...new Map(values.filter(x => Number.isSafeInteger(x?.id) && x.id > 0 && text(x.name)).map(x => [x.id, {id:x.id,name:text(x.name)}])).values()] : [];
}
// Release dates can have year-only precision; this does not change personal finish-date eligibility.
export function releaseYear(value) {
  if (typeof value !== 'string' || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(value)) return null;
  const [y,m,d] = value.split('-').map(Number);
  if (y < 1000 || y > 2999 || (m !== undefined && (m<1 || m>12))) return null;
  if (d !== undefined && (d<1 || d>new Date(Date.UTC(y,m,0)).getUTCDate())) return null;
  return y;
}
export function normaliseMetadata(node, kind) {
  return { genres:named(node.genres), studios:kind==='anime'?named(node.studios):[],
    creators:kind==='manga' && Array.isArray(node.authors) ? named(node.authors.map(x=>({id:x?.node?.id,name:[text(x?.node?.first_name),text(x?.node?.last_name)].filter(Boolean).join(' ')}))) : [],
    releaseYear:releaseYear(node.start_date),
    format:text(node.media_type) && node.media_type!=='unknown'?text(node.media_type):null,
    source:kind==='anime' && text(node.source) && node.source!=='unknown'?text(node.source):null };
}
function breakdown(items, values) {
  const groups = new Map(); let covered = 0;
  for (const item of items) {
    const labels = new Map(values(item).map(x=>[x.id,x.name]));
    if(labels.size) covered++;
    for(const [id,name] of labels) {
      const group=groups.get(id) || {id,name,count:0,rated:0,totalScore:0};
      group.count++;
      if(Number.isInteger(item.score) && item.score>=1 && item.score<=10) { group.rated++;group.totalScore+=item.score; }
      groups.set(id,group);
    }
  }
  return {covered,missing:items.length-covered,rows:[...groups.values()].map(({totalScore,...g})=>({...g,average:g.rated?totalScore/g.rated:null})).sort((a,b)=>b.count-a.count || a.name.localeCompare(b.name))};
}
export function insights(items, period) {
  // Imported entries already carry validated personal dates; use the same strict calendar check as recap.
  const eligible = [...new Map(items.map(x=>[x.id,x])).values()].filter(x=>x.status==='completed' && (period==='all' || (typeof x.finishDate==='string' && /^\d{4}-\d{2}-\d{2}$/.test(x.finishDate) && releaseYear(x.finishDate)===period)));
  const scalar = key => x => x[key] == null ? [] : [{id:String(x[key]),name:String(x[key]).replaceAll('_',' ')}];
  return {count:eligible.length, genres:breakdown(eligible,x=>x.genres||[]),studios:breakdown(eligible,x=>x.studios||[]),creators:breakdown(eligible,x=>x.creators||[]),formats:breakdown(eligible,scalar('format')),sources:breakdown(eligible,scalar('source')),years:breakdown(eligible,scalar('releaseYear'))};
}
