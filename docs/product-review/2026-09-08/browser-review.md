# Chrome interaction evidence and visual-audit blocker

Historical run: 8 September 2026. Current status: see the [9 September resumed visual audit](visual-audit-2026-09-09.md), which adds one accepted Equipment screenshot; the broader flow remains incomplete.

Run: 8 September 2026. Tool: requested Computer Use skill, `node_repl` + `@oai/sky`, app `com.google.Chrome`. Target: existing production-mode local server `http://localhost:3001`. Desktop window screenshot dimensions 970×768 including browser chrome; CSS viewport was not measured. Data: synthetic fixture records, not the original draft corpus.

## Numbered flow and health

1. **Homepage — partially checked.** Address navigation succeeded. Accessibility tree exposes the site heading, seven navigation links, two search triggers, subject cards and unfinished-collection state. Screenshot rejected.
2. **Search dialog — incomplete.** Clicking search exposed named Search dialog/combobox/listbox. `set_value` and `type_text` did not yield a verified query value or result; do not classify search as passing or broken from this tool result. Screenshot rejected.
3. **Capture retry — blocked.** Raised Chrome using the exposed window action and reloaded. Accessibility tree repopulated; screenshot content remained blank. Visual audit stopped after this bounded retry.
4. **Conflicts collection — partial pass.** Clicked Conflicts; fresh tree shows two explicitly synthetic records and their detail links. Saved `04-conflicts-ax.txt`.
5. **Conflict detail — partial pass.** Clicked Fixture Conflict; fresh tree shows title, dates, default Timeline/Dossier explorer, Show map, no documented coordinates, and no direct connections. Saved `05-conflict-detail-ax.txt`.
6. **Search from detail — incomplete.** Dialog opened but typing remained unverified. Saved `06-search-ax.txt`; dismissal behavior was not certified from the transient tree.
7. **Remaining flows — not visually checked.** People, equipment, compare, forces, sources, graph, mobile navigation, reduced motion, zoom, screen reader, error recovery and real-editor sign-in require a resumed run. Code review covers their implementation where documented separately.

## Rejected screenshot evidence

The exact tool screenshots were saved and opened. All show browser chrome with a blank content area; none supports a visual finding about SENTINEL. Initial filenames end in `.png`, but file signatures are JPEG; final files are preserved under `rejected/` with corrected `.jpg` extensions. This is a naming correction only, not image editing.

- `rejected/01-home.jpg`: homepage capture, rejected.
- `rejected/02-search.jpg`: search capture, rejected.
- `rejected/03-capture-retry.jpg`: raised/reloaded capture, rejected.

No accepted screenshot set existed at the end of the 8 September attempt. Do not reuse the older T27 images as this run's evidence. Do not diagnose blank application rendering solely from a capture that contradicts the populated accessibility tree. Cause remains unresolved.

## Audit-rule consequence

The requested product-design audit says: “Do not claim an audit if the actual flow could not be accessed and captured.” Its [SKILL.md](/Users/apple/.codex/plugins/cache/openai-curated-remote/product-design/0.1.53/skills/audit/SKILL.md) also requires rejecting blank captures. Accordingly, the screenshot-based UI/UX audit is blocked. Independent architecture, research and planning work continued. No alternate browser/Playwright screenshot mechanism was substituted for the requested Computer Use workflow.

## Resume acceptance

Capture each main journey at desktop and 375px, plus 320px/200%/400% reflow checks. Inspect the exact saved image before assigning a finding. Record URL/query, real viewport, data classification, screenshot hash and observed action result. Show ordered accepted screenshots beside findings. Verify source disclosure, keyboard search, menu closing, compare selection, graph topic resolution, map fallback and reduced motion. A screenshot alone cannot prove request cancellation, source accuracy or assistive-technology compliance.
