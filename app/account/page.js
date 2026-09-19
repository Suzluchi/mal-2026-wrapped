import SiteHeader, { SiteFooter } from '../components/site-header';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { config, sessionName, unseal } from '../../lib/auth.mjs';
export const dynamic = 'force-dynamic';
export default async function Account() {
  let cfg;
  try { cfg = config(); } catch { redirect('/connect?error=configuration'); }
  const session = unseal((await cookies()).get(sessionName)?.value, 'session', cfg.secret);
  if (!session?.user?.name) redirect('/connect?error=expired');
  return <><SiteHeader/><main id="main-content" className="text-page"><p className="eyebrow">CONNECTED TO MYANIMELIST</p><h1>Welcome, {session.user.name}.</h1><p>Your account is connected. Your anime and manga lists load automatically when you view them.</p><p>You can still explore the fictional sample. It does not use your account data.</p><Link className="button primary" href="/lists">Open my edition ↗</Link><form action="/api/auth/logout" method="post"><button className="button secondary" type="submit" style={{ marginTop: 20 }}>Log out</button></form><p>This session lasts up to one hour. Logging out clears it on this browser.</p></main><SiteFooter/></>;
}
