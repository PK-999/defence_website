# Corresponding test and release specification

All cases below are **planned regressions**, not tests claimed implemented or passing in this review. Existing 63 unit tests, typecheck and quiet lint passed freshly; browser checks are limited to the separate evidence record. Write the focused failure before implementing each behavior.

## Isolation and execution

Use existing guarded `.test-data` runners. Never run legacy seeds or reset the original database. The 3001 preview uses `e2e.db`; do not run a runner that replaces that file beneath this server. Stop only task-owned processes; establish a unique fixture DB and build directory before new lifecycle work. Use synthetic facts with explicit fixture labels; published historical acceptance needs a separately validated candidate.

Narrow commands, from repository root:

```sh
npm run test:components -- tests/components/search-dialog.test.tsx
npm run test:integration -- tests/integration/search.test.ts
npm run test:integration -- tests/integration/evidence.test.ts
npm run test:integration -- tests/integration/collections.test.ts
npm test -- tests/unit/query.test.ts
```

Only run paths after the owning task creates them. Browser automation must follow the then-current user/tool authorization; this review used only Computer Use for Chrome. Future E2E uses the guarded runner after confirming file/server isolation. A missing browser or provider is blocked, never passed.

## Acceptance cases

| ID / owner | Setup and action | Exact acceptance / failure caught |
|---|---|---|
| B01 / P01 | Record original DB hash/counts, server PID and working diff; perform review/setup | Original records unchanged, no fixture import to original DB, current gates supported by actual assertions |
| S01 / P02 | Mount header + home trigger; press Cmd+K then Escape; reopen from hero | Exactly one dialog/listbox, focus returns to correct trigger, one global shortcut effect |
| S02 / P02 | Query A request pending; type B; resolve B then A; clear query; close | Only B results; no stale loading/empty state; actual fetch signal aborted; no request starts while closed |
| S03 / P02 | Type query, ArrowDown twice, Enter; repeat with fewer results | Active descendant points to existing option; visible selection matches; Enter opens correct URL; index resets/clamps |
| S04 / P02 | Debounce in progress, then HTTP503, then Retry | No false zero-results during wait; understandable error announced; retry yields results |
| S05 / P03 | 600 matches sorted alphabetically; strongest alias match on last alphabetic entity | Exact alias wins despite position >500; total 600; all pages reachable; quick first8 equals full first8 |
| S06 / P03 | Leave stale SearchDocument then withdraw/hide entity or remove reviewer | Public search HTML/API/count excludes it; no secret title/summary/alias in response |
| S07 / P03 | q length0/1/121, Unicode, spaces, literal %/_, invalid type, repeated q/type, page=NaN/1e9/3abc | Consistent empty short-query result; invalid controls recoverable400; punctuation literal; no500/private diagnostics |
| Q01 / P03 | 55 people; pages1/2/3/999 and negative; date/title sorts | 24/24/7/clamped7; no overlap; stable order; normalized URL/control state |
| Q02 / P03 | domain+incompatible category on page3; switch domain; press Back | Incompatible category removed; page1; unrelated valid state preserved; Back restores intended prior state |
| Q03 / P03 | Slow navigation; type multi-character collection search; invalid facet and repeated keys | No dropped characters, bounded requests, invalid-filter explanation plus clear action; raw URL keys not UI labels |
| N01 / P02 | Mobile menu open; select destination; Back; Escape; keyboard-only | Correct destination, menu closes, no hidden overlay/focus trap; active link exposed |
| E01 / P04 | Confirmed, disputed, source-conflict claims | Distinct status treatment; disputed explanation visible; all words readable; no unconditional green confirmation |
| E02 / P04 | Source rights false with stored quote; expand claim, inspect server response | Quote absent from public DTO/HTML; source title/locator retained; internal notes absent |
| E03 / P04 | Malformed specs/coordinates/JSON and missing optional field | Corruption produces typed error/report; unknown remains unknown; no invented empty or zero value |
| E04 / P04 | Unit/operation/equipment page → fact/section evidence → source → original | Every displayed required fact/narrative section has correct public source/locator; no dangling evidence links |
| D01 / P05 | Default conflict page and explicit explorer on desktop/375px, JS disabled | Default article readable; explorer opt-in; one pane on narrow viewport; no page-level horizontal overflow |
| D02 / P05 | ISO day/month/year, leap day, invalid date, unknown endpoint | Correct chronological order/precision; no reversal/Jan1 invention/current-state assumption |
| D03 / P05 | Markdown duplicate headings, Hindi headings, safe link and script payload | Unique nonempty heading IDs; TOC targets correct sections; useful links; no raw script execution |
| D04 / P05 | Reduced motion; change event/map; chronology arrows | No map flyTo/spatial entrance/forced smooth scroll; named operable controls; readable content with JS disabled |
| V01 / P06 | All routes and open/empty/loading/error/success states | Vocabulary inventory complete; real people/official titles unchanged; no fake classification/security status |
| V02 / P06 | 320/375/768/1024/1440px, 200%/400%, keyboard + screen reader | Reflow; visible focus; no obscured targets; measured contrast meets WCAG AA; meaningful labels and announcements |
| V03 / P06 | Capture every required state through chosen browser | Exact saved image inspected and accepted; no blank/loading substitute; URL/viewport/data label/hash recorded |
| C01 / P07 | Start zero, add one, two, three, attempt fourth, remove one | Actionable picker always reachable; add-second prompt; max3 explained; no silent lost selection |
| C02 / P07 | Copy/reload URL; duplicate items keys, malformed percent, four unique slugs, hidden slug | Safe parse once; recoverable invalid request; no stack or hidden metadata; canonical URL preserved |
| C03 / P07 | Different variants; combat-radius vs ferry-range; missing spec; mobile table | No conflation, no winner; unknown text; source per field; bounded labeled overflow |
| G01 / P07 | Valid seed outside first8, each of six types, withdrawn seed | Valid deep links load; hidden seed unavailable; no chooser-induced false404 |
| G02 / P07 | 10,000 adjacent relationships; mixed public/private/evidence; request limit40 | DB read budget bounded, ≤100 nodes/≤200 edges; accurate truncated; only evidenced public edges |
| G03 / P07 | Load async graph then resize; switch topics rapidly; fail503/retry; text route | Canvas fits container; stale result never replaces new seed; text links and evidence usable by keyboard |
| J01 / P08 | Home→collection→operation→person/equipment→evidence/source→related | All links substantive and public; no empty dead end presented as a completed collection |
| J02 / P08 | Save/reload/remove; corrupt storage; denied storage; withdrawn saved entity | Versioned refs only, useful error, deterministic restore; no private/stale narrative cached |
| J03 / P08 | Copy link with success and clipboard rejection; correction without destination | Accurate success/failure; correction draft available; no fake sent confirmation |
| J04 / P08 | Forces overview/hierarchy/unit list with missing or private parent | Only evidenced public hierarchy; bounded list; missing data explained; current filters retained |
| R01 / P09 | New source and replay of same bytes/input | Stable identity/hash; no duplicate versions/claims; exact locator verified |
| R02 / P09 | Conflicting sources, expired status, unknown rights, target missing evidence | Held/explicitly disputed; no automatic source-tier promotion; no goal-count fabrication |
| R03 / P09 | Candidate publication without actor, then valid actor; stale revision | First denied; second audited atomic publication; stale change conflicts; no partial index state |
| R04 / P09 | Full T26 target and source trail with real candidate | Meets each reviewed-content target or names exact sourcing gap; fixtures never count |
| L01 / P10 | Publish→read→withdraw on production-mode isolated server | Detail/search/graph/metadata/sitemap immediately exclude withdrawn content |
| L02 / P10 | Three fixed production runs at2k/10k fixtures; record transfer/query/render | ≤24 collection, ≤8 quick results; no eager map; GeoJSON≤1MB; query counts/HTML do not grow unbounded |
| L03 / P10 | Real OIDC editor/non-editor/revoked account/signout/provider error | Per-action authority enforced; public browsing survives auth failure; no mock-only closure |
| L04 / P10 | Restore disposable backup with matching revision | Integrity, references and public routes restored; original DB untouched; evidence preserved |
| X01 / P11 | Ambiguous acronyms, Unicode glossary, stale source, complete trail | Ambiguity explicit; native script works; definitions cited; withdrawn source prevents false approval |
| X02 / P12 | BudgetBE vs actual, announced vs delivered, event vs release dates; retract | Distinctions retained in UI/search; no invented completion; publication rules cover new types |
| X03 / P13 | Clock before/at/after deadline and reviewDueAt; notice R06; superseding notice | Closed/stale state exact; no Apply after11 June2026 18:00 local notice time; exam date independent |
| X04 / P14 | Hindi/English same dossier, revised original, missing translation, query switch | Stable identity/source links; correct lang; stale translation flagged; explicit fallback |

## Concrete regression examples for implementation

These are test shapes to add in owning tasks; they are not executed in this documentation-only review. Use real shared fixtures/helpers at implementation time and keep mock scope to browser transport or platform APIs.

```tsx
// tests/components/provenance.test.tsx — E01
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { ProvenanceViewer } from '@/components/ProvenanceViewer';

test('explains a disputed claim to the reader', () => {
  render(<ProvenanceViewer claims={[{
    id: 'disputed', property: 'date', value: '1999-05',
    verificationStatus: 'DISPUTED',
    editorialExplanation: 'The sources describe different activities.',
    evidence: [],
  }]} />);
  expect(screen.getByText('The sources describe different activities.'))
    .toBeVisible();
});
```

```ts
// Add to isolated integration search suite — S06.
// Run after normal helper has seeded its own dedicated fixture database.
it('does not return a stale projection for a withdrawn person', async () => {
  await reconcileSearchIndex(db);
  await db.person.update({
    where: { id: 'person-001' },
    data: { publicationStatus: 'WITHDRAWN' },
  });
  const response = await searchArchive({ q: 'Fixture Person 001' }, db);
  expect(response.results.some(r => r.slug === 'fixture-person-001')).toBe(false);
  expect(response.total).toBe(0);
});
```

```ts
// tests/e2e/reading.spec.ts — D01. Future isolated browser run only.
test('default conflict opens a reading dossier', async ({ page }) => {
  await page.goto('/conflicts/fixture-conflict');
  await expect(page.getByRole('article')).toBeVisible();
  await expect(page.getByRole('link', { name: /open explorer/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open Conflict Overview' }))
    .toHaveCount(0);
});
```

The direct withdrawal in S06 is deliberately test-only corruption/staleness setup; application publication must continue using the transactional service. The existing search tests rebuild first and cannot catch this failure. Likewise the existing timeline test starts in explorer and cannot prove default reading mode.

## Release evidence template

Record task ID, revision, fixture/candidate path, input hash, command, exit status, meaningful failing assertion, passing assertion, screenshot/AX path and limitations. Keep source accuracy, software correctness, visual accessibility, provider integration, deployment and rollback as separate gates. A green label/render count is never enough to prove editorial truth.

Performance thresholds are targets, not this run's measurements. [Core Web Vitals guidance](https://web.dev/articles/vitals) defines LCP/INP/CLS; field experience requires representative traffic. [W3C combobox guidance](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) supports S03; [React effect guidance](https://react.dev/reference/react/useEffect) supports cleanup/race handling. Consult installed Next data/rendering guides for this version before changing implementation.
