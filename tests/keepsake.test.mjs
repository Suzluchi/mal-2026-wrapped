import test from 'node:test';
import assert from 'node:assert/strict';
import {timeEstimate,chooseCharacter,backgrounds} from '../lib/keepsake.mjs';
const item=(id,extra={})=>({id,status:'completed',length:12,episodeSeconds:1440,startDate:'2026-01-01',finishDate:'2026-02-01',...extra});
test('time estimates respect selected completions and never substitute chapter pace for anime runtime',()=>{
 const items=[item(1),item(2,{finishDate:'2025-02-01',startDate:'2025-01-01'}),item(3,{status:'reading'}),item(4,{episodeSeconds:null})];
 assert.deepEqual(timeEstimate(items,'anime',2026,'2026-10-16'),{hours:5,known:1,total:2,partial:true});
 assert.equal(timeEstimate(items,'manga',2026,'2026-10-16').hours,2);
 assert.equal(timeEstimate([item(1,{length:null})],'manga','all','2026-10-16').hours,null);
 assert.equal(timeEstimate([],'anime','all','2026-10-16').hours,0);
});
test('art is selected only from actual favourites and every supplied background remains available',()=>{
 assert.equal(chooseCharacter([]),null);
 assert.equal(chooseCharacter([{id:1,name:'Someone else',cover:'/test.jpg'}]).cutout,false);
 assert.equal(chooseCharacter([{id:1,cover:'/test.jpg'},{id:73935,name:'Saitama'}]).id,73935);
 assert.equal(backgrounds.length,5);
 assert.ok(backgrounds.some(b=>b.id==='orange-sky'));
});
