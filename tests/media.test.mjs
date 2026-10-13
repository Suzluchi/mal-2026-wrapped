import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {imageSource} from '../lib/image-source.mjs';
import {musicTracks,musicMix} from '../lib/music.mjs';
test('signed new MAL avatars and legacy artwork are accepted without widening hosts',()=>{
 const signed='https://cdn.myanimelist.net/s/common/userimages/example_225w?s=signature';
 assert.equal(imageSource(signed),signed);
 assert.ok(imageSource('https://cdn.myanimelist.net/images/anime/1/23.jpg'));
 for(const bad of ['https://example.com/s/common/userimages/a','http://cdn.myanimelist.net/images/anime/a','https://cdn.myanimelist.net/private/a','https://x@cdn.myanimelist.net/images/anime/a','https://cdn.myanimelist.net/s/common/userimages/../../secret'])assert.equal(imageSource(bad),null);
});
test('the supplied six-song mix has continuous crossfade positions and no Kaiju',()=>{
 assert.equal(musicTracks.length,6);
 assert.ok(!musicTracks.some(t=>t.id==='kaiju'||t.id==='lilac'));
 for(let i=1;i<musicTracks.length;i++)assert.equal(musicTracks[i].start,musicTracks[i-1].start+musicTracks[i-1].duration-musicMix.crossfade);
 assert.equal(musicMix.duration,musicTracks.at(-1).start+musicTracks.at(-1).duration);
});
test('every enabled song is present, and Nemure leads with a 30 second opening',()=>{
 assert.equal(musicTracks[0].id,'nemure');assert.equal(musicTracks[0].start,0);assert.equal(musicTracks[0].duration,30);
 for(const track of musicTracks.filter(t=>t.enabled))assert.ok(fs.statSync(new URL('../public'+track.src,import.meta.url)).size>1000);
});
