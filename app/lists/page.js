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
  return <main className="lists-page"><Link className="brand" href="/account">MAL WRAPPED / MY ACCOUNT</Link><p className="eyebrow">YOUR PERSONAL RECAP</p><h1>Your stories, in review.</h1><p>Your anime and manga lists load automatically after sign-in. We only read your lists; we do not change them.</p><ListImporter name={session.user?.name} asOf={new Date().toISOString().slice(0,10)} /><p><Link href="/privacy">Privacy</Link> · <Link href="/account">Back to account</Link></p></main>;
}
