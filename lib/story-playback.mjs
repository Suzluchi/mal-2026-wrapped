// Looping collections and the final keepsake stay until the reader continues.
export function waitsForReader(slide){
 return ['montage','repeat-covers','badges','closing','empty'].includes(slide.type)||
  (slide.type==='count'&&slide.items?.length>0);
}
