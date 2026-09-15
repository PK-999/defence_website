# Release deployment

## Current production release — 2026-09-13

- Production URL: `https://defence-website-zeta.vercel.app`
- Deployment URL: `https://defence-website-hozd2f0v3-pks-projects-35b7ae41.vercel.app`
- Deployment ID: `dpl_AYtvtu2AXGEhMvzmaDYHAPGVqhBh` (Vercel status: Ready)
- Published editorial rows: 7 conflicts, 21 operations, 1,967 heroes, 39 arsenal records, and 34 sources.
- Search index: 2,068 records.
- Intel ledger: 14,711 collected records across 14 channels.
- Research room: `/intel`; machine-readable ledger: `/research/ledger.json`.

The owner-requested bulk release was recorded by `scripts/publish-all-editorial.ts` with actor `owner-requested-bulk-release-2026-09-12`. It wrote 1,980 `BULK_PUBLISH` audit entries, set review timestamps, and reconciled the search index. Research-status labels and evidence gaps remain visible in the Intel Ledger for follow-up review.

The shared `PageShell`/`PageHeader` now supplies the same breadcrumb, width, spacing, header, and responsive behavior across collection pages, tabs, and detail pages. Detail routes are server-rendered on demand, so the complete published catalogue does not need to be enumerated during the build.

Conflict detail pages restore the dated event timeline. Related operations are ordered by their stored start date, and selecting an event moves the map to that event's documented coordinates. Conflict and operation pages now share the same direct, unlabelled map surface and controls.

Operation pages now use the same selected-event state for their chronology and map. Source-linked dossier enrichments provide dated Badgam field positions (including the Srinagar airfield reference point), research narratives, and stories/field notes for Badgam, Asal Uttar, Basantar, Rezang La, and Point 5140. Duplicate overview and full-report fields are hidden when that research dossier already supplies the material.

The chronology rail is vertically scrollable on conflict and operation readers. Collection routes (`/conflicts` and `/operations`) use the rail as their sole record presentation, with direct dossier navigation. The centered event grows to 1.18× and receives a bright reticle edge; neighboring names progressively shrink and fade to create the requested MacBook-dock wheel effect. Every centered-event transition plays a compressed mechanical pawl strike with a short metal rebound. The sound can be muted and the animation respects `prefers-reduced-motion`.

The complete research ledger was first bundled into the production deployment on 2026-09-09:

- Production URL: `https://defence-website-zeta.vercel.app`
- Deployment URL: `https://defence-website-67ae4mkdd-pks-projects-35b7ae41.vercel.app`
- Deployment ID: `dpl_eA31ffYGVFEsGr94mpszYJXx8ugt` (superseded by the current release above)
- Research room: `/intel`
- Machine-readable ledger: `/research/ledger.json`
- Published ledger size: 14,711 records across 14 channels.

The deployment bundle uses a gzip encoded ledger at the existing JSON URL to stay below Vercel's 3 MB per-file limit. `src/lib/research-ledger.ts` transparently inflates that payload for the research room, and `vercel.json` advertises the response as `application/json` with gzip content encoding.

Local verification completed after the release:

- `npm test` — 64 tests passed.
- `npm run test:integration` — 33 tests passed.
- `npm run test:e2e` — 76 Chromium and mobile tests passed, including collection and detail chronology/map movement.
- `npm run typecheck` and production `next build` passed.
- Database validation returned no errors or warnings.
- The gzip runtime check rendered the Somnath Sharma search result and the 14,711 record count.
- Authenticated production smoke checks rendered the homepage and `/intel?section=historicalAwardRoster&q=Somnath` on the current production domain.
- Public production smoke checks confirmed the `Heroes` and `Arsenal` labels on the homepage, `/heroes`, `/arsenal`, and advanced search.

The Vercel account currently applies SSO deployment protection to the generated URL. Anonymous curl requests therefore receive Vercel's sign-in page; an authenticated Vercel session can open the URL, or the project owner can disable SSO protection before sharing the link publicly.
