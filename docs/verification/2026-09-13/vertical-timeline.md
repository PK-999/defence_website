# Vertical chronology release verification — 2026-09-13

## Delivered behavior

- Conflict and operation readers expose a vertically scrollable chronology rail.
- Collection pages present chronology as a centered scrolling wheel: the active record grows to 1.18× with a bright reticle edge, while neighboring records progressively scale and fade by distance.
- Wheel movement changes the active record and plays a short, sharp ratchet strike; pointer and keyboard selection use the same transition.
- Operation dossier chronology updates the selected map marker as the centered event changes.
- The sound toggle persists a mute preference in local storage.
- `prefers-reduced-motion` disables scale and entrance animation while retaining selection and map behavior.
- Operation detail pages use the same direct, unlabelled map surface as conflict pages. Duplicate overview/full-report text and the redundant `Focus map` action are suppressed when a source-backed research dossier is present.

## Automated evidence

- `npm run typecheck` — passed.
- `npx eslint src/components/InteractiveConflictViewer.tsx src/components/ui/Timeline.tsx src/components/TacticalSoundToggle.tsx` — passed.
- `npm test` — 23 files / 83 tests passed.
- `npm run test:components` — 2 files / 2 tests passed.
- `npm run test:integration` — 14 files / 33 tests passed.
- `npm run test:e2e` — 76 desktop/mobile tests passed after the final wheel, dossier, sound, and map changes.
- `DATABASE_URL="file:$PWD/prisma/dev.db" npm run validate:database` — zero errors and zero warnings.
- `git diff --check` — passed.

## Production evidence

- Deployment: `dpl_AYtvtu2AXGEhMvzmaDYHAPGVqhBh` (Ready)
- URL: `https://defence-website-zeta.vercel.app`
- Live Chrome collection smoke: `/operations` exposed 21 chronology records, the first-to-second wheel transition visibly enlarged and highlighted `Battle of Badgam`, and surrounding names faded without clipping.
- Live Chrome dossier smoke: `/operations/battle-of-asal-uttar` rendered one summary, the research dossier, cited sources, field story, and a direct map with no `Tactical Map`, `Full report`, duplicate overview, or `Focus map` label.
- Live operation smoke: `/operations/battle-of-badgam-1947` returned HTTP 200; `badgam-approach → badgam-hold → badgam-airfield` marker transitions were observed; sound toggle changed from mute to enable; `Scrollable chronology` and `Stories & field notes` were present.
- Live conflict smoke: `/conflicts/kargil-1999` returned HTTP 200 and exposed the vertical conflict chronology with seven event cards.

Screenshots:

- [Operation chronology](../../../outputs/production-smoke-20260913/vertical-timeline-dock.png)
- [Conflict chronology](../../../outputs/production-smoke-20260913/conflict-vertical-timeline.png)
- Live collection smoke: `/operations` returned 21 chronology events and `/conflicts` returned 7; both showed the sound control and clicking the first chronology card navigated to a detail dossier.

Collection screenshots:

- [Operations collection chronology](../../../outputs/production-smoke-20260913/operations-collection-chronology.png)
- [Conflicts collection chronology](../../../outputs/production-smoke-20260913/conflicts-collection-chronology.png)

Final collection smoke: both routes returned HTTP 200, showed one chronology rail and one sound control, contained no “reviewed records” text, and year filtering reduced operations to 5 events and conflicts to 1 event.

The final visual pass confirms collection routes show chronology only; filters sit in the header action area above the divider, and the year / period selector filters the rail in place. The active card is centered and visually dominant, neighboring record names remain aligned, and farther records recede into the wheel.
