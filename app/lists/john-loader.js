'use client';
// The bar describes two import stages, not a guessed percentage.
export default function JohnLoader({animeCount=0,mangaCount=0,animeDone=false,mangaDone=false}) {
 const done=Number(animeDone)+Number(mangaDone);
 return <div className="fx-loading" role="status" aria-live="polite"><div className="john-track" data-stage={done} aria-hidden="true"><div className="john-ink"/><svg width="0" height="0" aria-hidden="true"><defs><filter id="goku-white-key" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -1 -1 -1 0 3"/><feComponentTransfer><feFuncA type="linear" slope="255"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/></filter></defs></svg><div className="john-runner"><div className="goku-run-sprite"/></div></div><h2>Gathering your plot twists…</h2><p>{animeCount+mangaCount} titles found so far.</p><div className="john-stages"><span>{animeDone?'✓':'○'} Anime · {animeCount}</span><span>{mangaDone?'✓':'○'} Manga · {mangaCount}</span></div><span>ANIME + MANGA / YOUR STORY</span></div>;
}

