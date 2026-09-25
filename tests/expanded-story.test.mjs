import test from 'node:test';
import assert from 'node:assert/strict';
import {buildStory,activity,montage} from '../lib/story.mjs';
import {parseBadges,fetchBadges} from '../lib/badges.mjs';
const day='2026-09-20',item=(id,extra={})=>({id,title:`Story ${id}`,format:'tv',status:'completed',score:10,startDate:'2026-01-01',finishDate:'2026-03-01',...extra});
test('TV reveal preserves every highest scorer while specials never win',()=>{
 const items=[item(99,{format:'special'}),...Array.from({length:12},(_,i)=>item(i))];
 const story=buildStory(items,[],2026,day);
 const reveals=story.slides.filter(x=>x.id.startsWith('anime-highest'));
 assert.equal(reveals.flatMap(x=>x.items).length,12);assert.ok(reveals.every(x=>x.shared));assert.ok(story.data.anime.tv.top.every(x=>x.format==='tv'));assert.equal(story.data.anime.count,13);
 assert.equal(story.slides.find(x=>x.id==='anime-count').items.length,13);
 assert.deepEqual(montage(items).map(x=>x.id),montage(items.map(x=>({...x,score:1}))).map(x=>x.id));
});
test('started dates and present statuses are separate from completed counts',()=>{
 const entries=[item(1),item(2,{status:'watching',startDate:'2025-01-01',finishDate:null}),item(3,{status:'plan_to_watch',startDate:null,finishDate:null}),item(4,{startDate:'2026-02-30'}),item(5,{startDate:'2027-01-01'}),item(6,{isRepeating:true})];
 const a=activity(entries,'anime',2026,day);assert.deepEqual(a.started.map(x=>x.id),[1]);assert.deepEqual(a.current.map(x=>x.id),[2]);assert.deepEqual(a.planned.map(x=>x.id),[3]);
});
test('all repeat titles remain reachable across cards',()=>{
 const s=buildStory(Array.from({length:13},(_,i)=>item(i,{repeatCount:2})),[],2026,day);
 assert.equal(s.slides.filter(x=>x.type==='repeat-covers').flatMap(x=>x.items).length,13);
});
const html='<div class="all-link">All (1)</div><div class="boxlist-container badge"><div class="boxlist col-3"><img data-src="https://cdn.myanimelist.net/images/badge/a.png" alt="A &amp; B"><div class="di-ib mt4 fn-grey2">Jul 2026</div>';
test('badge parsing preserves year and never treats errors as zero',async()=>{
 const b=parseBadges(html);assert.equal(b.status,'ok');assert.equal(b.items[0].year,2026);assert.equal(b.items[0].title,'A & B');
 assert.equal(parseBadges(html.replace('All (1)','All (2)')).status,'unknown');assert.equal(parseBadges('blocked').status,'unknown');
 assert.equal((await fetchBadges('name',async()=>new Response('',{status:403}))).status,'unknown');
 assert.equal(buildStory([],[],2026,day,b).slides.find(x=>x.type==='badges').total,1);
 assert.ok(!buildStory([],[],2026,day,{status:'unknown',items:[]}).slides.some(x=>x.type==='badges'));
});
