# MAL 2026 Wrapped

## Current release: real list import

MAL login and logout, a connected-account page, and read-only imports of the signed-in user's anime and manga lists. The account page now links to `/lists`.

The importer includes progress, independent retries for each list, search, table pagination, current-list totals, and inspection of recorded start/finish dates by year. It does not modify your MAL lists. The story demo remains fictional; a personal Wrapped story and shareable cards are not implemented yet.

## Upload and deployment

Upload the contents of this release ZIP to the root of the existing `Suzluchi/mal-2026-wrapped` repository. Include `app`, `lib`, `tests`, `package.json`, `pnpm-lock.yaml`, and this README, replacing previous versions. The dotfiles may be uploaded too. Do not upload `.git`, `.next`, `node_modules`, or any real `.env` file.

Commit to main with `Add anime and manga list importing`. Wait for Vercel to build that commit. If it is Staged, promote that new deployment to the production domain.

The three existing production variables stay unchanged:

- MAL_CLIENT_ID
- MAL_CLIENT_SECRET
- MAL_REDIRECT_URI=https://mal-2026-wrapped.vercel.app/api/auth/callback/mal

No new credentials, database, or paid service are required.

## First live check

1. Sign in on the production website.
2. On the welcome page, select Import my lists.
3. Select Import both lists and wait for both imports to finish.
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
