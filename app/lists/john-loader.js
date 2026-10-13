'use client';
import Reaction from './reaction';
// The bar describes two import stages, not a guessed percentage.
export default function JohnLoader({animeCount=0,mangaCount=0,animeDone=false,mangaDone=false}) {
 const done=Number(animeDone)+Number(mangaDone);
 return <div className="fx-loading" role="status" aria-live="polite"><div className="john-track" data-stage={done} aria-hidden="true"><div className="john-ink"/><div className="john-runner"><Reaction name="john-roll"/></div></div><h2>Gathering your plot twists…</h2><p>{animeCount+mangaCount} titles found so far.</p><div className="john-stages"><span>{animeDone?'✓':'○'} Anime · {animeCount}</span><span>{mangaDone?'✓':'○'} Manga · {mangaCount}</span></div><span>ANIME + MANGA / YOUR STORY</span></div>;
}
