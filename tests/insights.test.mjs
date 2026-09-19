import test from 'node:test';
import assert from 'node:assert/strict';
import {normaliseMetadata,releaseYear,insights} from '../lib/insights.mjs';
import {fetchListPage} from '../lib/lists.mjs';
const genre={id:1,name:'Drama'};
const item=(id,extra={})=>({id,status:'completed',finishDate:'2026-02-01',score:8,genres:[genre],...extra});
test('metadata requests use list fields, with distinct anime and manga fields',async()=>{
 for(const kind of ['anime','manga']){
 const result=await fetchListPage('test',kind,0,async url=>{
  const fields=new URL(url).searchParams.get('fields');assert.ok(fields.includes('genres,start_date,media_type'));assert.ok(fields.includes(kind==='anime'?'studios,source':'authors{first_name,last_name}'));
  return Response.json({data:[{node:{id:1,title:'Example',genres:[genre],start_date:'1998',media_type:'novel',authors:[{node:{id:2,first_name:'Test',last_name:'Creator'},role:'Story'}]},list_status:{status:'completed'}}]});
 });assert.equal(result.items[0].releaseYear,1998);assert.equal(result.items[0].genres[0].name,'Drama');if(kind==='manga')assert.equal(result.items[0].creators[0].name,'Test Creator');
 }
});
test('metadata deduplicates IDs and rejects malformed optional data',()=>{
 const data=normaliseMetadata({genres:[genre,genre,{id:2,name:''},null],authors:[null],media_type:'unknown',start_date:'2026-02-30'},'manga');
 assert.deepEqual(data.genres,[genre]);assert.deepEqual(data.creators,[]);assert.equal(data.format,null);assert.equal(data.releaseYear,null);
});
test('release date precision is separate from personal finish date precision',()=>{
 assert.equal(releaseYear('1999'),1999);assert.equal(releaseYear('1999-02'),1999);assert.equal(releaseYear('2024-02-29'),2024);
 for(const date of ['2025-02-29','2026-13','2026-00-01','bad','2026-02-00'])assert.equal(releaseYear(date),null);
 assert.equal(insights([item(1,{finishDate:'2026'})],2026).count,0);
});
test('breakdowns use eligible unique titles, overlap categories and exclude unrated scores',()=>{
 const entries=[item(1,{genres:[genre,genre,{id:2,name:'Fantasy'}]}),item(2,{score:null}),item(3,{status:'watching'}),item(4,{finishDate:'2025-01-01'}),item(5,{genres:[]})];
 const s=insights([...entries,entries[0]],2026);assert.equal(s.count,3);assert.equal(s.genres.covered,2);assert.equal(s.genres.missing,1);assert.equal(s.genres.rows[0].count,2);assert.equal(s.genres.rows[0].average,8);assert.equal(s.genres.rows[0].rated,1);
});
test('all time includes undated titles; missing data never becomes an invented category',()=>{
 const s=insights([item(1,{finishDate:'',genres:[]})],'all');assert.equal(s.count,1);assert.deepEqual(s.years.rows,[]);assert.equal(s.years.missing,1);
 assert.equal(insights([],2026).count,0);
});
test('collaborating creators count once per title and year is release year',()=>{
 const meta=normaliseMetadata({authors:[{node:{id:1,first_name:'A'},role:'Story'},{node:{id:1,first_name:'A'},role:'Art'},{node:{id:2,last_name:'B'},role:'Art'}],start_date:'1990'},'manga');
 const s=insights([item(1,meta)],2026);assert.equal(s.creators.rows.length,2);assert.equal(s.creators.rows[0].count,1);assert.equal(s.years.rows[0].name,'1990');
});
