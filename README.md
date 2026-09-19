# MAL 2026 Wrapped

## Current release: automatic list loading

MAL login and logout, a connected-account page, and read-only imports of the signed-in user's anime and manga lists. Successful MAL sign-in now goes directly to `/lists`, where both lists load automatically. No manual import step is shown.

The importer includes progress, independent retries for each list, search, table pagination, current-list totals, and inspection of recorded start/finish dates by year. It does not modify your MAL lists. The story demo remains fictional; a personal Wrapped story and shareable cards are not implemented yet.

## Upload and deployment

Upload the contents of this release ZIP to the root of the existing `Suzluchi/mal-2026-wrapped` repository. Include `app`, `lib`, `tests`, `package.json`, `pnpm-lock.yaml`, and this README, replacing previous versions. The dotfiles may be uploaded too. Do not upload `.git`, `.next`, `node_modules`, or any real `.env` file.

Commit to main with `Load MAL lists automatically after sign-in`. Wait for Vercel to build that commit. If it is Staged, promote that new deployment to the production domain.

The three existing production variables stay unchanged:

- MAL_CLIENT_ID
- MAL_CLIENT_SECRET
- MAL_REDIRECT_URI=https://mal-2026-wrapped.vercel.app/api/auth/callback/mal

No new credentials, database, or paid service are required.

## First live check

1. Sign in on the production website.
2. After MAL approval, you return directly to your lists.
3. Wait for both lists to load automatically; no import button is needed.
4. Compare the current list totals and a few titles/scores/dates against MAL.
5. Select 2026 to inspect recorded dates. Missing dates are excluded from annual completion counts.

## Accuracy and limits

- The MAL list API provides a current snapshot, not a complete historical activity log.
- A yearly completed-title count requires current status `completed` and a complete, valid finish date in the selected year. Year-only, month-only, missing, and invalid dates remain unknown. The UI shows how many completed entries lack a qualifying full finish date.
- Recorded starts are counted separately. Updated-at timestamps and current episode/chapter totals are not used to infer activity within a year.
- Rewatch/reread activity is not reconstructed. In-progress titles with old finish dates are not treated as currently completed titles.
- All list statuses are requested, with NSFW filtering disabled so adult-classified entries are not silently omitted. The importer currently displays titles and fields, not cover images.
- Each server request fetches one page of at most 100 entries. Following pages use offsets reconstructed against a fixed MAL endpoint, never arbitrary provider-supplied URLs. Duplicate IDs are merged.
- Failed or unfinished imports never display partial data as a complete list. The other list's successful import remains usable. A retry starts the failed list again from the beginning.
- Limits: 1,000 pages per import, maximum accepted offset 100,000, and 15 seconds per provider request. List changes during import can affect pagination; refresh if totals appear inconsistent.

## Privacy and security

The existing encrypted, Secure, HttpOnly session cookie retains a token for at most one hour. Tokens are never returned to browser JavaScript. Only normalised list IDs, titles, statuses, scores and recorded dates are returned to the page. No list database or browser persistence is used; leave or refresh the page to discard the in-memory import. API responses are private/no-store. Provider errors and token values are not logged by this code.

Login uses state validation, MAL-compatible PKCE, and same-origin POST checks. Logout clears this browser's cookies; MAL authorization can be revoked separately in MAL settings. The privacy page reflects list importing.

## Verification

- 20 automated authentication, pagination, data-normalisation, error-handling and date-eligibility tests passed.
- The Next.js production build passed locally.
- Browser checks against the production build and a separate local mock provider passed: 103 anime entries across two API pages, an empty manga list, search, table pagination, year selection, and mobile layout without page-wide horizontal overflow.
- Unauthenticated list API requests returned 401; the list page redirected to sign-in.
- No real MAL credentials or personal lists were used for these tests. The live account import must still be checked after deployment.
- The local mock provider is stored outside the release and is not included in the ZIP.

## Development

Node.js 24.x, pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm start
```

Authoritative API reference: https://myanimelist.net/apiconfig/references/api/v2

Automatic-loading update: all 20 tests and the production build passed. A browser check loaded 103 fictional anime titles and an empty manga list on page entry without clicking any import control. The effect aborts requests on unmount and safely restarts after cleanup. Retry is available only for failed lists. Live list import had already been confirmed by the project owner on the preceding version.

## Personal recap update

After both lists load automatically, /lists shows a ten-chapter personal recap. Select a year (1900–2026) or All time. Chapters cover completed anime and manga, highest scores, top five including cutoff ties, current average ratings, busiest recorded completion months, and date coverage. Full searchable lists remain available below the story.

Annual recaps include only currently completed titles with valid full finish dates in the selected year. All time includes undated completions. Scores are current scores, not historical ratings; no episode, chapter, time-spent, rewatch, or reread history is inferred. Recorded dates are used as supplied, including future dates if present. Empty lists produce explicit empty results; failed loads never become zero totals.

Validation: 24 automated tests passed and the production build passed. Real-account recap verification follows deployment. No new environment variables are required.

## Richer insights update

Lists now request genres, original release/publication dates, formats, anime studios and adaptation sources, and manga creators in the existing paginated requests. A new section below the recap shows completed-title category counts and current average scores, for the selected year or All time. Missing metadata is reported per breakdown. Categories can overlap; duplicate credits count once per title, unrated titles do not affect score averages, and leading-category ties are retained. Release years never determine the user's completion year.

Validated against the saved official MAL API v2 schema. Validation: 30 passing automated tests, successful production build, and local browser checks with fictional paginated data for automatic loading, year/All time changes, empty lists, and mobile width. Live metadata availability must be confirmed after deployment. No credentials or environment-variable changes are needed.

Deploy by extracting mal-2026-wrapped-richer-insights.zip and uploading its contents to the existing repository root, replacing matching files. Commit as Add richer list insights. Wait for Vercel Ready and promote if Staged.

## Accuracy update (supersedes earlier date rules)

Recap, insights, and list summaries now share lib/eligibility.mjs. Annual totals require currently completed status, a full valid finish date no later than the server-rendered UTC snapshot date, and no valid recorded start date later than the finish. Missing/partial/invalid, future, and reversed dates are reported separately (future takes precedence over reversed). All time retains every currently completed title but excludes unreliable dates from completion-month rankings. Partial start dates do not establish chronology. Release/publication dates never determine personal completion year.

The server passes one snapshot date to all components; the year selector follows that date. Reload to refresh the snapshot. Scores remain current scores, unrated/invalid scores are excluded, and cutoff ties stay included. No episode, chapter, rewatch, reread, or time-spent history is inferred.

Validation: 35 automated tests passed, covering shared totals, leap dates, today/tomorrow boundaries, date order, duplicates, ties, invalid ratings, and existing authentication/import behavior. Production build passed. No live-account data was used for these tests.

Deploy the contents of mal-2026-wrapped-accuracy.zip to the repository root, replacing matching files. Commit as Improve recap accuracy. No environment-variable changes required.
