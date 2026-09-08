# T24 verification — computed collection coverage

Replaced hard-coded coverage placeholders with a manifest-backed computation. The dashboard now keeps known-universe, indexed, sourced, and reviewed counts separate; sourced records require public source evidence, reviewed records require published status plus reviewer attribution, and unknown/empty denominators display `Coverage not yet defined` instead of an invented percentage.

Evidence:

- `npm test -- --run tests/unit/coverage.test.ts` passed 2/2, including the 10/8/6/4 contract and unknown-denominator behavior.
- `npm run typecheck` passed.
- `npx tsx -e '...getCollectionCoverage("kargil-1999")...'` returned manifest-derived metrics without mutating the database (`known=8`, `indexed=3`, `sourced=0`, `reviewed=0` in the current local database).
