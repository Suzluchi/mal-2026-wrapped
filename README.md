# MAL 2026 Wrapped

## Current release: 4:3 stories, typography and keepsakes

Sign-in imports both lists automatically, then opens an immersive story overlay. A floating card sits over blurred, gently moving cover artwork. Each card contains one reveal, with staggered text and image animation. Tap, swipe, use previous/next buttons or arrow keys. Close returns to the supporting website. Replay starts over. There is no automatic advance. Reduced-motion settings are respected.

Questions lead to a single title reveal, then up to five ranked titles. Genres and studios/creators show up to three. Detailed date, score and repeat explanations live behind the information button. No tied labels appear on the main cards. Anime studios and manga creators are separate. Profile pictures appear after a fresh sign-in; a letter is used if unavailable. The demo uses explicitly fictional data and original artwork. This release uses cover-art backgrounds, not video. The final keepsake supports PNG download, native file sharing where available (download fallback otherwise), and copying a text summary. No public personal-recap URL is created.

## Deployment

Extract mal-2026-wrapped-cover-pop.zip. Upload its contents into the root of Suzluchi/mal-2026-wrapped, replacing matching files. Include app, lib, public, tests, package.json, pnpm-lock.yaml and README.md. Do not upload node_modules, .next, .git or real .env files.

Commit as Add 4:3 recap, typography and keepsake. Wait for Vercel Ready; promote if Staged. Test /demo first, then sign out and back in on the production domain to refresh the profile picture. Existing MAL_CLIENT_ID, MAL_CLIENT_SECRET and MAL_REDIRECT_URI stay unchanged. No new services or credentials are required.

## Design and remaining work

Desktop cards scale at a 4:3 aspect ratio. Narrow phones retain a taller layout for readable text. Supplied Transcity and Peachy Mighties files are embedded, with their supplied license documents in public/fonts. Transcity is a personal-use demo; these files do not establish commercial rights. Keep the font licenses with the files and confirm the appropriate rights before commercial distribution.

John is a simplified original SVG rendition, animated along a loading-stage bar. It does not show a fabricated completion percentage. The user-approved revised card copy is used, with moderate staggered transitions and reduced-motion support.

Wrapped awards use the leading genre among eligible completed titles. Character matches are a small editorial genre-to-character mapping, explicitly described as playful. Manga matches require eligible manga with genre data. No night-viewing or time-spent claims are inferred. Unmapped genres receive an award but no invented character match.

Official MAL event badges are NOT connected. The available official API schema has no badge field or endpoint. All requested earned/zero badge messages are saved in lib/awards.mjs. Unknown data is explicitly distinct from a verified empty badge list; no zero-badge accusation is shown. A reliable badge source and year attribution are still required before enabling this card. Music awaits user-provided files.

## Completion and repeat rules

- All calculations use a shared eligibility function and one UTC snapshot date passed from the server. Reload to refresh the date and lists.
- Annual completed-title totals require completed status, a full valid finish date in the selected year no later than the snapshot, and no valid recorded start date later than the finish. Missing, partial, invalid, future and reversed dates are excluded and reported.
- A title flagged is_rewatching/is_rereading was previously completed according to MAL's schema. It remains in the All time completed collection even if its status is now watching/reading. It is excluded from annual totals and completion months because the stored dates may describe a different pass.
- All time includes completed titles with unreliable dates. Date issues are classified once, in this order: active repeat, missing/invalid date, future date, reversed dates.
- Recorded num_times_rewatched/num_times_reread counters are shown only as all-time context across the full list. Active repeats are shown separately and are not added to those counters. Missing counters/flags remain unknown; a returned zero is not proof of no historical repeats. No individual repeat date is available.
- Annual title counts are distinct titles with eligible recorded dates, not total completion events or necessarily first-ever completions. Updated-at timestamps never assign activity to a year.
- Scores are current user scores; only integer 1–10 scores affect ratings. The calculation layer retains ties; story cards choose a stable title/name order and limit display to five titles or three categories. Category counts can overlap.
- Release years describe publication/airing, not personal activity. Episode/chapter lengths describe the catalog title, not episodes watched, chapters read, or time spent during a year. No time totals are fabricated.

## Data and privacy

All list statuses are requested, including adult-classified entries, to avoid silently omitting titles. Public metadata and repeat fields arrive in the existing paginated list requests. Cover URLs are limited to HTTPS cdn.myanimelist.net and use no-referrer.

Tokens stay in encrypted Secure/HttpOnly cookies for up to one hour and are not returned to client JavaScript. Normalised list information stays in page memory; no database or local-storage persistence is added. Provider requests are private/no-store. Following pages reconstruct fixed MAL endpoints; supplied next URLs are never fetched directly. A failed page never becomes a complete total. Each page has a 15-second timeout and 100-entry maximum; the importer is bounded to 1,000 pages and offset 100,000.

## Validation

All 46 automated tests and production build passed. Browser checks covered the 30-card fictional sample at 1366x768, 1024x600 and 320x568. Verified 4:3 desktop proportions, PNG download, copied summary, and automatic import from an isolated delayed mock. Native share sheets depend on browser support; otherwise Share downloads the image. Live MAL data and profile pictures still need a deployment check. Local mock data and reference recordings are not packaged.

## Development

Node.js 24.x; pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm start
```

API reference: https://myanimelist.net/apiconfig/references/api/v2

## Cover-pop update

Completion-count cards show up to five eligible title covers with staggered pop entrances. Separate anime rewatch and manga reread cards show up to five titles from recorded lifetime repeats and active repeat flags. Active repeats are labelled separately; this does not assign repeats to the selected year. Missing covers use an initial. Reduced-motion settings disable the cover animation. Sample now has 32 cards; phone fit checked through both repeat galleries.
