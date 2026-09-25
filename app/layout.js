import './globals.css';
import './flash-recap.css';

export const metadata = {
  title: 'MAL Wrapped — The personal edition',
  description: 'Your anime and manga, in a personal year-in-review edition. Connect MyAnimeList to explore your titles, taste, and repeat favourites.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>;
}

import './vibrant-recap.css';
