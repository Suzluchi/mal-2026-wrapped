import SiteHeader, { SiteFooter } from '../components/site-header';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { config, sessionName, unseal } from '../../lib/auth.mjs';
import ListImporter from './list-importer';
export const dynamic = 'force-dynamic';
export default async function Lists() {
  let cfg;
  try { cfg = config(); } catch { redirect('/connect?error=configuration'); }
  const session = unseal((await cookies()).get(sessionName)?.value, 'session', cfg.secret);
  if (!session?.accessToken) redirect('/connect?error=expired');
  return <><SiteHeader account/><main id="main-content" className="lists-page"><div className="reader-title"><div><p className="eyebrow">THE PERSONAL EDITION</p><h1>Your issue.</h1></div><p>The titles. The detours. The ones that stayed.<br/>Your lists load automatically.</p></div><ListImporter name={session.user?.name} asOf={new Date().toISOString().slice(0,10)} /><p><Link href="/privacy">Privacy</Link> · <Link href="/account">Back to account</Link></p></main><SiteFooter/></>;
}
