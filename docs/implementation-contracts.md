# SENTINEL implementation contracts

**Status:** Proposed implementation contract, 6 September 2026. Nothing in this file claims the application already implements these rules.

Read with the [ordered implementation plan](implementation-plan.md), [test plan](test-plan.md), and [content runbook](content-operations.md). These contracts settle naming and behavior so different tasks do not invent incompatible interfaces. Existing user instructions take precedence. New implementation should retain Next.js 16.3.4, React 19.2.8, Prisma/client 5.22.0, SQLite, Tailwind 4, Base UI, and the current route structure unless a separately documented compatibility problem requires change.

## C01. Scope, precedence, and release boundaries

1. This is a recovery of the existing application, not a new scaffold.
2. The next release includes truthful publication, working navigation, bounded collections/search, readable details, real evidence access, and one reviewed connected collection.
3. Comparison and scoped graph follow that baseline. Broader domain expansion follows the repeatable collection playbook.
4. Public deployment and external account provisioning are separate actions from local implementation.
5. Historical seed text is not verified merely because it already exists or is labeled `Published`.
6. Never use demo fixtures to make a public corpus look complete.
7. Authority within project docs: this contracts file for shared behavior; implementation plan for order/file ownership; test plan for gates; content runbook for editorial procedures; review for original evidence; older specifications for compatible product intent.
8. Preserve the original review's dated findings. Add later verification evidence instead of rewriting the past as though fixes existed on the review date.

## C02. Canonical identity and routes

```ts
export type EntityType = 'Conflict' | 'Operation' | 'Person' | 'Equipment' | 'Unit' | 'Source';
export type EntityRef = { entityType: EntityType; entityId: string };
export const ENTITY_ROUTES: Record<EntityType, string> = {
  Conflict: '/conflicts', Operation: '/operations', Person: '/heroes',
  Equipment: '/arsenal', Unit: '/forces/units', Source: '/archive',
};
export function entityHref(type: EntityType, slug: string): string {
  return `${ENTITY_ROUTES[type]}/${encodeURIComponent(slug)}`;
}
export function entityKey(ref: EntityRef): string {
  return `${ref.entityType}:${ref.entityId}`;
}
```

Place these in `src/lib/domain/entities.ts`. IDs are immutable; slugs are editable URLs with redirects. Alias uniqueness is within `(entityType, entityId, normalizedAlias)`; the same alias can legitimately resolve to several entities. Never automatically merge same-name people. Preserve a source's external identity and review ambiguous matches.

Existing collection paths remain canonical. Permanent redirects: `/history/:slug*` → `/conflicts/:slug*`, `/people/:slug*` → `/heroes/:slug*`, `/sources` → `/archive`. Do not create a global wildcard redirect that conceals missing pages. `/forces/units/[slug]` is introduced by T12. Missing or non-public details return 404.

## C03. Publication is separate from historical/service status

```ts
export type PublicationStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'WITHDRAWN';
export type ContentKind = 'EDITORIAL' | 'DEMO';
export const publicWhere = {
  publicationStatus: 'PUBLISHED', contentKind: 'EDITORIAL',
  reviewedAt: { not: null }, reviewedBy: { not: null },
} as const;
```

Add `publicationStatus String @default("DRAFT")`, `contentKind String @default("EDITORIAL")`, `reviewedAt DateTime?`, `reviewedBy String?`, and `revision Int @default(0)` to Conflict, Operation, Person, Equipment, Source, and the new Unit model. Keep legacy `status` fields during migration; do not reinterpret `Active` or `Deceased` as publication. New imported records start DRAFT, even if their input says Published. Existing records also start DRAFT until an explicit review record exists. This intentionally creates honest empty states; the executor must not weaken publication filtering to fill them.

All public queries include `publicWhere`: details, collections, counts, related records, source pages, search hydration, graph nodes, metadata, sitemap. A read repository must never expose admin DTOs such as candidate notes. `getPublicEntity(ref)` returns `null` for non-public IDs. `getPublicEntityBySlug(type, slug)` does the same. Both live in `src/lib/repositories/entities.ts`. Raw Prisma stays in `src/lib/db.ts`; `src/lib/content.ts` is a temporary backwards-compatible facade until its consumers migrate.

`publishEntity({ref, expectedRevision, reason})` requires an editor and succeeds only after the publication validator returns no errors. It sets publicationStatus/reviewer/time and increments revision in the same transaction as the audit record and search-index update. Withdrawal removes the search projection and public relationships immediately. Do not persist a public search document independently of publication.

## C04. Claims and evidence

Retain Claim `status` values `CANDIDATE | GOLD | REJECTED`; do not introduce `APPROVED` as a competing value. Retain supported verification statuses:

```ts
export type VerificationStatus =
  | 'OFFICIALLY_CONFIRMED' | 'MULTIPLE_CREDIBLE_SOURCES'
  | 'DECLASSIFIED_RECORD' | 'DISPUTED' | 'SOURCE_CONFLICT' | 'UNVERIFIED';
```

An editorially approved disputed claim may be shown with its disagreement clearly explained. Public claim predicate: GOLD + at least one valid evidence link + public subject + public source. `UNVERIFIED` claims stay internal. Green is reserved for confirmed/corroborated statuses; disputes use amber plus text, never color alone.

Add to Claim: `reviewedAt DateTime?`, `reviewedBy String?`, `revision Int @default(0)`. Add to Source: `publisher String?`, `canonicalUrl String?`, `sourceType String?`, `tier String?`, `language String @default("en")`, `rightsNotes String?`. Family tier is a default, not proof of an individual claim. Preserve per-document classification.

Add to SourceVersion: `contentHash String?`, `rawStoragePath String?`, `parserVersion String?`, `httpStatus Int?`. Hashes are SHA-256 of exact captured bytes. Versions are immutable once referenced. Null fields are allowed during migration but cannot pass publication requirements where an online source is being cited.

Add to Evidence: `evidenceType String @default("TEXT")`, `rightsSafeToDisplay Boolean @default(false)`, `reviewerNote String?`. Require a usable locator. Text evidence must either match the captured normalized text or have a reviewer-approved transcription/OCR explanation. Do not claim a substring check establishes factual truth. Quotes are hidden when display rights are not established; show locator and paraphrase instead. Source URLs must be HTTPS/HTTP, never `javascript:` or arbitrary filesystem paths. This is not permission for a server-side arbitrary URL fetcher.

Also add Evidence `authorityType String @default("unknown")` and `authorityBasis String?`. Allowed authorityType values: `official-statement | technical-first-party | scholarly | discovery | unknown`. `authorityBasis` explains why that specific passage has authority for the exact claim. OFFICIALLY_CONFIRMED requires at least one directly relevant official-statement item with a nonempty basis; source tier alone cannot satisfy it. MULTIPLE_CREDIBLE_SOURCES requires at least two independently authored non-discovery sources, with their independence recorded in the decision reason. A copied press release on two sites is one underlying source. Classification may be produced by a versioned automated policy for routine claims, but the policy must use document content and scope rather than URL-domain detection alone. Exceptions defined in the content runbook remain held for grouped editorial review.

Add `EntityEvidence` with `id`, `entityType`, `entityId`, `section` (summary/content/spec key), `evidenceId` FK, and a composite uniqueness constraint across these fields. This supports narrative sourcing in addition to atomic claims. Evidence deletion must not silently delete public references.

Public `PublicClaim` DTO contains id, property, value, verificationStatus, public editorial explanation, and evidence DTOs with source title, publisher, version, locator, quote only when permitted, and original/archive URLs. It never contains rawStoragePath or internal reviewer notes.

## C05. Review actions, authentication, and audit

Use a maintained authentication library, with **Auth.js OIDC as the selected integration recipe**, pinned to a compatible published release when T08 executes. Do not write password/session/CSRF cryptography. If the project's dependency compatibility cannot be verified, keep administration denied and document that specific dependency blocker rather than switching packages casually.

Environment names: `AUTH_SECRET`, `AUTH_OIDC_ISSUER`, `AUTH_OIDC_CLIENT_ID`, `AUTH_OIDC_CLIENT_SECRET`, `EDITOR_SUBJECTS`. The last is a JSON array of allowed `{issuer, subject}` pairs. Match provider issuer+stable subject, not a mutable display name or email. Never print secrets. Missing/invalid configuration denies access. Allow-list membership is checked on every editor action so removal revokes privilege without waiting for a session refresh.

`src/lib/auth/editor.ts` exports:

```ts
export type EditorSession = { issuer: string; subject: string; actorId: string };
export async function requireEditor(): Promise<EditorSession>; // throws UnauthorizedError
```

The production implementation reads only the library-validated session. Test injection exists in service constructors/unit tests, not in HTTP headers, query parameters, environment flags that accept fake users, or public debug routes.

```ts
export type ReviewInput = {
  claimId: string; expectedRevision: number; decision: 'approve' | 'reject';
  reason: string; verificationStatus?: VerificationStatus;
};
export type ActionResult =
  | { success: true; revision: number }
  | { success: false; code: 'UNAUTHORIZED' | 'INVALID_INPUT' | 'NOT_FOUND'
      | 'CONFLICT' | 'INSUFFICIENT_EVIDENCE' | 'INTERNAL_ERROR'; message: string };
```

Reason length: trimmed 10–2,000 characters. expectedRevision is a nonnegative integer. Approval requires a selected verificationStatus other than UNVERIFIED and valid evidence. OFFICIALLY_CONFIRMED additionally requires evidence from a source explicitly classified as an official statement for that claim; reject automatic promotion based solely on Tier A/B. DISPUTED/SOURCE_CONFLICT require an explanation of the competing accounts.

Transaction sequence: authenticate → validate input → read current record → verify expected revision/evidence → conditional `updateMany` on id+revision+status CANDIDATE → require affected count 1 → create audit → rebuild affected public search projection if applicable → commit. A concurrent loser gets CONFLICT; no partial audit. Approval does not publish the containing entity automatically.

New `ReviewAudit`: id, actorId, action, entityType, entityId, previousValue JSON string, nextValue JSON string, reason, createdAt. Never put credentials in snapshots. Treat it as append-only. Rejecting or retracting evidence for public material requires withdrawing/re-reviewing dependent content, not quietly keeping a green label.

After success, invalidate affected detail/collection/search/archive/graph paths and sitemap using installed Next.js APIs. Initially use dynamic public database reads rather than complex caching. Test a publish/withdraw cycle in a production build before adding cache optimization.

## C06. Dates, taxonomy, and structured values

`src/lib/domain/dates.ts` exports `parseHistoricalDate(value: string | null): HistoricalDate` and `formatHistoricalDate(value: HistoricalDate): string`.

```ts
export type HistoricalDate = {
  iso: string | null; precision: 'day' | 'month' | 'year' | 'unknown';
  original: string | null;
};
```

Rules: ISO day stays `YYYY-MM-DD`; known legacy `DD-MM-YYYY` converts to ISO after real calendar validation; `YYYY-MM` and `YYYY` retain partial precision. Missing values become null/unknown; ranges or unparseable values produce an import validation error requiring review, not a guessed date. `03/04/1999` is ambiguous and must be rejected. Unknown end date means “End date not documented,” not “Present.” Use a separately evidenced ongoing flag for ongoing events. Add corresponding date precision fields and preserve originals in import staging. Sort partial dates using a derived lower bound for ordering only, never display an invented January 1.

Canonical domains: `air | land | sea | missile | space-isr | support | unknown`. Mapping: Air→air, Land→land, Sea/Naval→sea, Missiles→missile; unknown labels go to review. Canonical service statuses: `active | retired | under-development | planned | limited | unknown`. Deployed/Active→active describes legacy vocabulary normalization only; it is not re-verification that a historical platform is active today. Retain source date and require review of potentially stale status.

Canonical development models: `indigenous | joint-development | license-produced | imported | mixed | unknown`. Do not infer developmentModel solely from an origin country. Canonical service IDs are separate from domain: army, navy, air-force, coast-guard, tri-service; unknown remains null. Do not infer Army by default.

Canonical Operation categories for this release: `combat | evacuation | humanitarian | peacekeeping | maritime-security | rescue | battle | event | other`. A Battle or Event can use the existing Operation record structure only with its category prominently named; do not call every milestone a military operation. Map existing labels through reviewed import rules (Battle→battle, Naval Battle→battle); ambiguous generic labels produce review issues. Do not infer combat/humanitarian categorization solely from a name.

New specifications contract in `src/lib/domain/equipment.ts`:

```ts
export type EquipmentSpec = {
  key: string; label: string; value: string; numericValue: number | null;
  unit: string | null; context: string | null; evidenceIds: string[];
};
```

Keys are semantic: `max-speed`, `combat-radius`, `ferry-range`, `crew`; never merge the two range concepts. Preserve unfamiliar keys as display-only with a review issue. Numeric comparison is allowed only when key, dimension, variant context, and validated units agree. Missing value displays “Not documented,” never zero. No overall capability score.

## C07. Relationship truth and units

Extend Relationship with `status String @default("CANDIDATE")`, reviewer fields, revision, and `RelationshipEvidence` links to Evidence. Supported initial directed predicates: INCLUDES_OPERATION, PARTICIPATED_IN, COMMANDED, OPERATED_BY, USED_IN, PART_OF, DOCUMENTS. Validate allowed source/target types in `src/lib/domain/relationships.ts`. Every public edge requires GOLD, reviewedAt/by, evidence, and public endpoints. The operation loader must not infer participation from shared conflict membership.

Graph key uses `entityKey`, so identical IDs from different entity types cannot collide. Deduplicate by `(sourceType, sourceId, predicate, targetType, targetId, validFrom, validTo)`, preserving direction and predicate. Keep old many-to-many joins while migrating; no automatic promotion of those joins to evidenced relationships.

New Unit model: id, slug unique, title, summary, content nullable, serviceId nullable, unitType, parentUnitId nullable self-relation, motto nullable, warCry nullable, establishedDate nullable, disbandedDate nullable, plus C03 publication fields. Model ranks/awards using controlled IDs in validated JSON initially, with an explicit service field; do not add dozens of unused relational tables. Unit profiles are canonical `/forces/units/[slug]` pages; modal previews link there. Forces organization summaries stay high-level until individually sourced. No generated insignia.

## C08. Collection query contract

```ts
export type PageResult<T> = {
  items: T[]; page: number; pageSize: number; total: number; totalPages: number;
};
export type CollectionQuery = {
  q: string; page: number; pageSize: 24; sort: 'title-asc' | 'title-desc' | 'date-desc';
  filters: Record<string, string>;
};
```

`parseCollectionQuery(URLSearchParams, allowedFilters)` in `src/lib/domain/query.ts` trims/collapses q whitespace, limits q to 120 characters, uses page=1 for missing/invalid/<1 page, and caps requested page at 10,000 before querying. Page size is fixed at 24. Fetch count, clamp page to available last page (or 1 when empty), then fetch only that page, with stable title/id or date/id ordering. The normalized URL reflects clamping. Invalid filter values return a recoverable “Filter unavailable” state with a clear-all link; they must not silently conceal records.

Next searchParams can contain string arrays. Reject repeated control keys (`q`, `type`, `page`, `domain`, `category`, `serviceStatus`, `items`) with a recoverable invalid-query state/API400; do not cast arrays to strings or let one layer choose a different occurrence than another. Ignore unrelated tracking keys for data filtering. Parse numbers as base10 full-string integers; reject `1e9`, `3abc`, NaN and non-finite input before normalization. Never accept a user-supplied SQL column/sort expression.

DB filtering occurs before `skip/take`. JSON arrays needed for filters should be normalized into indexed join/search-facet tables rather than loaded for every row. Facets reflect the selected query with the facet's own filter omitted. Changing an Arsenal domain clears category if incompatible and resets page to 1. Any filter/search/sort change resets page; pagination preserves everything else. Query key compatibility: continue accepting existing `force`, `use`, `status` aliases, normalize to `domain`, `category`, `serviceStatus`, and redirect once to canonical keys.

Collections default title-asc, except conflict/operation chronology uses date-desc. A list row has at most title, type/service, concise summary, and two relevant facts. Cards/list are presentational views of identical results and ordering.

## C09. Unified search contract

`searchArchive({q, type, page, pageSize})` lives in `src/lib/search/service.ts`. type is `all` or an EntityType; pageSize is 8 for quick search, 24 for full search (internal callers only). API uses `mode=quick|full`; never accepts arbitrary take. It returns PageResult<SearchResult> plus normalized query.

```ts
export type SearchResult = {
  id: string; type: EntityType; slug: string; title: string;
  summary: string; href: string; score: number;
};
```

Trim/collapse query; fewer than 2 characters → successful empty results. More than 120 characters → HTTP 400 with `INVALID_QUERY`. Unknown type → 400. Matching is case-insensitive against normalized title, aliases, summary and body. Literal `%` and `_` must not become unintended wildcard expansion. Initial scoring: exact title 100, exact alias 95, title prefix 80, alias prefix 75, title contains 60, alias contains 55, summary contains 30, body contains 10. Use the highest matching score per entity; tie-break normalized title then typed ID. Do not rank by table concatenation.

Use a SearchDocument projection with unique `(entityType, entityId)`, slug/title/titleNormalized/summary/summaryNormalized/bodyNormalized and a child SearchAlias table. Parameterized SQL computes score/count/order/pagination in SQLite; enumerate table/column names in code, never accept them from user input. Publish/withdraw transactions synchronize the projection. Recheck public entity hydration; reconciliation detects stale projection rows and fails validation. Default quick/full results must have the same first eight entries.

The API returns `{results, page, pageSize, total, totalPages, query}` so the existing dialog's `results` field remains supported. Failures return 503 + `{error:{code:'SEARCH_UNAVAILABLE', message:'Search is temporarily unavailable.'}}`; no stack/SQL. Alias/query work is inside the error boundary.

Dialog states: idle, debouncing, loading, results, empty, error. Start debouncing immediately when typing; retain no misleading empty message during waiting. Use AbortController plus request sequence IDs. For combobox behavior: arrows change active option, Enter opens selected result, Escape closes, Tab follows normal focus; use correct combobox/listbox naming and active descendant. Clear short queries and reset loading. Closing cancels pending work. Full search remains a GET form and works without JS.

## C10. Visual and interaction defaults

- Root navigation: Explore (`/`), History (`/conflicts`), Forces & people (`/forces`), Equipment & technology (`/arsenal`), Knowledge & sources (`/archive`). Each can expose existing secondary links; mobile disclosure lists all primary collections including Operations and Heroes. Graph is secondary.
- Global plain wording: “Search Indian defence”, “Sources & documents”, “Related topics”, “Reviewed on”. No public “Golden Dataset”, “Connected Node”, “Command”, or “Official documentation” when the linked source is not official.
- Main body 16px minimum, default 18px on article pages; line-height 1.65; narrative max-width 72ch. Use sentence case. Metadata at least 12px; never hide an essential fact solely in a tooltip.
- Root main uses one normal page container; individual articles do not nest full container padding repeatedly. One h1 per page, one main landmark, skip link to `#main-content`.
- Palette: background #0B1017, surface #141C27, elevated #1B2635, primary text #F0F4F8, secondary text #B7C3D2, accent #73D79A, border #3A4B60. These are implementation starting tokens; verify actual composited states. Define all Base UI/Tailwind tokens, including input/popover/accent/destructive/secondary and foreground partners.
- No persistent global scanner, animated grid, or scrambling essential text. Under reduced motion, disable decorative transitions, auto-scroll/fly-to, and smooth scrolling.
- Page state belongs in URLs when readers may share it: collection filters/page/view; Forces service/tab; conflict event/view; comparison items. Invalid event IDs fall back to overview with no crash.
- Default conflict detail is normal document flow. `view=explorer` enables the larger explorer; below 1024px use one pane with accessible Timeline/Account/Map controls. No fixed 800px stacked reading layout.
- Honest empty states include a next action: clear filters, browse a related collection, retry, or sources overview. No fake replacement content.
- Initial dark reading experience is required. Optional light theme is Phase D; no unimplemented theme switch.

## C11. Maps, graph, media, comparison, metadata

Maps load only after “Show map” is activated. Provide a text list before map activation. Preserve attribution, captured source, location precision, and as-of date. Default missing coordinates produce a text message, not a misleading zoomed marker. No automatic map requests on unrelated pages. Simplified GeoJSON target <=1 MB uncompressed; retain original source/license in a manifest outside the served default asset if needed. Validate geometry/bounds/feature names after simplification. Choose regional/historical precision when exact detail adds no educational value.

`GET /api/graph?type=Conflict&id=...` returns at most 100 public nodes and 200 evidenced directed edges for a one-hop neighborhood, plus `truncated`. No seed → 400 `SEED_REQUIRED`; non-public seed →404. Graph data includes predicate and date range. Graph UI must also show navigable relationships as text and a retry state. Expand from a selected neighbor through a new bounded request.

Media DTO requires src, alt, caption, credit, sourceUrl, license/rights note. No random stock photo implying it depicts a specific conflict. Use local approved images or explicit image-host allowlists with next/image dimensions. Label illustrative diagrams. Meaningful media can be absent when rights/content are unavailable.

Comparison canonical URL: `/compare?items=slug-a,slug-b` with 2–3 unique public equipment slugs. Zero items shows an actionable selection guide; one item shows it plus an add-system prompt; >3 unique items → recoverable validation message, not silent truncation. Missing/non-public items are described as unavailable without disclosing hidden metadata. Comparison never uses unknown as zero or ranks capability by color. Same-key but different variant/context measures remain separately labeled and unranked.

Metadata uses actual public title/summary and canonical path. Sitemap excludes draft/demo/withdrawn/admin/query variants. Supply `SITE_URL` for production absolute URLs; missing production value fails config validation. Local development uses a documented local origin. Build/tests set their own explicit origin. Auth and admin routes emit noindex. Custom 404 offers search and browse; error boundaries expose retry without stack traces.

## C12. Version-specific reference policy

Read the relevant installed `node_modules/next/dist/docs/` guide before each routing/data/auth/metadata change. For Prisma 5, consult installed CLI help before copying a migration command; newer Prisma web documentation uses different flags. Do not upgrade Prisma to match an online example. Keep JS client/CLI on the same version and isolate Python generator setup from normal JS builds.

References checked while writing the plan: [Next.js authentication](https://nextjs.org/docs/app/guides/authentication), [Auth.js](https://authjs.dev/), [Playwright server isolation](https://playwright.dev/docs/test-webserver), [Prisma baselining concept](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/baselining). The linked Prisma page explains the concept; T03 commands target installed Prisma 5 and must be checked against its help. The installed Next.js testing guides recommend E2E coverage for asynchronous server components.

## C13. Exact supporting model fields and indexes

Implement the following additions in T03. These are schema instructions, not migrations to paste over the entire existing schema. Keep all existing models/fields until their data has been reconciled. SQLite stores the JSON payload columns as strings; application validation is mandatory.

```prisma
model ReviewAudit {
  id            String   @id @default(uuid())
  actorId       String
  action        String
  entityType    String
  entityId      String
  previousValue String
  nextValue     String
  reason        String
  createdAt     DateTime @default(now())
  @@index([entityType, entityId, createdAt])
}

model ImportRun {
  id          String   @id @default(uuid())
  inputHash   String   @unique
  schemaVersion Int
  status      String
  reportJson  String
  createdAt   DateTime @default(now())
  proposals   ImportProposal[]
}

model ImportIdentity {
  id           String @id @default(uuid())
  sourceSystem String
  externalId   String
  entityType   String
  entityId     String
  @@unique([sourceSystem, externalId, entityType])
  @@index([entityType, entityId])
}

model ImportProposal {
  id               String   @id @default(uuid())
  importRunId      String
  entityType       String
  entityId         String
  expectedRevision Int
  proposedDataJson String
  originalDataJson String
  issuesJson       String
  status           String   @default("CANDIDATE")
  createdAt        DateTime @default(now())
  run              ImportRun @relation(fields: [importRunId], references: [id])
  @@unique([importRunId, entityType, entityId])
}

model EntityEvidence {
  id         String @id @default(uuid())
  entityType String
  entityId   String
  section    String
  evidenceId String
  evidence   Evidence @relation(fields: [evidenceId], references: [id])
  @@unique([entityType, entityId, section, evidenceId])
}

model RelationshipEvidence {
  relationshipId String
  evidenceId     String
  relationship   Relationship @relation(fields: [relationshipId], references: [id])
  evidence       Evidence @relation(fields: [evidenceId], references: [id])
  @@id([relationshipId, evidenceId])
}

model SearchDocument {
  id                String @id // entityKey(ref)
  entityType        String
  entityId          String
  slug              String
  title             String
  titleNormalized   String
  summary           String
  summaryNormalized String
  bodyNormalized    String
  entityRevision    Int
  aliases           SearchAlias[]
  @@unique([entityType, entityId])
  @@index([entityType, titleNormalized, id])
}

model SearchAlias {
  id              String @id @default(uuid())
  documentId      String
  normalizedAlias String
  document        SearchDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)
  @@unique([documentId, normalizedAlias])
  @@index([normalizedAlias])
}

model EntityFacet {
  entityType String
  entityId   String
  name       String // serviceId, awardId, category, conflictId
  value      String
  @@id([entityType, entityId, name, value])
  @@index([entityType, name, value, entityId])
}
```

Add inverse `entityEvidence EntityEvidence[]` and `relationshipEvidence RelationshipEvidence[]` to Evidence; add `evidence RelationshipEvidence[]` to Relationship. Add `normalizedAlias String?` to existing EntityAlias during migration; backfill before enforcing required/unique normalized aliases in a later inspected migration. Add `fingerprint String? @unique` to Relationship; its value is SHA-256 of a canonical tuple including type/id/predicate/endpoints and explicit null dates. Exact duplicate candidates are reported and consolidated only after preserving evidence links.

Unit includes the C07 fields plus `parent Unit? @relation("UnitHierarchy", fields:[parentUnitId], references:[id])` and `children Unit[] @relation("UnitHierarchy")`. Validate no parent cycles, including indirect cycles, before publication. Publication-aware indexes for every entity: `(publicationStatus, contentKind, title, id)`. Source and Unit need `summary String @default("")` for consistent DTOs. Equipment gains `variantLabel String?` and `statusAsOf String?`; dates are source-backed. Add `dateStartPrecision/dateEndPrecision String @default("unknown")` to Conflict/Operation, and birthDatePrecision/deathDatePrecision to Person.

Publication validator reads candidate data through an authenticated/internal service; it must not call a public-only getter to validate an unpublished subject. Publish **sources first**, then evidenced entities, then public relationships. Source publication requires reviewed bibliographic identity, usable document/version/locator metadata, source classification, and rights notes; it does not require a second external source proving its own existence. For other entities, narrative summary/content require section evidence; candidate relationships can remain internal and do not prevent publishing a valid entity with no public relationships. Only public relationships require both endpoints already public. This avoids circular publication dependencies.

### Applying an existing-record import proposal

T09 also supplies `reviewEntityProposal({proposalId, expectedRevision, decision, reason})` in `src/lib/review/service.ts` and a small proposal diff card in the review queue. On approval: authenticate; parse allowlisted proposedDataJson; verify current revision; validate evidence and content; update allowed content fields; set the entity publicationStatus to IN_REVIEW and clear reviewedAt/by; increment revision; mark proposal accepted; append audit; remove search projection; commit atomically. This deliberately withdraws the changed revision pending a separate publishEntity review. Never silently preserve PUBLISHED after modifying reviewed content. Rejection retains the old published entity unchanged and records the rejected proposal/audit. Add AUTH-08 tests for approve/reject/stale proposal and failure rollback.

## C14. Helper interfaces and error semantics

Define shared DTOs in `src/lib/domain/types.ts` and import them instead of repeating slightly different versions:

```ts
export type ValidationIssue = {
  code: string; path: string; message: string; severity: 'error' | 'warning';
};
export type CollectionItem = EntityRef & {
  slug: string; title: string; summary: string; href: string;
  facts: Array<{ label: string; value: string }>;
};
export type PublicEvidence = {
  id: string; locator: string; sourceId: string; sourceTitle: string;
  publisher: string; versionTag: string; sourceHref: string;
  originalUrl: string | null; archiveUrl: string | null; quote: string | null;
};
export type PublicClaim = {
  id: string; property: string; value: string;
  verificationStatus: VerificationStatus; editorialExplanation: string | null;
  evidence: PublicEvidence[];
};
export type PublicRelationship = {
  id: string; source: EntityRef; target: EntityRef; predicate: string;
  validFrom: string | null; validTo: string | null;
  sourceTitle: string; targetTitle: string; sourceHref: string; targetHref: string;
  evidence: PublicEvidence[];
};
export type ImportReport = {
  inputHash: string; mode: 'validate' | 'dry-run' | 'apply';
  creates: number; updates: number; unchanged: number; proposals: number;
  issues: ValidationIssue[];
};
```

EntityRef/VerificationStatus are imported from C02/C04 modules; these snippets are not standalone files with implicit globals. All returned errors are typed and user-facing wording is separate from diagnostic logs. Do not log source bodies/credentials in generic exception handlers.

Wrapper argument forwarding: `scripts/run-integration-tests.ts` passes `process.argv.slice(2)` after `vitest run --config vitest.integration.config.mts`; E2E wrapper does the same after `playwright test`. This makes task commands such as `npm run test:integration -- tests/integration/search.test.ts` execute the named file. Reject unexpected wrapper options rather than interpolating arguments into a shell; use `spawn` with an argument array and `shell:false`.

Repository facade return types may specialize CollectionItem with dates/specs/etc. Every field is explicit and validated. A public read encountering malformed persisted JSON throws a recoverable server error and records a validation issue; it never returns a fabricated empty value that hides corruption. Empty source/claim arrays for genuinely absent optional data remain normal.

## C15. External setup checklist for editor integration

T08 can implement the denied/configured branches without credentials. To complete its real-provider gate, the operator supplies a standard OIDC application with issuer URL, client ID, client secret, and a test editor account. The executor documents the chosen library release and its exact callback path before the operator registers it. For the generic provider ID `sentinel-oidc`, the expected Auth.js callback is `/api/auth/callback/sentinel-oidc`; verify against the installed release. Register the task's local test origin and, only during a later deployment task, the production origin. Never use wildcard callback URLs.

Use the provider's discovery metadata rather than guessed authorize/token endpoints. Set a strong application secret in the local secret store/environment without committing or printing it. Configure EDITOR_SUBJECTS with the provider-verified issuer/subject; do not paste an access token into that variable. Session callbacks retain only identity fields needed by requireEditor, never provider refresh/access tokens in browser-visible session data. Sign-in failure returns an understandable error without exposing provider response bodies.

Real verification order: anonymous deny → configured sign-in → non-editor deny → allowlisted editor success → remove allowlist entry and confirm next action denies → sign-out and confirm deny → invalid/expired callback/session denial. Verify redirects cannot navigate to arbitrary external return URLs. Provider availability failures keep existing public browsing usable and deny admin mutations. The external account/callback/secret prerequisites are not marked complete by unit mocks.
