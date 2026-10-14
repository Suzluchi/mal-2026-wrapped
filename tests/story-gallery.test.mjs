import test from 'node:test';
import assert from 'node:assert/strict';
import {buildStory} from '../lib/story.mjs';
import {waitsForReader} from '../lib/story-playback.mjs';
const item=(id,extra={})=>({id,title:'Title '+id,status:'completed',format:'tv',score:0,finishDate:'2026-02-01',repeatCount:0,isRepeating:false,...extra});
const story=(a=[],m=[],b={status:'unknown'})=>buildStory(a,m,2026,'2026-10-01',b).slides;
test('one gallery retains every repeat and badge, including identical media IDs',()=>{
 const entries=Array.from({length:23},(_,i)=>item(i,{repeatCount:2}));
 const s=story(entries,entries,{status:'ok',items:entries.map(x=>({...x,year:2026}))});
 const r=s.filter(x=>x.type==='repeat-covers'),b=s.filter(x=>x.type==='badges');
 assert.equal(r.length,1);assert.equal(r[0].items.length,46);assert.equal(new Set(r[0].items.map(x=>x.galleryId)).size,46);assert.equal(b.length,1);assert.equal(b[0].items.length,23);
});
test('zero repeats and missing repeat fields are different states',()=>{
 const zero=story([item(1)]).find(x=>x.type==='repeat-covers');assert.match(zero.quip,/No recorded/);
 const unknown=story([item(1,{repeatCount:null})]).find(x=>x.type==='repeat-covers');assert.match(unknown.quip,/enough repeat details/);
});
test('empty, anime-only, manga-only and unrated accounts contain no invented rankings',()=>{
 assert.ok(story().some(x=>x.id==='empty'));assert.ok(story().length<=3);
 for(const [a,m,absent] of [[[item(1)],[],'manga'],[[],[item(2)],'anime']]){
  const s=story(a,m);assert.ok(!s.some(x=>x.kind===absent));assert.ok(!s.some(x=>['number','ranking'].includes(x.type)||x.id.endsWith('-highest')));
 }
});
test('undated completions offer all time; active lists remain visible',()=>{
 const s=story([item(1,{finishDate:null}),item(2,{status:'watching',finishDate:null})]);
 assert.ok(s.find(x=>x.id==='empty').offerAllTime);assert.ok(s.some(x=>x.id==='anime-current'));
 assert.equal(buildStory([item(1,{finishDate:null})],[],'all','2026-10-01').data.anime.count,1);
});
test('only galleries, looping cover cards, empty guidance and keepsake wait for the reader',()=>{
 for(const type of ['montage','repeat-covers','badges','closing','empty'])assert.ok(waitsForReader({type}));
 assert.ok(waitsForReader({type:'count',items:[item(1)]}));
 for(const type of ['opening','question','spotlight','ranking','month','categories','number','energy'])assert.ok(!waitsForReader({type}));
});
