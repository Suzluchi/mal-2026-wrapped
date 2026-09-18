import Link from 'next/link';
export default function NotFound() {
  return <main className="text-page"><p className="eyebrow">404 / LOST EPISODE</p><h1>This chapter is missing.</h1><Link className="button primary" href="/">Back to home ↗</Link></main>;
}
