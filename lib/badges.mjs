const decode=s=>s.replace(/&(?:amp|quot|apos|lt|gt|#039|#39);/g,x=>({'&amp;':'&','&quot;':'"','&apos;':"'",'&#039;':"'",'&#39;':"'",'&lt;':'<','&gt;':'>'})[x]);
export function parseBadges(html){
 if(!html.includes('boxlist-container badge'))return {status:'unknown',items:[]};
 const expected=html.match(/all-link[^>]*>All\s*\((\d+)\)/)?.[1];
 const items=[];
 for(const block of html.split(/<div class="boxlist col-3">/).slice(1)){
  const image=block.match(/data-src="(https:\/\/cdn\.myanimelist\.net\/images\/badge\/[^"?]+)"[^>]*alt="([^"]*)"/);
  if(!image)return {status:'unknown',items:[]};
  const date=block.match(/class="di-ib mt4 fn-grey2">\s*([^<]*)</)?.[1]?.trim()||'';
  const year=date.match(/\b(19\d{2}|20\d{2})\b/);
  items.push({id:image[1],cover:decode(image[1]),title:decode(image[2]),date,year:year?Number(year[1]):null});
 }
 if(expected!==undefined&&Number(expected)!==items.length)return {status:'unknown',items:[]};
 if(!items.length&&expected!=='0'&&!/no badges/i.test(html))return {status:'unknown',items:[]};
 return {status:'ok',items:[...new Map(items.map(x=>[x.id,x])).values()]};
}
export async function fetchBadges(name,fetcher=fetch){
 if(typeof name!=='string'||!/^[-\w]{1,32}$/.test(name))return {status:'unknown',items:[]};
 try{const r=await fetcher('https://myanimelist.net/profile/'+encodeURIComponent(name)+'/badges',{redirect:'error',cache:'no-store',signal:AbortSignal.timeout(10000)});if(!r.ok)return {status:'unknown',items:[]};const t=await r.text();if(t.length>2000000)return {status:'unknown',items:[]};return parseBadges(t);}catch{return {status:'unknown',items:[]};}
}
