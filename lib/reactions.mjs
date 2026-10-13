// Reactions accompany the question or punchline, never reveal a ranked title early.
export function reactionFor(slide) {
 if(slide.id==='badges-empty')return 'john-no';
 if(slide.type==='question')return slide.id.includes('length')?'scared':slide.id.includes('month')?'disbelief':'suspense';
 if(slide.type==='month')return slide.kind==='manga'?'reading':'watching';
 if(slide.type==='number')return 'shock';
 if(slide.type==='repeats')return 'overwhelmed';
 return null;
}
