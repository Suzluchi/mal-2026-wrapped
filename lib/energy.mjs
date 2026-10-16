import {selectTaste} from './eligibility.mjs';
export function storyEnergy(items,kind,period,asOf){
 const list=selectTaste(items,kind,period,asOf);
 const rated=list.filter(x=>x.score>0),average=rated.length?rated.reduce((n,x)=>n+x.score,0)/rated.length:null;
 const genres=new Set(list.flatMap(x=>(x.genres||[]).map(g=>g.id)));
 const repeats=list.filter(x=>x.repeatCount>0).length;
 const long=list.filter(x=>x.length>=(kind==='anime'?50:100)).length;
 let title='The Story Collector',line='A little curiosity. A lot of stories that stayed.';
 if(repeats>=2&&repeats/list.length>=.25){title='The Loyal Returner';line='Finding a favourite is good. Coming back to it is your signature move.';}
 else if(rated.length>=3&&average<=6){title='The Selective Critic';line='A finished story still has to earn your applause.';}
 else if(genres.size>=6){title='The Curious Explorer';line='One kind of story was never going to be enough for you.';}
 else if(long>=2&&long/list.length>=.4){title='The Long-Haul Companion';line='You make room for stories that take their time.';}
 else if(rated.length>=3&&average>=8){title='The All-In Enthusiast';line='When a story connects, you give it its flowers.';}
 return {title,line,signals:[`${list.length} ${kind==='manga'?'read or reading manga':'completed anime'}`,`${genres.size} genres explored`,...(average===null?[]:[`${average.toFixed(1)}/10 average score`])],covers:list.filter(x=>x.cover).slice(0,3)};
}
