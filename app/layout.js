import './globals.css';

export const metadata = {
  title: 'MAL Wrapped — Your year, frame by frame',
  description: 'A new way to relive your anime and manga year. Preview the MAL 2026 Wrapped experience.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
