import { insights } from './insights.mjs';
// Editorial matches, not claims about the viewer's personality or viewing hours.
const themes={
 Adventure:['The Adventurous','Monkey D. Luffy','One Piece','Always room for one more adventure.'],
 Mystery:['The Clue Collector','Conan Edogawa','Detective Conan','No loose end gets left behind.'],
 Sports:['The Underdog Supporter','Shoyo Hinata','Haikyu!!','You keep showing up for the next comeback.'],
 Fantasy:['The World Wanderer','Frieren','Frieren: Beyond Journey’s End','The journey is half the story.'],
 Action:['The Action Seeker','Naruto Uzumaki','Naruto','You came for the next big moment.'],
 Comedy:['The Comic Relief','Saiki Kusuo','The Disastrous Life of Saiki K.','A little chaos goes a long way.'],
 Drama:['The Feeling Collector','Rei Kiriyama','March Comes in Like a Lion','You make room for stories that linger.'],
 Romance:['The Slow-Burn Supporter','Tohru Honda','Fruits Basket','You stay for the connections.'],
 'Sci-Fi':['The What-If Explorer','Senku Ishigami','Dr. Stone','There is always another possibility.'],
};
export function tasteAwards(anime,manga,period,asOf){
 return [['anime',anime],['manga',manga]].flatMap(([kind,items])=>{
  const stats=insights(items,period,asOf),top=stats.genres.rows[0];
  if(!top)return [];
  const theme=themes[top.name];
  return [{kind,title:theme?`${theme[0]} ${kind==='anime'?'Watcher':'Reader'}`:`The ${top.name} ${kind==='anime'?'Watcher':'Reader'}`,genre:top.name,count:top.count,character:theme?{name:theme[1],series:theme[2],line:theme[3]}:null}];
 });
}
export const officialBadgeCopy={
 earned:{short:['Community veteran: your activity record speaks for itself.','Committed and accounted for. Another event series completed!'],poetic:['Proof of presence. Every badge here marks a moment where you stepped forward, participated, and carved out your space.','Unwavering commitment. Through every event, discussion, and prompt, you showed up and saw it through to the end.']},
 zero:{short:["Badge count: 0. A ghost presence throughout this year's events.",'Zero activities claimed. The showcase remains in total silence.'],poetic:['The year closes with an empty shelf and a lingering quiet. A monument to challenges unattempted and moments left untouched.','A vacant space where achievements were meant to live. Another cycle concludes without a single milestone to show for it.']}
};
// Unknown is distinct from a verified empty collection. The current MAL API has no badge field.
export function officialBadgeState(badges){return !Array.isArray(badges)?'unknown':badges.length?'earned':'zero';}
