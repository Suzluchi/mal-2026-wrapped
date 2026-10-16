// Personal scores stay primary. Tie-breakers never change a MAL score.
export function personalRanking(items,history=items){
 const tiedIds=new Set(items.map(x=>x.id));
 const other=history.filter(x=>!tiedIds.has(x.id)&&x.score>0);
 const affinity=item=>{
  const ids=new Set((item.genres||[]).map(g=>g.id));
  const matches=other.filter(x=>(x.genres||[]).some(g=>ids.has(g.id)));
  return matches.length?matches.reduce((n,x)=>n+x.score,0)/matches.length:0;
 };
 return [...items].sort((a,b)=>b.score-a.score || Number(b.status==='completed')-Number(a.status==='completed') || (b.repeatCount||0)-(a.repeatCount||0) || (b.repeatValue||0)-(a.repeatValue||0) || affinity(b)-affinity(a) || a.id-b.id);
}
