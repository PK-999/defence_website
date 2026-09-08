<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## SENTINEL recovery documentation

For implementation or verification work on this repository, start with `docs/implementation-plan.md`, `docs/implementation-contracts.md`, `docs/test-plan.md`, `docs/content-operations.md`, and `progress_tracker.md`. The original long-term specs remain context; the recovery contracts resolve current implementation conflicts. Inspect the working copy and preserve existing user changes and the original SQLite database. Use task-specific evidence before marking completion. Documentation plans and historical checkboxes are not proof that features/tests exist. Do not run legacy destructive seeds to prepare a test environment; use the guarded disposable database procedure.
