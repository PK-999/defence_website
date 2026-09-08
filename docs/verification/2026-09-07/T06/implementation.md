# T06 verification — evidence and relationships

Implemented typed `PublicClaim`/`PublicEvidence` DTOs, rights-aware quote mapping, reviewed relationship predicates, endpoint validation, deterministic fingerprints, and explicit relationship enrichment for conflict/operation readers.

Changed paths include `src/lib/domain/relationships.ts`, `src/lib/repositories/evidence.ts`, `src/lib/repositories/relationships.ts`, `src/lib/content.ts`, and the relationship/evidence fixtures and integration tests.

Evidence: `npm run test:integration` passed the evidence and relationship suites; public DTOs omit raw storage paths and reviewer notes. Browser verification remains part of the unavailable Chromium gate.
