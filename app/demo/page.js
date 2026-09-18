'use client';

import Link from 'next/link';
import { useState } from 'react';

const stories = [
  { label: 'THE OPENING CREDITS', title: 'A year of “just one more.”', number: '42', unit: 'anime completed', copy: 'Some stories stayed for a season. Others stayed with you.', mark: '✳' },
  { label: 'A DIFFERENT KIND OF PAGE-TURNER', title: 'You read between the plot twists.', number: '1,280', unit: 'manga chapters read', copy: 'The best cliffhangers always came right before bedtime.', mark: '✦' },
  { label: 'YOUR FAVOURITE ESCAPE', title: 'Fantasy had you in its grip.', number: '38%', unit: 'of your sample anime list', copy: 'Other worlds. Impossible odds. Apparently, very much your thing.', mark: '◎' },
  { label: 'THE ENDING CREDITS', title: 'Same time, next episode?', number: '2026', unit: 'a story still being written', copy: 'This is a sample of the experience. Your real recap will begin with your MyAnimeList account.', mark: '↗' },
];

export default function Demo() {
  const [index, setIndex] = useState(0);
  const story = stories[index];
  return <main className={`demo demo-${index}`}>
    <header className="demo-header"><Link className="brand" href="/">✳ MAL WRAPPED</Link><Link className="exit" href="/">Close sample ×</Link></header>
    <div className="demo-shell"><div className="demo-meta"><span>SAMPLE STORY · FICTIONAL DATA</span><span>0{index + 1} / 0{stories.length}</span></div>
      <div className="progress" aria-label={`Slide ${index + 1} of ${stories.length}`}>{stories.map((_, i) => <span className={i <= index ? 'filled' : ''} key={i} />)}</div>
      <section className="story" aria-live="polite" aria-atomic="true"><span className="story-mark" aria-hidden="true">{story.mark}</span><p className="eyebrow">{story.label}</p><h1>{story.title}</h1><p className="story-number">{story.number}</p><p className="story-unit">{story.unit}</p><p className="story-copy">{story.copy}</p></section>
      <nav className="story-controls" aria-label="Sample story controls"><button className="button secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}>← Back</button>{index < stories.length - 1 ? <button className="button primary" onClick={() => setIndex(index + 1)}>Next chapter →</button> : <Link className="button primary" href="/">Back to the beginning ↗</Link>}</nav>
    </div>
  </main>;
}
