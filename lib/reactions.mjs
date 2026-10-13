// Reactions accompany the question or punchline, never reveal a ranked title early.
export function reactionFor(slide) {
 // Each supplied reaction has one scene only. Unmatched questions use typography
 // instead of repeating a GIF or putting fear/shock where curiosity belongs.
 return ({'anime-count':'overwhelmed','manga-count':'sparkles',
 'anime-question':'suspense','manga-question':'disbelief',
 'anime-scores':'victory','manga-scores':'proud2',
 'anime-month':'watching','manga-month':'reading','badges-empty':'john-no'})[slide.id]||null;
}
