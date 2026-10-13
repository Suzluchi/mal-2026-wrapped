export function questionBeats(slide){
 const match=slide.title.match(/^(But|And|So\.{3}|When|Which)\s+/);
 const parts=[];
 let rest=slide.title;
 if(match){parts.push({text:match[1].replace(/\.{3}$/,'')+'…',lead:true});rest=rest.slice(match[0].length);}
 if(slide.emphasis&&rest.includes(slide.emphasis)){
  const [before,after]=rest.split(slide.emphasis);
  if(before.trim())parts.push({text:(match?'…':'')+before.trim()});
  const text=slide.emphasis.charAt(0).toUpperCase()+slide.emphasis.slice(1);
  parts.push({text,emphasis:true});if(after.trim())parts.push({text:after.trim()});
 }else parts.push({text:rest});
 return parts.map((p,i)=>({...p,seconds:i===0?0:i+1}));
}
