import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchListPage, summarise } from '../lib/lists.mjs';
import { recap, repeatContext } from '../lib/recap.mjs';
import { insights, coverURL } from '../lib/insights.mjs';
import { buildStory } from '../lib/story.mjs';
const asOf='2026-09-19';
const item=(id,extra={})=>({id,title:`Title ${id}`,status:'completed',score:8,finishDate:'2026-01-01',...extra});
test('repeat fields distinguish missing counts, zero, and active flags for both media',async()=>{
 for(const kind of ['anime','manga']){
  const count=kind==='anime'?'num_times_rewatched':'num_times_reread', flag=kind==='anime'?'is_rewatching':'is_rereading';
  const result=await fetchListPage('test',kind,0,async address=>{
   const fields=new URL(address).searchParams.get('fields');assert.ok(fields.includes(count));assert.ok(fields.includes(flag));
   return Response.json({data:[0,3,null,-1,2.5].map((n,i)=>({node:{id:i+1,title:'Test',num_episodes:12,num_chapters:40},list_status:{status:'watching',[count]:n,[flag]:i===1}}))});
  });
  assert.deepEqual(result.items.map(x=>x.repeatCount),[0,3,null,null,null]);assert.equal(result.items[1].isRepeating,true);assert.equal(result.items[0].length,kind==='anime'?12:40);
 }
});
test('active repeats belong to all-time completed collection but never guessed annual activity',()=>{
 const entries=[item(1,{status:'watching',isRepeating:true,repeatCount:2}),item(2,{repeatCount:1})];
 for(const period of ['all',2026]){
  const r=recap(entries,period,asOf);assert.equal(r.count,period==='all'?2:1);assert.equal(r.count,insights(entries,period,asOf).count);assert.equal(r.count,summarise(entries,period,asOf).finished.length);
  assert.equal(r.repeats.count,3);assert.equal(r.repeats.active.length,1);assert.equal(r.issues.activeRepeat,1);
 }
 assert.equal(recap(entries,'all',asOf).busiest[0][1],1);
});
test('repeat context is lifetime, deduplicated, and does not add active passes to recorded counts',()=>{
 const x=item(1,{isRepeating:true,repeatCount:3});const r=repeatContext([x,x,item(2)]);
 assert.equal(r.count,3);assert.equal(r.known,1);assert.equal(r.unknown,1);assert.equal(r.activeKnown,1);assert.equal(r.active.length,1);
});
test('story suppresses unsupported chapters but always explains repeats and coverage',()=>{
 const empty=buildStory([],[],2026,asOf);assert.equal(empty.slides.length,3);assert.ok(!empty.slides.some(x=>x.type==='reveal'));
 assert.deepEqual(empty.slides.map(x=>x.id),['opening','empty','closing']);
 const data=buildStory([item(1,{length:12,releaseYear:2000,genres:[{id:1,name:'Drama'}]}),item(2,{score:4,length:24,releaseYear:2010})],[],2026,asOf);
 assert.ok(data.slides.some(x=>x.id==='anime-highest'));assert.ok(data.slides.some(x=>x.id==='anime-bottom'));assert.ok(data.slides.some(x=>x.id==='anime-genres'));assert.ok(data.slides.some(x=>x.id==='anime-longest'));assert.ok(!data.slides.some(x=>x.id==='manga-highest'));
 assert.equal(new Set(data.slides.map(x=>x.id)).size,data.slides.length);
});
test('catalog length and year rankings keep ties and omit unknown lengths',()=>{
 const r=recap([item(1,{length:12,releaseYear:1990}),item(2,{length:12,releaseYear:1990}),item(3,{length:null})],2026,asOf);
 assert.equal(r.longest.length,2);assert.equal(r.oldest.length,2);assert.equal(r.lengthKnown,2);
});
test('covers allow only HTTPS MAL CDN resources',()=>{
 assert.equal(coverURL('https://cdn.myanimelist.net/images/anime/test.jpg'),'https://cdn.myanimelist.net/images/anime/test.jpg');
 for(const url of ['http://cdn.myanimelist.net/a','https://evil.example/a','javascript:alert(1)','https://user:secret@cdn.myanimelist.net/a']) assert.equal(coverURL(url),null);
});

test('flashcard story caps rankings at five and categories at three, even with equal scores',()=>{
 const entries=Array.from({length:12},(_,id)=>item(id,{genres:[{id,name:`Genre ${id}`}],studios:[{id,name:`Studio ${id}`}]}));
 const result=buildStory(entries,[],2026,asOf);
 assert.equal(result.slides.find(x=>x.id==='anime-top').items.length,5);
 assert.equal(result.slides.find(x=>x.id==='anime-genres').rows.length,3);
 assert.equal(result.slides.find(x=>x.id==='anime-credits').rows.length,3);
 assert.equal(result.slides.find(x=>x.id==='anime-highest').item.id,0);
 assert.ok(!result.slides.some(x=>['context','formats','sources','years'].includes(x.type)));
 const q=result.slides.findIndex(x=>x.id==='anime-question');assert.equal(result.slides[q+1].id,'anime-highest');
});

test('repeat covers retain lifetime records while count covers respect the selected year',()=>{
 const entries=[item(1,{finishDate:'2025-01-01',repeatCount:3,cover:'https://cdn.myanimelist.net/a.jpg'}),item(2,{repeatCount:0}),item(3,{isRepeating:true,repeatCount:null})];
 const story=buildStory(entries,[],2026,asOf);
 assert.deepEqual(story.slides.find(x=>x.id==='anime-count').items.map(x=>x.id),[2]);
 assert.deepEqual(story.slides.find(x=>x.id==='anime-repeat-covers').items.map(x=>x.id),[1,3]);
 assert.ok(!story.slides.some(x=>x.id==='manga-repeat-covers'));
});
