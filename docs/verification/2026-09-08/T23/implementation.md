# T23 verification — public metadata and resilient route states

Added validated `SITE_URL` handling, root metadata defaults, public record metadata with canonical URLs, OpenGraph summaries, a public-only dynamic sitemap, and noindex metadata for the admin segment. Added a route-level search loading state, retryable error, and recovery-focused not-found states. The root loading boundary is intentionally absent because Next.js streams dynamic `notFound()` responses as HTTP 200 when a root loading boundary is present; private detail routes retain their required 404 status. Metadata reads public repositories so draft/withdrawn records cannot leak into head tags or the sitemap.

Evidence:

- `npm test -- --run tests/unit/site-config.test.ts` passed 3/3.
- `npm run typecheck` passed.
- `npm run build` passed with local `SITE_URL=http://localhost:3000`.
- `npm run test:e2e -- tests/e2e/metadata.spec.ts` passed 6/6 across Chromium desktop/mobile.
- Production configuration still fails closed when `SITE_URL` is missing, while local/test environments use the documented localhost origin.
