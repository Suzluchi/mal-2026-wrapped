# Pending corrections and approvals — 16 October 2026

The user subsequently authorized implementing everything except the broader website redesign, Wrapped Awards, watching/reading energy changes, and final checks/release. The historical requirements below are preserved; this status section supersedes their earlier pending labels.

## Implemented in the music and readability update
- Twelve-song mix: all six additional uploads included from 0:00 for 35 seconds. Existing songs retain their start points and now last 35 seconds; Steel Ball Run remains 0:19–0:59. Total including crossfades: 408.5 seconds.
- Requested completed-count, verdict, length-question, and Anime Era GIF assignments. The later specific manga chapters GIF takes priority; its earlier alternative remains saved but unused. The final Gojo GIF was supplied locally by the user.
- Larger discovery headings, artwork, inline scores and body copy; Hidden Gem narratives moved alongside the image below the metric. Tiny discovery methodology footers removed from cards and retained in information.
- Independent one-second reveal steps for discovery copy, with existing 1.2-second ending hold. Existing 2.1-second cover-group timing preserved.
- Character selector uses only the signed-in user's MAL favourites, plus an optional no-character choice. Five background choices preserved. Curated transparent artwork remains limited to Saitama when actually in that user's favourites; others use their blended MAL portrait. A catalogue does not guarantee transparent PNG artwork.
- Keepsake displays days. All-time uses the public MAL profile's anime/manga days when available. Annual and unavailable-profile values use labelled completed-title estimates. No aggregate is assigned to a specific year. Methodology remains in the information panel.
- Targeted code/build and phone/tablet preview checks performed. Full account/device regression and release remain deferred.

## Remaining work
- Website typography, arrangement and broader design refresh.
- Your Wrapped Awards redesign, once revised requirements are supplied.
- Watching and reading energy review.
- Final account/device regression, final ZIP, and deployment checks. No push or deployment has been performed.

## Approved — preserve
- Final keepsake design approved. Do not reopen the whole layout redesign without a new request.
- All five selectable backgrounds approved, including orange sky (image 4) and autumn canal. Let users choose their background; preview and downloaded image must match.
- Full story timing approved. Preserve existing timing, including 2.1-second cover groups and special But/question pacing. New-card sequential reveals below are still required.
- Real keepsakes use a user's own MAL favourites; Saitama is a preview example only, never a universal character.

## Next corrections — not implemented yet
1. New discovery cards, both anime and manga: significantly increase headings, covers, scores, supporting text and spacing to match the established large story cards. Avoid excess unused space and tiny footnotes. Check phone/tablet reflow.
2. You vs. Everyone: remove the on-card detail text shown in screenshot: 'Average score difference across 116 rated titles. Community scores are today’s snapshot.' The count varies by user. Keep methodological context in the info panel if needed. Enlarge and space the main cover and text.
3. Hidden Gem Hunter: move heading upward; move the enlarged cover to one side. Put the title, inline score (10/10), relevant metric and narrative sentences in the adjacent text column. Put the narrative below the score/metric rather than beneath the picture. The shown metric is MAL list-member count, not an extra rating. Remove the tiny eligibility-rule footer from the card (currently 'Rated 8+ by you · at most 50,000 MAL list members. A discovery rule, not a claim of quality.'); retain the explanation in the information panel if needed.
4. Sentence staging across ALL new anime/manga discovery cards: give sentences separate readable lines and sequential entrances. At most two short sentences may share a line, but reveal them separately. Do not animate the entire copy block at once. Allow responsive wrapping rather than clipping long sentences.
5. Your Wrapped Awards: revisit next. User flagged it for changes but has not specified the revised content/layout yet. Do not invent their requested redesign.

## Character selector — investigate, optional
- Let a user choose which of THEIR MAL favourite characters appears in the keepsake.
- Investigate a character-image API/catalogue to supply suitable larger artwork or transparent PNGs. A character catalogue is not automatically a transparent-cutout library.
- No arbitrary global character assignment. No mandatory provider connection if unnecessary.
- If suitable PNG selection is impractical, user explicitly accepts continuing with the current personalized selection/fallback.
- Current curated cutout coverage is only Saitama; other favourites use blended portraits. This limitation must remain explicit.

## Time display — decision pending
- User asks whether MAL's reading/watching days statistics can supply the selected year's figures, and proposes DAYS instead of HOURS for both media.
- Investigate profile days_read/days_watched (Jikan user statistics / MAL profile stats). Current aggregate profile totals must not be presented as selected-year totals.
- Distinguish all-time profile days from a yearly estimate or snapshot delta; subtracting two snapshots alone does not prove actual activity dates.
- Do not invent a year's reading time from an all-time total. Explain reliable options before changing the calculation.
- Existing implementation estimates completed-title content: episode count × average episode duration; manga 5 minutes/chapter. Those assumptions are not newly approved by this request.
- Keep only 'Estimated' with the statistic on the downloaded card; methodology belongs in the information panel, not a small footnote.

## Other unfinished work retained
- Reassign/replace GIFs to fit each card, avoid unwanted duplicates.
- Expand soundtrack beyond eight tracks, review excerpts/transitions and playlist duration. Requires additional chosen music assets.
- Broader website typography/arrangement/design refresh previously deferred by user (separate from approved keepsake).
- Full account/device regression pass: empty lists, anime-only, manga-only, unrated titles, ongoing manga, no repeats/badges, many repeats/badges, long titles; all story cards on phone/tablet. Keep one internally browsable repeats gallery and one badges gallery.
- Final ZIP and GitHub Desktop/deployment verification after the next approved edits. Do not push/deploy without request.

## References supplied in latest request
- Purple detail-footer screenshot: codex-clipboard-67642da2-96a8-486a-9a76-f2d537a2390c.png
- Green Hidden Gem Hunter screenshot: codex-clipboard-4a36037e-edd6-4de2-970a-f92488d5bdd2.png
- Jikan API documentation: https://docs.api.jikan.moe/ (user statistics, user favourites, character pictures). Verify field semantics and limitations when implementing.
