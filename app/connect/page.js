import Link from 'next/link';
const messages = {
  configuration: 'Connection is not configured on this deployment yet. Please try again after setup is complete.',
  expired: 'That sign-in attempt expired or could not be verified. Please start again from this page.',
  cancelled: 'Sign-in was cancelled. You can try again whenever you are ready.',
  failed: 'We could not finish connecting to MyAnimeList. Please try again. If it keeps happening, check that the registered redirect URL matches the website settings.',
};
export default async function Connect({ searchParams }) {
  const { error } = await searchParams;
  const message = Object.hasOwn(messages, error) ? messages[error] : null;
  return <main className="text-page"><Link className="brand" href="/">✳ MAL WRAPPED</Link><p className="eyebrow">YOUR ACCOUNT</p><h1>Connect with MAL.</h1>{message && <p role="alert">{message}</p>}<p>You’ll go to MyAnimeList to sign in and approve access, then return here. We never ask for your MAL password.</p><p>This release connects your account and lets you import your anime and manga lists. The full recap experience is still being built.</p><form action="/api/auth/login/mal" method="post"><button className="button primary" type="submit">Continue to MyAnimeList ↗</button></form><p><Link href="/privacy">How we handle your data</Link></p></main>;
}
