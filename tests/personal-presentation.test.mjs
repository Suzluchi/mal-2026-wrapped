import test from 'node:test';import assert from 'node:assert/strict';
import {personalRanking} from '../lib/personal-ranking.mjs';import {buildStory} from '../lib/story.mjs';import {storyEnergy} from '../lib/energy.mjs';import {reactionFor} from '../lib/reactions.mjs';import {fetchListPage} from '../lib/lists.mjs';
import {questionBeats} from '../lib/presentation.mjs';
const item=(id,extra={})=>({id,title:'Title '+id,format:'tv',status:'completed',score:10,finishDate:'2026-02-01',genres:[{id:1,name:'Action'}],...extra});
test('personal signals break ties without promoting a lower score',()=>{
 const ranked=personalRanking([item(1),item(2,{repeatCount:3}),item(3,{score:9,repeatCount:100})]);assert.equal(ranked[0].id,2);assert.equal(ranked.at(-1).id,3);
 assert.equal(personalRanking([item(1,{repeatValue:2}),item(2,{repeatValue:5})])[0].id,2);
 assert.equal(personalRanking([item(3),item(1)])[0].id,1);
});
test('list import preserves repeat value and requests its official fields',async()=>{
 for(const kind of ['anime','manga']){let requested;const key=kind==='anime'?'rewatch_value':'reread_value';const r=await fetchListPage('test',kind,0,async url=>{requested=url;return Response.json({data:[{node:{id:1,title:'A'},list_status:{status:'completed',score:10,[key]:4}}],paging:{}});});assert.equal(r.items[0].repeatValue,4);assert.ok(decodeURIComponent(requested).includes(key));}
});
test('completed intro leads into a full montage for both media; GIFs do not repeat',()=>{
 const story=buildStory([item(1)],[item(2)],2026,'2026-10-01');
 for(const k of ['anime','manga']){const i=story.slides.findIndex(s=>s.id===k+'-count');assert.equal(story.slides[i].type,'completed-intro');assert.equal(story.slides[i+1].type,'montage');assert.equal(story.slides.filter(s=>s.id===k+'-highest').length,1);}
 const gifs=story.slides.map(reactionFor).filter(Boolean);assert.equal(new Set(gifs).size,gifs.length);
});
test('badge copy distinguishes none, earned, and more than ten',()=>{
 const badges=n=>({status:'ok',items:Array.from({length:n},(_,id)=>({id,year:2026,title:'Badge'}))});
 assert.equal(buildStory([],[],2026,'2026-10-01',badges(0)).slides.find(s=>s.type==='badges').id,'badges-empty');
 assert.equal(buildStory([],[],2026,'2026-10-01',badges(5)).slides.find(s=>s.type==='badges').title,'PROOF YOU SHOWED UP.');
 assert.equal(buildStory([],[],2026,'2026-10-01',badges(11)).slides.find(s=>s.type==='badges').title,'YOU’RE AN EVENT OG.');
});
test('energy can differ for people with the same leading genre',()=>{
 const critic=[1,2,3].map(id=>item(id,{score:4})),fan=[1,2,3].map(id=>item(id));
 assert.notEqual(storyEnergy(critic,'anime',2026,'2026-10-01').title,storyEnergy(fan,'anime',2026,'2026-10-01').title);
});
test('question cards pause two seconds after their opener, then one second per line',()=>{
 for(const slide of buildStory([item(1,{length:52})],[item(2,{length:120})],2026,'2026-10-01').slides.filter(s=>s.type==='question')){
  const beats=questionBeats(slide);assert.equal(beats[0].seconds,0);assert.equal(beats[1].seconds,2);for(let i=2;i<beats.length;i++)assert.equal(beats[i].seconds-beats[i-1].seconds,1);
 }
});
