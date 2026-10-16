import {imageSource} from './image-source.mjs';
const decode=s=>s.replace(/&(?:amp|quot|apos|#039|#39|lt|gt);/g,x=>({'&amp;':'&','&quot;':'"','&apos;':"'",'&#039;':"'",'&#39;':"'",'&lt;':'<','&gt;':'>'})[x]);
export function parseFavourites(html){
 const block=html.match(/id=["']character_favorites["'][\s\S]*?<\/ul>/)?.[0];
 if(!block)return {status:'unknown',items:[]};
 const items=[];
 for(const match of block.matchAll(/<a\b[^>]*href=["'](?:https:\/\/myanimelist\.net)?\/character\/(\d+)\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/g)){
  const inner=match[2],name=inner.match(/class="title[^"\n]*">([^<]*)</)?.[1],image=inner.match(/data-src="([^"]+)"/)?.[1];
  if(!name||!image)continue;
  const cover=imageSource(decode(image).replace(/\/r\/\d+x\d+\//,'/').split('?')[0]);
  if(cover)items.push({id:Number(match[1]),name:decode(name),cover,series:decode(inner.match(/class="users">([^<]*)</)?.[1]||'')});
 }
 return {status:items.length?'ok':'unknown',items:[...new Map(items.map(x=>[x.id,x])).values()]};
}
export async function fetchFavourites(name,fetcher=fetch){
 if(typeof name!=='string'||!/^[-\w]{1,32}$/.test(name))return {status:'unknown',items:[]};
 try{const r=await fetcher('https://myanimelist.net/profile/'+encodeURIComponent(name),{redirect:'error',cache:'no-store',signal:AbortSignal.timeout(10000)});if(!r.ok)return {status:'unknown',items:[]};const html=await r.text();return html.length<=2000000?{...parseFavourites(html),days:parseProfileDays(html)}:{status:'unknown',items:[]};}catch{return {status:'unknown',items:[]};}
}
// These are MAL's lifetime profile aggregates, never a history for a selected year.
export function parseProfileDays(html){
 return Object.fromEntries(['anime','manga'].map(kind=>{
  const section=html.split(new RegExp('class=["\']stats '+kind+'["\']'))[1]?.split(/class=["']stats /)[0];
  const match=section?.match(/Days:\s*<\/span>\s*([\d,]+(?:\.\d+)?)\s*</);
  const value=match?Number(match[1].replaceAll(',','')):null;
  return [kind,Number.isFinite(value)&&value>=0?value:null];
 }));
}
export function characterScene(character){
 const name=character?.name||'';
 return /Luffy|Nami|Zoro|Sanji/i.test(name)?'ocean':/Frieren|Guts|Sett|Levi/i.test(name)?'mountains':/Saitama|Light|Yato|Gintoki|Tokuchi/i.test(name)?'city':'abstract';
}
