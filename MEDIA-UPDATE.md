# Discoveries and keepsake update

Copy the extracted ZIP contents into the GitHub Desktop repository folder, merging matching folders. Commit and Push origin. Do not copy the ZIP itself or an extra enclosing folder into the repository.

## Included
- User-approved table wording: Someday Shelf, Crown Jewel, Disappointments Department, Your Binge Era, Author Obsession, Manga Mountain, and The Long Haul. Existing selected lines remain intact.
- Currently reading and completed manga both inform rating rankings, average scores, author/genre summaries, reading energy and catalogue-length selection. Completion totals and busiest months remain completion-only. Completed manga receive 1.25 weight in author/genre summaries; ratings remain primary, with completion status an equal-score tie-breaker.
- Annual currently-reading manga requires a valid recorded start in that year. All-time includes undated reading titles. We do not infer dated reading activity from generic update timestamps.
- Anime Era (median release year, five-title minimum); You vs. Everyone (five comparable scores minimum); Plot Twist (eight rated titles and a rare-genre high scorer); Hidden Gem Hunter (one personal 8+ favourite, maximum 50k anime / 20k manga community list members). Insufficient evidence omits the card. Community figures are current snapshots, not historical.
- One combined Anime/Manga Graveyard, up to five circular covers per medium and an exact 'and N more' count. Dropped only, never on-hold/planned. Drop dates are not supplied by the present MAL list import, so normal yearly recaps omit undated drops and All-time labels their dates unknown. The internal model supports verified drop dates if available in future; it never substitutes last-updated dates.
- Navy keepsake based on the approved top-section layout: profile, actual Anime Era result, blended character art, completion/current-reading counts, top-five columns, personalised energy titles without category labels, and actual hidden-gem titles. No fabricated watch/reading hours.
- Favourite character comes from the first successfully parsed public MAL profile character favourite. Profile failures leave a neutral background; no arbitrary character is substituted. City/ocean/mountain themes are selected for supported names, abstract fallback for others. Public MAL portrait artwork is blended, not AI-regenerated.
- Download image / Share capture the same keepsake DOM shown to the user, excluding controls, replacing the old independent canvas template. Responsive exports reflect the displayed layout.
- Automatic story dwell is now 1.2 seconds after the final reveal. Galleries remain manual. Cover rotation waits for the initial reveal and preloads incoming images; intended group interval remains 2.1 seconds, with a bounded loading delay on slow networks.

## Verification
73 automated tests passed before the final build, with regression cases for ongoing manga, missing dates, rating thresholds, one combined graveyard, capped collections, and favourite parsing. Public profile parsing was verified against a live profile with ten favourites. A browser comparison showed the new exported PNG matches the displayed navy layout, lists, fonts and signatures. Browser image retry was added after a transient upstream artwork timeout.

Remaining visual QA: the final phone/tablet graveyard check and visual confirmation of the adjusted initial cover animation were interrupted by the browser automatic approval review hitting the account usage limit. They must not be described as passed. Temporary QA route is excluded from the deliverable.

## Still deferred
Additional music files, final GIF reassignment, and the broader website typography/design pass.

## Keepsake revision — 2026-10-16
- All five user-supplied backgrounds are selectable: twilight sky, purple clouds, sunset sea, orange sky (image 4), and autumn canal. Selection stays identical in the on-screen card and its download. Controls are excluded from export.
- Four statistics: completed anime, completed manga, estimated watch hours, estimated reading hours. Runtime is episode count times average episode duration; reading assumes five minutes per chapter. Both are content estimates for completed titles selected by completion year, not a reconstruction of hours spent in that year. Unknown metadata produces a partial label or an unavailable value. No calculation footnote appears in the image; explanation lives in the info panel.
- The character is selected only from that user's MAL favourites. Curated art is preferred when available. The current curated cutout is Saitama; other favourites still use a large blended MAL portrait fallback. Expanding the curated artwork collection remains outstanding. Demo and keepsake-preview deliberately show Saitama and fictional data.
- Top-five lists, personal signatures, actual hidden-gem title(s), and Your story, yours to keep remain in the same exported DOM.
- Cover rotation preloads the next group during the current round, removing the image-loading delay formerly added after 2.1 seconds. Initial reveal timing and individual pop animation unchanged.
- Discovery captions use Transcity; rating denominators stay beside their scores. Campaign eligibility labels are omitted from the highest-score genre caption.
- Verified phone (390px) and tablet (820px) reflow, five background options, and a downloaded orange-sky phone PNG with matching text, background, fonts, character and full footer.
# 16 October — music, reactions and readability update

All six newly supplied songs are included. The mix is 6:48.5 with 1.5-second crossfades. Excerpts are 35 seconds except the unchanged 40-second Steel Ball Run excerpt. New tracks start at the beginning; previous starting points are preserved.

The final manga chapters reaction uses the user's downloaded `satoru-gojo-high-gojo-high.gif`. New GIFs have static first frames for pause/reduced motion. Okabe now accompanies Anime Era. Existing unrelated assignments remain unchanged.

Discovery cards now use enlarged side-by-side art and copy, separate sentence entrances, and inline score denominators. Hidden Gem eligibility details and community calculation context remain available in the information panel rather than small on-card footers.

Keepsake character choices come from the actual user's favourites. All-time days come from MAL profile statistics when available; yearly days remain labelled estimates. The same poster DOM is still used for the download.

