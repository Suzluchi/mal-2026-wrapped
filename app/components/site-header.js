import Link from 'next/link';
export function Brand() {
  return <Link className="brand" href="/" aria-label="MAL Wrapped home"><span className="brand-monogram" aria-hidden="true">MW<span>↗</span></span><span>MAL<br/>WRAPPED<span className="brand-period">.</span></span></Link>;
}
export default function SiteHeader({ account=false }) {
  return <header className="site-header"><Brand/><span className="masthead-caption">ANIME / MANGA / YOUR YEAR</span><nav aria-label="Main navigation">{account?<Link href="/account">My account ↗</Link>:<><Link href="/demo">Sample issue</Link><Link className="nav-connect" href="/connect">Make yours <span aria-hidden="true">↗</span></Link></>}</nav></header>;
}
export function SiteFooter() {
  return <footer className="site-footer"><span>MAL WRAPPED <span aria-hidden="true">↗</span></span><p>Made for the stories that stayed. A fan project, independent of MyAnimeList.</p><Link href="/privacy">Privacy</Link></footer>;
}
