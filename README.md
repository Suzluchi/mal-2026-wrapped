# MAL 2026 Wrapped

## Account connection update

This release implements MAL authorization-code login with PKCE, state validation, a connected-account page, and logout. Anime/manga list importing and personal statistics are not implemented yet. `/demo` remains explicitly fictional.

## Deployment

Upload `app`, `lib`, `tests`, `package.json`, and this README to the root of the existing repository, replacing the earlier files. Include `pnpm-lock.yaml` if present. Do not upload `.env.local`, `.git`, or `node_modules`.

The production environment needs:

- MAL_CLIENT_ID
- MAL_CLIENT_SECRET
- MAL_REDIRECT_URI=https://mal-2026-wrapped.vercel.app/api/auth/callback/mal

Values belong in Vercel environment variables, never in code. The redirect must exactly match the registered MAL redirect. This implementation requires HTTPS. Preview addresses intentionally cannot initiate login using the production redirect configuration.

After the GitHub commit, wait for the Vercel build. If it is marked Staged, promote that new deployment to the production domain. Test Connect with MyAnimeList, approve on MAL, confirm the returned username, and test Log out. Also try cancelling authorization.

## Security and retention

- Login and logout use POST with strict Origin validation.
- PKCE uses a random 86-character verifier and the `plain` method currently required by MAL's official documentation: https://myanimelist.net/apiconfig/references/authorization
- A separate random state is bound to a ten-minute encrypted browser cookie; it is checked before any token request.
- AES-256-GCM authenticated encryption protects session and flow cookies. Purpose-specific associated data prevents substituting one cookie for another. A dedicated encryption key is derived with HKDF from MAL_CLIENT_SECRET. Rotating that secret invalidates cookies.
- Cookies use Secure, HttpOnly, SameSite=Lax, Path=/, and the __Host- prefix, with no Domain attribute.
- Sessions retain only the MAL user ID, username, and access token, for at most one hour and no longer than the token lifetime. Refresh tokens are discarded. Sessions are stateless and are not stored in a database.
- Logout clears the browser cookies. It does not revoke MAL authorization or invalidate a previously stolen cookie before expiry. Manage app authorization through MAL when necessary.
- Provider requests use fixed HTTPS endpoints, no caching, no redirect following, and 15-second timeouts. Errors shown to the browser do not include provider responses, authorization codes, or tokens.
- The Client Secret never enters frontend code. The Client ID is necessarily sent to MAL in the OAuth authorization URL, as required by the protocol.

## Checks

Use Node.js 24.x and pnpm 11.19.0.

`node --test tests/auth.test.mjs` runs the security and flow checks without additional packages. Tests use fictional credentials and mocked MAL responses.

`pnpm install` and `pnpm build` install dependencies and perform a production build.

## Next milestone

Import paginated anime/manga lists, define date eligibility, and calculate personal recaps. Current episode/chapter totals alone must not be treated as activity within a calendar year.

## Verification for this update

Nine automated authentication/security tests passed using mocked MAL responses. Server module syntax checks and relative import checks passed. A local production build could not be completed because dependency downloads timed out/remained stalled, even after retrying with a longer timeout. The real MAL authorization flow still needs verification on the production domain after Vercel builds this update. No credentials are included in this package.
