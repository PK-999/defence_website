# T09 verification — audited review workflow

Implemented `src/lib/review/service.ts` for evidence-gated claim approval/rejection and import-proposal review. All writes use conditional revisions and a transaction containing the audit; proposal approval allow-lists content fields and moves the changed entity to `IN_REVIEW`.

The admin card now shows source/version/locator context, requires a reason, lets the editor choose verification status, disables duplicate submissions, resets pending state in `finally`, and displays typed action errors. `npm run test:integration` passed review approval, stale conflict, insufficient official evidence, rejection, and proposal approval checks. Real editor UI execution remains blocked by T08 credentials/browser availability.
