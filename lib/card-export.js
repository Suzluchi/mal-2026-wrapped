import { toPng } from './vendor/index.js';
export async function downloadCard(element,filename){
 await document.fonts.ready;
 element.setAttribute('data-exporting','true');
 try{
  const url=await toPng(element,{pixelRatio:2,cacheBust:false,filter:node=>!node.classList?.contains('fx-info')});
  const a=document.createElement('a');a.download=filename;a.href=url;a.click();
 }finally{element.removeAttribute('data-exporting');}
}
