import Link from 'next/link';

export const metadata = { title: 'Privacy — MAL Wrapped' };
export default function Privacy() {
  return <main className="text-page"><Link className="brand" href="/">✳ MAL WRAPPED</Link><p className="eyebrow">THE STARTER EXPERIENCE</p><h1>Your privacy.</h1><p>This version displays a fictional sample recap. MyAnimeList sign-in is not enabled, and this application does not request or store your MyAnimeList profile, lists, password or access tokens.</p><p>No analytics or advertising tools have been added to this starter. The hosting provider may process standard request information, such as IP addresses, for delivery and security.</p><p>Before account connection launches, this page will be updated to explain what list data is used, how it is retained, and how to disconnect.</p><Link className="button primary" href="/">Back to home ↗</Link></main>;
}
