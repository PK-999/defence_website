# Gallantry UI and Production Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the enriched gallantry corpus in a photo-forward hero browser with clean names, complete award counts, consistent dates, and a shared tactical click sound.

**Architecture:** Keep the existing Next.js routes and research model, replacing the two-award JSON-only read path with the generated full gallantry dataset. Add shared presentation helpers for names and dates, a delegated client-side click-sound listener at the root layout, and preserve safe fallbacks for incomplete enrichment.

**Tech Stack:** Next.js 16.3.4, React 19, TypeScript, Tailwind CSS, Vitest, Playwright, existing tactical audio helper, Vercel CLI.

**Spec:** User screenshots and request in the active conversation; repository recovery contracts in `docs/implementation-contracts.md` and `docs/test-plan.md`.

## Global Constraints

- Preserve unrelated existing worktree changes and the original SQLite database.
- Treat undocumented historical values as undocumented; do not infer missing dates or biographies.
- Display documented full dates as `dd-mm-yyyy`; preserve year-only values as years.
- Keep photos sourced from the official gallantry portal and render an explicit fallback when absent.
- Use `apply_patch` for source edits and run focused tests before broad verification.
- Deploy only after local tests, build, and browser verification pass.

### Task 1: Lock the data and presentation contracts

**Files:** Modify `tests/unit/gallantry-research.test.ts`, create `tests/unit/display-formatting.test.ts`, modify `tests/e2e/heroes-awards.spec.ts`.

- [ ] Add failing assertions for all six award counts, 4,310 total rows, official photo URLs, title-free display names, enriched fields, and `dd-mm-yyyy` output.
- [ ] Add failing browser assertions for three-column awardee grids, rendered photos, hero-count copy, and the all-award browse cards.
- [ ] Run the focused unit tests and record the expected failures before changing production code.

### Task 2: Connect the complete enriched corpus

**Files:** Modify `src/lib/heroes/gallantry-research.ts`; create or update the generated dataset artifact under `data/research/`; modify `src/scratch.py` only if needed to keep the UI data artifact reproducible.

- [ ] Load the complete generated corpus, preserving legacy canonical stories and source links where available.
- [ ] Expose all six awards, exact counts, photos, DOB/DOD, service entry date, gallantry action date, awarded date, biography, and citation details through the existing research API.
- [ ] Add a title/rank-prefix stripper used only for display names and retain rank in the detail facts.

### Task 3: Update hero browsing and detail UI

**Files:** Modify `src/app/heroes/page.tsx`, `src/app/heroes/awards/[award]/page.tsx`, `src/app/heroes/awardees/[id]/page.tsx`, `src/app/heroes/[slug]/page.tsx`, `next.config.ts` if remote image configuration is required.

- [ ] Render the complete corpus in the main hero browse, with counts expressed as heroes and links for all six awards.
- [ ] Render photos with accessible alt text and an explicit missing-photo fallback.
- [ ] Use a responsive three-column grid on desktop and remove title prefixes from card names.
- [ ] Add the enriched facts and reason-for-medal details to awardee pages, using `Gallantry action date` as the clearer field name.

### Task 4: Standardize visible dates and clicks

**Files:** Modify `src/lib/domain/dates.ts`, all visible date-rendering routes/components found by `rg`, create `src/components/TacticalClickProvider.tsx`, modify `src/app/layout.tsx`, `src/components/SiteHeader.tsx`, `src/components/ui/Timeline.tsx`.

- [ ] Add a timezone-safe display formatter for ISO day dates and use it for all visible dates while preserving partial precision.
- [ ] Add a root delegated pointer/keyboard listener for interactive elements, reuse the operations-page tactical click sound, and avoid duplicate timeline playback.
- [ ] Expose the global mute control in the shared header while retaining the existing preference behavior.

### Task 5: Verify and deploy

**Files:** Create `docs/verification/2026-09-13/gallantry-ui-production.md`.

- [ ] Run focused unit/component tests, full test/typecheck/lint/build checks, and inspect the diff for unrelated changes.
- [ ] Start the dev server and perform the required browser verification for home, hero browse, and an award route, including console/error checks.
- [ ] Inspect the linked Vercel project, deploy with `vercel --prod`, smoke-test the production URL, and record the deployment evidence.
