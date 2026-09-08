# T27 verification — release rehearsal and handoff

The repository now contains a read-only GitHub Actions quality workflow at `.github/workflows/quality.yml`. It runs locked JavaScript install, Prisma generation, lint, typecheck, unit/component/integration tests, content/assets validation, production build, isolated Chromium E2E, and the locked Python factory suite. It does not access production secrets, crawl sources, reset a production database, or deploy automatically.

The local release command is:

```bash
SITE_URL=http://localhost:3000 npm run build
SITE_URL=http://localhost:3000 npm run start
```

For this handoff, the production server is running at `http://localhost:3001` against the isolated fixture database `.test-data/e2e.db` (absolute `DATABASE_URL`, no changes to `prisma/dev.db`). Smoke verification returned 200 for `/`, `/conflicts`, `/heroes/fixture-person-001`, `/graph`, `/compare?items=fixture-system-a,fixture-system-b`, and `/sitemap.xml`; the draft hero returned 404. The sitemap contained the public fixture and excluded `fixture-person-draft`.

The current release candidate remains draft-only for the Kargil collection. The OIDC lifecycle, accountable publication, production database/backup rehearsal, accepted screenshots, zoom/screen-reader inspection, and final deployment configuration remain open gates. Those require owner-managed provider/hosting inputs documented in `docs/MANUAL_WORK_AND_REQUIRED_INPUTS.md`.

The rollback rule is to restore the database backup and redeploy the previous Git revision, then rerun `validate:database`; never reset or reseed the production database as a rollback mechanism.
