// Reactions accompany the question or punchline, never reveal a ranked title early.
export function reactionFor(slide) {
 // Each supplied reaction has one scene only. Unmatched questions use typography
 // instead of repeating a GIF or putting fear/shock where curiosity belongs.
 return ({'anime-count':'completed-new','manga-count':'sparkles',
 'anime-question':'suspense','manga-question':'disbelief',
 'anime-scores':'verdict-anime','manga-scores':'verdict-manga',
 'anime-length-question':'longhaul-anime','manga-length-question':'chapters-days','anime-era':'victory',
 'anime-month':'watching','manga-month':'reading','badges-empty':'john-no'})[slide.id]||null;
}
