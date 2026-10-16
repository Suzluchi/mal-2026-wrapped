import test from 'node:test';
import assert from 'node:assert/strict';
import {selectTaste} from '../lib/eligibility.mjs';
import {recap} from '../lib/recap.mjs';
import {insights} from '../lib/insights.mjs';
import {buildStory} from '../lib/story.mjs';
import {discover,graveyard} from '../lib/discoveries.mjs';
import {parseFavourites,fetchFavourites,characterScene} from '../lib/favourites.mjs';
import {normaliseMetadata} from '../lib/insights.mjs';
const asOf='2026-10-16';
const x=(id,extra={})=>({id,title:`Story ${id}`,format:'tv',status:'completed',score:8,releaseYear:2004,finishDate:'2026-03-01',startDate:'2026-01-01',repeatCount:0,genres:[{id:1,name:'Drama'}],creators:[{id:1,name:'Author A'}],...extra});
test('ongoing manga enters ratings and authors without becoming a completion',()=>{
 const items=[x(1,{score:6}),x(2,{status:'reading',score:10,finishDate:''}),x(3,{status:'reading',score:null,finishDate:''})];
 const r=recap(items,2026,asOf,'manga');assert.equal(r.count,1);assert.equal(r.rated,2);assert.equal(r.average,8);assert.equal(r.highest[0].id,2);
 assert.equal(insights(items,2026,asOf,'manga').creators.rows[0].count,3);
 const s=buildStory([],items,2026,asOf).slides;assert.equal(s.find(s=>s.id==='manga-highest').item.id,2);
 assert.ok(s.some(s=>s.id==='manga-character'));
});
test('reading-only manga gets taste cards but no invented completion or month',()=>{
 const s=buildStory([],[x(1,{status:'reading',finishDate:''})],2026,asOf).slides;
 assert.ok(s.some(x=>x.id==='manga-highest'));assert.ok(!s.some(x=>['manga-count','manga-month','empty'].includes(x.id)));
});
test('historical reading selection never relies on generic updates',()=>{
 const items=[x(1,{status:'reading',startDate:'2025-01-01',updatedAt:'2026-02-01'}),x(2,{status:'reading',startDate:''}),x(3,{status:'reading',startDate:'2027-01-01'}),x(4,{status:'reading'})];
 assert.deepEqual(selectTaste(items,'manga',2026,asOf).map(x=>x.id),[4]);assert.equal(selectTaste(items,'manga','all',asOf).length,4);
 assert.equal(selectTaste(items,'anime',2026,asOf).length,0);
});
test('era is median release year, sample threshold and copy vary',()=>{
 assert.equal(discover([x(1)],'anime',2026,asOf).era,undefined);
 const d=discover(Array.from({length:5},(_,i)=>x(i)),'anime',2026,asOf);assert.equal(d.era.year,2004);assert.equal(d.era.mode,'classic');
 assert.equal(discover(Array.from({length:5},(_,i)=>x(i,{releaseYear:2026})),'anime',2026,asOf).era.mode,'recent');
 assert.equal(discover(Array.from({length:5},(_,i)=>x(i)),'manga',2026,asOf).era,undefined);
});
test('community comparisons exclude missing values and distinguish agreement',()=>{
 const list=Array.from({length:5},(_,i)=>x(i,{communityScore:8}));assert.match(discover(list,'anime',2026,asOf).community.line,/agrees/);
 assert.match(discover(list.map(x=>({...x,score:4})),'anime',2026,asOf).community.line,/popular opinion/);
 assert.equal(discover(list.map(x=>({...x,communityScore:null})),'anime',2026,asOf).community,undefined);
});
test('plot twist requires established taste and hidden gem selects one personal high scorer',()=>{
 const list=Array.from({length:8},(_,i)=>x(i,{audience:i===7?1500:200000,genres:i===7?[{id:2,name:'Sports'}]:[{id:1,name:'Drama'}]}));
 const d=discover(list,'anime',2026,asOf);assert.equal(d.twist.item.id,7);assert.equal(d.gem.item.id,7);
 assert.equal(discover(list.map(x=>({...x,score:null})),'anime',2026,asOf).gem,undefined);
});
test('one graveyard caps each medium at five and never invents dates from updates',()=>{
 const items=Array.from({length:9},(_,i)=>x(i,{status:'dropped',updatedAt:'2026-01-01'}));
 const all=graveyard(items,items,'all',asOf);assert.equal(all[0].items.length,5);assert.equal(all[1].total,9);assert.equal(all[0].items[0].age,null);
 assert.equal(graveyard(items,[],2026,asOf)[0].total,0);
 const dated=graveyard([x(1,{status:'dropped',droppedAt:'2026-10-15'}),x(2,{status:'on_hold',droppedAt:'2026-10-14'})],[],2026,asOf)[0];assert.equal(dated.total,1);assert.equal(dated.items[0].age,1);
 assert.equal(buildStory(items,items,'all',asOf).slides.filter(x=>x.type==='graveyard').length,1);
});
test('favourites parser stays within character favourites, accepts only MAL artwork',async()=>{
 const a='<a href="/character/73935/Saitama"><span class="title fs10">Saitama</span><span class="users">One Punch Man</span><img data-src="https://cdn.myanimelist.net/r/140x220/images/characters/11/294388.jpg?s=abc"></a>';
 const html='<div id="character_favorites"><ul>'+a+'</ul></div><ul>'+a.replaceAll('Saitama','Other')+'</ul>';
 const r=parseFavourites(html);assert.equal(r.items.length,1);assert.equal(r.items[0].cover,'https://cdn.myanimelist.net/images/characters/11/294388.jpg');assert.equal(characterScene(r.items[0]),'city');
 assert.equal(parseFavourites(html.replaceAll('cdn.myanimelist.net','evil.example')).status,'unknown');
 assert.equal((await fetchFavourites('../bad',()=>{throw Error('must not fetch')})).status,'unknown');
});
test('community metadata normalizes unknown values without making zeros',()=>{
 const r=normaliseMetadata({mean:0,num_list_users:0},'anime');assert.equal(r.communityScore,null);assert.equal(r.audience,null);
 const ok=normaliseMetadata({mean:7.8,num_list_users:1000},'manga');assert.equal(ok.communityScore,7.8);assert.equal(ok.audience,1000);
});
