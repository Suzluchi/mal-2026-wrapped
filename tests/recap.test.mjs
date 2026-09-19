import test from 'node:test';
import assert from 'node:assert/strict';
import { recap } from '../lib/recap.mjs';
const entry=(id,score,finishDate='2026-02-01',status='completed')=>({id,title:`Title ${id}`,score,finishDate,status});
test('annual recap excludes incomplete dates and noncompleted entries; all time includes undated',()=>{
 const items=[entry(1,10),entry(2,null,''),entry(3,8,'2025-02-01'),entry(4,9,'2026-02-01','watching'),entry(5,5,'2026-02-30')];
 assert.equal(recap(items,2026).count,1);assert.equal(recap(items,'all').count,4);assert.equal(recap(items,2026).missingDates,2);
});
test('ratings exclude unrated entries and retain ties across fifth place',()=>{
 const r=recap([10,10,9,8,7,7,null].map((score,i)=>entry(i,score)),2026);
 assert.equal(r.highest.length,2);assert.equal(r.top.length,6);assert.equal(r.rated,6);assert.equal(r.average,51/6);
});
test('months preserve ties and all time separates years; IDs deduplicate',()=>{
 const r=recap([entry(1,5),entry(1,5),entry(2,6,'2025-02-01')],'all');
 assert.equal(r.count,2);assert.deepEqual(r.busiest,[['2025-02',1],['2026-02',1]]);
});
test('empty recap has no invented scores or winning month',()=>{
 const r=recap([],2026);assert.equal(r.average,null);assert.deepEqual(r.top,[]);assert.deepEqual(r.busiest,[]);
});
