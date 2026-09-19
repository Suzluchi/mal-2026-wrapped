# MAL 2026 Wrapped

## Current release: interactive Wrapped

Sign-in imports both lists automatically, then opens an immersive story overlay. A floating card sits over blurred, gently moving cover artwork. Each card contains one reveal, with staggered text and image animation. Tap, swipe, use previous/next buttons or arrow keys. Close returns to the supporting website. Replay starts over. There is no automatic advance. Reduced-motion settings are respected.

Questions lead to a single title reveal, then up to five ranked titles. Genres and studios/creators show up to three. Detailed date, score and repeat explanations live behind the information button. No tied labels appear on the main cards. Anime studios and manga creators are separate. Profile pictures appear after a fresh sign-in; a letter is used if unavailable. The demo uses explicitly fictional data and original artwork. This release uses cover-art backgrounds, not video. Sharing cards remain a later stage.

## Deployment

Extract mal-2026-wrapped-interactive.zip. Upload its contents into the root of Suzluchi/mal-2026-wrapped, replacing matching files. Include app, lib, public, tests, package.json, pnpm-lock.yaml and README.md. Do not upload node_modules, .next, .git or real .env files.

Commit as Build interactive Wrapped experience. Wait for Vercel Ready; promote if Staged. Test /demo first, then sign out and back in on the production domain to refresh the profile picture. Existing MAL_CLIENT_ID, MAL_CLIENT_SECRET and MAL_REDIRECT_URI stay unchanged. No new services or credentials are required.

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

All 42 automated tests and production build passed. Browser checks covered the 27-card fictional sample at a 320 by 568 viewport, previous/next, keyboard navigation, replay, information focus and dismissal, and closing/reopening the overlay. Live MAL data and profile pictures still need a deployment check. Local mock data and reference recordings are not packaged.

## Development

Node.js 24.x; pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm start
```

API reference: https://myanimelist.net/apiconfig/references/api/v2
