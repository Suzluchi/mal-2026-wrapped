import test from 'node:test';
import assert from 'node:assert/strict';
import {selectCompletions,completionIssue} from '../lib/eligibility.mjs';
import {recap} from '../lib/recap.mjs';
import {insights} from '../lib/insights.mjs';
import {summarise} from '../lib/lists.mjs';
const asOf='2026-09-19';
const entry=(id,finishDate,extra={})=>({id,title:`Title ${id}`,status:'completed',score:8,finishDate,...extra});
const items=[entry(1,'2026-09-19'),entry(2,'2026-09-20'),entry(3,'2026-02-30'),entry(4,'2026-04'),entry(5,''),entry(6,'2026-01-01',{startDate:'2026-02-01'}),entry(7,'2025-12-31'),entry(8,'2026-01-01',{status:'watching'}),entry(9,'2026-03-01',{startDate:'2026'}),entry(10,'2024-02-29')];
test('all surfaces share completion eligibility for every period',()=>{
 for(const period of [2024,2025,2026,'all']) {
 const r=recap(items,period,asOf),i=insights(items,period,asOf),s=summarise(items,period,asOf);
 assert.equal(r.count,i.count);assert.equal(r.count,s.finished.length);
 }
 assert.equal(recap(items,2026,asOf).count,2);
 assert.deepEqual(selectCompletions(items,2026,asOf).issues,{undated:3,future:1,reversed:1});
});
test('all time retains completed statuses but excludes unreliable dates from months',()=>{
 const r=recap(items,'all',asOf);assert.equal(r.count,9);assert.equal(r.busiest.length,4);
 assert.ok(!r.busiest.some(([month])=>month==='2026-01'));
});
test('snapshot includes today and excludes tomorrow independently of wall clock',()=>{
 assert.equal(completionIssue(entry(1,asOf),asOf),null);
 assert.equal(completionIssue(entry(1,'2026-09-20'),asOf),'future');
 assert.equal(recap([entry(1,'2026-09-20')],2026,'2026-09-20').count,1);
 assert.throws(()=>selectCompletions([],2026,'bad'));
});
test('ties at fifth place stay included and invalid scores cannot alter averages',()=>{
 const scores=[10,9,8,7,6,6,0,null,11,2.5];
 const r=recap(scores.map((score,id)=>entry(id,'2026-01-01',{score})),2026,asOf);
 assert.equal(r.top.length,6);assert.equal(r.rated,6);assert.equal(r.average,46/6);
});
test('duplicates never inflate totals and partial starts do not invent chronology',()=>{
 const a=entry(1,'2026-01-01',{startDate:'2026-01'});
 assert.equal(recap([a,a],2026,asOf).count,1);
 assert.equal(summarise([entry(2,'',{startDate:'2026-10-01'})],2026,asOf).started,0);
});
