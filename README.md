# MAL 2026 Wrapped

## Current release: the magazine edition

MAL sign-in loads both lists automatically. The recap opens with the account name and period totals, then follows a chapter sequence through score reveals, ranked titles, rating distribution, completion months, genres, studios/creators, formats, adaptation sources, release years, and catalog lengths. Chapters appear only when supported by data. Repeats, data coverage, and a closing summary round out the story. Empty selections have a shorter path.

The player supports previous/next, chapter selection, replay, and left/right arrows when a non-control element inside the player has focus. Ties are preserved. MAL cover art is used when available, with letter placeholders on failure. Details and searchable lists remain below the player. The visual direction is an original anime magazine: warm paper, black ink, vermilion/blue accents, bold display type, serif editorial copy, numbered spreads, original SVG artwork, and sticky chapter controls. Layouts adapt to mobile and respect reduced-motion settings. The /demo route now uses the same chapter player with clearly fictional titles and original sample covers. Sample titles never link to unrelated MAL entries. Downloadable sharing cards remain a later stage.

## Deployment

Extract mal-2026-wrapped-magazine.zip. Upload its contents to the root of Suzluchi/mal-2026-wrapped, replacing matching files. Include app, lib, public, tests, package.json, pnpm-lock.yaml and README.md. The new public/art folder is required for the home illustration and sample covers. Do not upload node_modules, .next, .git or real .env files.

Commit as Redesign MAL Wrapped as a personal magazine. Wait for Vercel Ready and promote the new deployment if Staged. Use the production domain for sign-in.

Existing production variables stay unchanged:
- MAL_CLIENT_ID
- MAL_CLIENT_SECRET
- MAL_REDIRECT_URI=https://mal-2026-wrapped.vercel.app/api/auth/callback/mal

No new credentials, database or service are needed.

## Completion and repeat rules

- All calculations use a shared eligibility function and one UTC snapshot date passed from the server. Reload to refresh the date and lists.
- Annual completed-title totals require completed status, a full valid finish date in the selected year no later than the snapshot, and no valid recorded start date later than the finish. Missing, partial, invalid, future and reversed dates are excluded and reported.
- A title flagged is_rewatching/is_rereading was previously completed according to MAL's schema. It remains in the All time completed collection even if its status is now watching/reading. It is excluded from annual totals and completion months because the stored dates may describe a different pass.
- All time includes completed titles with unreliable dates. Date issues are classified once, in this order: active repeat, missing/invalid date, future date, reversed dates.
- Recorded num_times_rewatched/num_times_reread counters are shown only as all-time context across the full list. Active repeats are shown separately and are not added to those counters. Missing counters/flags remain unknown; a returned zero is not proof of no historical repeats. No individual repeat date is available.
- Annual title counts are distinct titles with eligible recorded dates, not total completion events or necessarily first-ever completions. Updated-at timestamps never assign activity to a year.
- Scores are current user scores; only integer 1–10 scores affect ratings. Cutoff ties remain included. Category counts can overlap and metadata coverage is shown.
- Release years describe publication/airing, not personal activity. Episode/chapter lengths describe the catalog title, not episodes watched, chapters read, or time spent during a year. No time totals are fabricated.

## Data and privacy

All list statuses are requested, including adult-classified entries, to avoid silently omitting titles. Public metadata and repeat fields arrive in the existing paginated list requests. Cover URLs are limited to HTTPS cdn.myanimelist.net and use no-referrer.

Tokens stay in encrypted Secure/HttpOnly cookies for up to one hour and are not returned to client JavaScript. Normalised list information stays in page memory; no database or local-storage persistence is added. Provider requests are private/no-store. Following pages reconstruct fixed MAL endpoints; supplied next URLs are never fetched directly. A failed page never becomes a complete total. Each page has a 15-second timeout and 100-entry maximum; the importer is bounded to 1,000 pages and offset 100,000.

## Validation

Magazine update: production build and all 41 existing tests passed. Browser checks verified all 29 sample chapters on mobile without page-wide horizontal overflow, reveal controls, replay and edition reset, sign-in layout, narrow home layout, original assets, and the signed-in automatic-loading flow with fictional test data. New home and supporting-page text reflects the available recap.

41 automated tests passed: authentication, pagination, errors, normalisation, date consistency, repeat counters/flags, unknown-versus-zero data, all-time/annual separation, rankings, story composition, and allowed cover hosts. Production build passed. Browser checks used a separate fictional provider: paginated anime, manga, active repeats, tied reveal, replay, chapter selection, year reset, sparse-year flow, keyboard navigation and mobile width. No real account credentials or lists were used. Live repeat fields and covers should be checked after deployment.

The local mock provider and reference recordings are not included in this release.

## Development

Node.js 24.x; pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm start
```

API reference: https://myanimelist.net/apiconfig/references/api/v2
