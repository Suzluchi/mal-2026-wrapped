import test from 'node:test';
import assert from 'node:assert/strict';
import { tasteAwards,officialBadgeState } from '../lib/awards.mjs';
import { buildStory } from '../lib/story.mjs';
const item=(id,genre='Adventure')=>({id,title:'A',status:'completed',score:9,finishDate:'2026-01-01',genres:[{id:1,name:genre}]});
test('unknown official badges never become zero badges',()=>{assert.equal(officialBadgeState(undefined),'unknown');assert.equal(officialBadgeState(null),'unknown');assert.equal(officialBadgeState([]),'zero');assert.equal(officialBadgeState([{id:1}]),'earned');});
test('awards use eligible genre counts and only manga readers get a manga match',()=>{const a=tasteAwards([item(1),item(2)],[],2026,'2026-09-20');assert.equal(a.length,1);assert.equal(a[0].count,2);assert.equal(a[0].kind,'anime');assert.equal(a[0].character.name,'Monkey D. Luffy');assert.equal(tasteAwards([item(1)],[],2025,'2026-09-20').length,0);const story=buildStory([item(1)],[item(2)],2026,'2026-09-20');assert.deepEqual(story.slides.slice(-4).map(x=>x.id),['awards','anime-character','manga-character','closing']);assert.ok(!JSON.stringify(story).includes('Night Binger'));});
test('unsupported genres retain factual award without inventing a character match',()=>{const a=tasteAwards([item(1,'Unmapped genre')],[],2026,'2026-09-20');assert.equal(a[0].character,null);});
