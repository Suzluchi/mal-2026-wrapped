# MAL 2026 Wrapped

An interactive MyAnimeList year-in-review experience for anime and manga.

## Starter scope

- Responsive landing page and custom CSS artwork.
- Four-step sample recap at `/demo`, with explicitly fictional data.
- Starter privacy page and custom 404 page.
- Reserved OAuth callback: `/api/auth/callback/mal`.
- No real MAL authentication, list import, stats calculation, or sharing yet.

The callback deliberately returns HTTP 503 and does not process authorization codes. Adding credentials alone will not enable authentication.

## Run locally

Use Node.js 22 or newer and pnpm 11.19.0.

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000. For a production check, run `pnpm build` then `pnpm start`.

## Vercel deployment

1. Put these files in the root of the existing `Suzluchi/mal-2026-wrapped` repository, alongside this README. Include the lockfile.
2. Import that repository into Vercel (or refresh its existing import screen).
3. Choose the **Next.js** framework preset, root directory `./`, and default build/output settings.
4. Deploy without MAL environment variables; this starter does not need them.
5. Copy the actual production URL Vercel assigns. Do not assume a particular domain is available.
6. In MAL app registration, use that URL as the homepage and append `/api/auth/callback/mal` for the redirect URL.
7. Keep the client secret out of GitHub and chat. Add credentials to Vercel environment variables when the OAuth implementation is ready.

See `.env.example` for the planned variable names. Do not prefix secrets with `NEXT_PUBLIC_`.

## Next implementation milestone

Implement MAL OAuth with PKCE and state validation, server-side token storage and logout, then fetch paginated anime/manga lists. Define date eligibility and disclose missing list dates before calculating yearly statistics. A list's current episode or chapter count alone must not be presented as activity within a particular year. Update privacy information before enabling account connections.

## Verification status

Source files were prepared on 18 September 2026. Dependency installation was attempted repeatedly but the package registry timed out, including on Next.js and its Windows compiler package. The production build and browser preview are therefore NOT verified. No GitHub push or Vercel deployment has been performed. Retry `pnpm install`, then `pnpm build` before deployment. Commit the generated `pnpm-lock.yaml` once installation succeeds.
