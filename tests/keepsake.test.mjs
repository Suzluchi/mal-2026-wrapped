import test from 'node:test';
import assert from 'node:assert/strict';
import {timeEstimate,chooseCharacter,backgrounds,displayDays} from '../lib/keepsake.mjs';
import {parseProfileDays} from '../lib/favourites.mjs';
const item=(id,extra={})=>({id,status:'completed',length:12,episodeSeconds:1440,startDate:'2026-01-01',finishDate:'2026-02-01',...extra});
test('profile days stay within each medium and never become annual activity',()=>{
 const html='<div class="stats anime"><span>Days: </span>120.1</div><div class="stats manga"><span>Days: </span>84.9</div>';
 assert.deepEqual(parseProfileDays(html),{anime:120.1,manga:84.9});
 assert.deepEqual(parseProfileDays('<div class="stats anime">Hidden</div><div class="stats manga"><span>Days: </span>0</div>'),{anime:null,manga:0});
 assert.deepEqual(displayDays({days:2,partial:true},120.1,2026),{value:2,label:'ESTIMATED · PARTIAL'});
 assert.deepEqual(displayDays({days:2},120.1,'all'),{value:120.1,label:'MAL · ALL TIME'});
 assert.deepEqual(displayDays({days:2},null,'all'),{value:2,label:'ESTIMATED'});
});
test('time estimates respect selected completions and never substitute chapter pace for anime runtime',()=>{
 const items=[item(1),item(2,{finishDate:'2025-02-01',startDate:'2025-01-01'}),item(3,{status:'reading'}),item(4,{episodeSeconds:null})];
 assert.deepEqual(timeEstimate(items,'anime',2026,'2026-10-16'),{days:0.2,hours:5,known:1,total:2,partial:true});
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
