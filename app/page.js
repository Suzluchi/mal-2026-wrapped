import Link from 'next/link';

export default function Home() {
  return <>
    <header className="nav"><Link className="brand" href="/" aria-label="MAL Wrapped home"><span className="brand-icon">✳</span> MAL<span className="brand-light">WRAPPED</span></Link><a className="nav-link" href="#how-it-works">How it works <span>↗</span></a></header>
    <main>
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow"><span className="dot" /> THE 2026 EDITION · IN THE MAKING</p>
          <h1>Your year.<br />Your obsession.<br /><span className="outline">Your wrapped.</span></h1>
          <p className="intro">The late nights. The one-more-episodes. The manga you couldn’t put down. Let’s make a story out of your year.</p>
          <div className="actions"><Link className="button primary" href="/demo">Explore a sample <span>↗</span></Link><a className="button secondary" href="/connect">Connect with MyAnimeList <span>＋</span></a></div>
          <p className="micro">Anime + manga. All your main-character energy.</p>
        </div>
        <div className="hero-art" aria-label="Illustrated 2026 Wrapped preview">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <span className="art-star star-one">✳</span><span className="art-star star-two">✦</span>
          <div className="year-art">20<br />26<span className="year-caption">A YEAR WORTH REPLAYING</span></div>
          <div className="ticket"><span>YOUR NEXT CHAPTER</span><strong>To be continued…</strong><div className="ticket-bottom"><span>ANIME / MANGA</span><span>▶ PLAY IT BACK</span></div></div>
          <span className="art-label">THE STORIES STAY WITH YOU.</span>
        </div>
      </section>
      <div className="ticker" aria-hidden="true"><span>YOUR FAVOURITES</span> ✳ <span>YOUR PLOT TWISTS</span> ✳ <span>YOUR LATE NIGHTS</span> ✳ <span>YOUR YEAR IN ANIME</span> ✳</div>
      <section className="features" id="how-it-works"><div className="section-heading"><p className="eyebrow">MORE THAN A LIST</p><h2>Every obsession has a story.</h2><p>Here’s what we’re building for your year in review.</p></div><div className="feature-grid">
        <article><span className="feature-number">01 / RECONNECT</span><h3>Start with your list.</h3><p>Connect your MyAnimeList account. Your anime and manga are the starting point.</p></article>
        <article><span className="feature-number">02 / RELIVE</span><h3>Find your favourites.</h3><p>Explore the titles, genres and studios that shaped your year, one reveal at a time.</p></article>
        <article><span className="feature-number">03 / MAKE IT YOURS</span><h3>Keep the good parts.</h3><p>Shareable recap cards are on the way. Until then, take the sample story for a spin.</p></article>
      </div></section>
      <section className="connection" id="connection"><span className="connection-symbol" aria-hidden="true">✳</span><div><p className="eyebrow">A LITTLE EARLY TO THE PARTY</p><h2>Your list, coming soon.</h2><p>MyAnimeList sign-in is available. Personal recaps are still in development. The sample is fictional and does not use your account data.</p></div><Link className="button primary" href="/demo">Try the sample ↗</Link></section>
    </main>
    <footer><span className="brand">MAL<span className="brand-light">WRAPPED</span></span><p>A fan-made project. Not affiliated with MyAnimeList.</p><Link href="/privacy">Privacy</Link></footer>
  </>;
}
