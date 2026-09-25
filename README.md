# MAL 2026 Wrapped

## Vibrant recap update

Upload the extracted contents of mal-2026-wrapped-vibrant.zip to the root of Suzluchi/mal-2026-wrapped. Replace matching files, including app, lib, public, tests, package.json and pnpm-lock.yaml. Commit as Update interactive recap. Wait for Vercel Ready and promote if Staged. Existing environment variables stay unchanged. No new credentials are needed.

The floating player stays 4:3 on desktop and taller on phones. Transcity and Peachy Mighties are embedded. Questions reveal the question mark, lead-in, highlighted new line, and quip separately. Six vibrant palettes, animated shapes and rotating cover batches replace the plain presentation. Covers use the entire eligible collection in a score-independent order. Pause or browse covers manually; reduced motion disables automatic cycling.

Started counts use valid recorded start dates. Current watching/reading and planned cards show today's statuses, not additions during the year. Completion counts still require eligible finish dates. Reload or Refresh from MAL fetches fresh lists automatically.

Top anime and its highest-score reveal use TV series only. Every equally highest-scored title is revealed in pages of five; equal scores do not establish a unique favourite. Top-five cutoffs use stable title order. Categories show five. Repeat galleries include all titles with recorded repeats or active repeat flags, five per card, always labelled all-time.

Official badges are read from the signed-in user's public MAL badge page, filtered by its displayed year. The API does not supply them. Blocked, incomplete or changed HTML is unknown and never reported as zero. Badge loading may fail on Vercel even if the public page opens locally.

Every card has a PNG download. The ending also supports sharing, copying and replay. Public MAL raster artwork is proxied through a fixed-host, size-limited endpoint to allow image exports. html-to-image 1.11.13 is vendored in lib/vendor with its MIT license.

Awards use prepared original illustrated portraits selected by leading genre. Character matches use a small editorial mapping and MAL character portraits. These are playful matches, not inferred identities. Unique AI generation per visitor is not connected. Motion is CSS animation, not a GIF collection. Music still awaits the user's files. John is a simplified animated SVG rendition based on the supplied reference.

## Artwork and typography

The supplied font license files remain in public/fonts. Transcity is a personal-use demo; commercial rights are not established by these files. The generated portrait atlas is public/art/taste-portraits.png. See ARTWORK.md for source and generation details.

## Completion and repeat rules

- All calculations use a shared eligibility function and one UTC snapshot date passed from the server. Reload to refresh the date and lists.
- Annual completed-title totals require completed status, a full valid finish date in the selected year no later than the snapshot, and no valid recorded start date later than the finish. Missing, partial, invalid, future and reversed dates are excluded and reported.
- A title flagged is_rewatching/is_rereading was previously completed according to MAL's schema. It remains in the All time completed collection even if its status is now watching/reading. It is excluded from annual totals and completion months because the stored dates may describe a different pass.
- All time includes completed titles with unreliable dates. Date issues are classified once, in this order: active repeat, missing/invalid date, future date, reversed dates.
- Recorded num_times_rewatched/num_times_reread counters are shown only as all-time context across the full list. Active repeats are shown separately and are not added to those counters. Missing counters/flags remain unknown; a returned zero is not proof of no historical repeats. No individual repeat date is available.
- Annual title counts are distinct titles with eligible recorded dates, not total completion events or necessarily first-ever completions. Updated-at timestamps never assign activity to a year.
- Scores are current user scores; only integer 1–10 scores affect ratings. The calculation layer retains ties; story cards choose a stable title/name order and limit display to five titles or five categories. Category counts can overlap.
- Release years describe publication/airing, not personal activity. Episode/chapter lengths describe the catalog title, not episodes watched, chapters read, or time spent during a year. No time totals are fabricated.

## Data and privacy

All list statuses are requested, including adult-classified entries, to avoid silently omitting titles. Public metadata and repeat fields arrive in the existing paginated list requests. Cover URLs are limited to HTTPS cdn.myanimelist.net and use no-referrer.

Tokens stay in encrypted Secure/HttpOnly cookies for up to one hour and are not returned to client JavaScript. Normalised list information stays in page memory; no database or local-storage persistence is added. Provider requests are private/no-store. Following pages reconstruct fixed MAL endpoints; supplied next URLs are never fetched directly. A failed page never becomes a complete total. Each page has a 15-second timeout and 100-entry maximum; the importer is bounded to 1,000 pages and offset 100,000.

## Validation

50 automated tests pass. Production build passes. Desktop and 320×568 phone checks cover count, ranking, question, repeat, award and ending scenes. A downloaded PNG was opened and visually checked. Public badge parsing was checked against a saved seven-badge MAL page. Live account sign-in/import and public-image requests need a production smoke check after upload. No local profile snapshots or test credentials are packaged.

## Development

Node.js 24.x; pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm start
```

API reference: https://myanimelist.net/apiconfig/references/api/v2

