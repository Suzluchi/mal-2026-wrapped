import { coverURL } from './insights.mjs';
export function imageSource(value){
 const src=coverURL(value);
 if(!src)return null;
 return /^\/(?:images\/(?:anime|manga|characters|badge|userimages)\/|s\/common\/userimages\/)/.test(new URL(src).pathname)?src:null;
}
