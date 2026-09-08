# SENTINEL — Master Product, UX, Content & Build Specification

## Current implementation authority — 6 September 2026

This document preserves the long-term product vision. For the existing working codebase, execute [the recovery implementation plan](docs/implementation-plan.md), using [shared contracts](docs/implementation-contracts.md), [test gates](docs/test-plan.md), and [data/editorial procedures](docs/content-operations.md). Current status is in [progress_tracker.md](progress_tracker.md).

The runbook supersedes conflicting implementation details below: Markdown-only runtime assumptions, old route names, version labels, automatic source-tier truth, destructive seeding, or roadmap checkboxes. Keep SQLite/Prisma and the current Next.js app for recovery; do not prematurely migrate to Postgres, add a graph database, or implement automated crawling merely because a later vision section mentions them. Source/claim review and the publication boundary are required now. UI shells are not complete features. Future phases are described separately in T28.

Document precedence: current user/AGENTS instructions → implementation contracts → ordered task plan → test/content runbooks → dated review evidence → compatible long-term guidance here. The documentation update itself implements no application tasks. Begin with T00; do not rerun an old embedded initial-build prompt against the existing workspace.

---

> **Status:** Build-ready master specification  
> **Purpose:** Single source of truth for an AI coding agent building SENTINEL from a new or early-stage repository.  
> **Project type:** Public, educational, source-first interactive archive of Indian military history, personnel, operations, formations and publicly documented equipment.  
> **Primary experience:** Cinematic intelligence-archive aesthetic with excellent mainstream usability.  
> **Core rule:** The spy-movie visual language is the presentation layer. Accuracy, readability, sourcing and respectful storytelling are the product.

---

# 0. AGENT INSTRUCTIONS — READ THIS FIRST

You are building **SENTINEL**, a source-first interactive digital archive of Indian defence history.

Before writing code:

1. Read this entire file once.
2. Inspect the existing repository before changing anything.
3. If the repository already contains patterns that satisfy this spec, reuse them instead of replacing them.
4. Create an implementation plan in `docs/implementation-plan.md`.
5. Work in small, reviewable vertical slices.
6. Prefer simple, explicit code over abstractions that are not yet needed.
7. Use test-driven development for data validation, search, filtering and critical UI behaviors.
8. After each major slice, run lint, type-check, tests and a production build.
9. Do not claim a feature is complete until it is actually accessible through the UI and tested.
10. Do not silently invent historical facts, specifications, quotations, casualty figures, operational claims or sources.
11. All sample historical content must be clearly marked as seed/demo content unless its citation has been verified.
12. Never create present-day operational tracking, precise sensitive deployment mapping or vulnerability analysis.
13. Prefer publicly acknowledged historical facts and public specifications.
14. Keep source links first-class throughout the product.

## Recommended agent workflow

If the coding environment supports reusable skills/workflows, prefer:

- brainstorming / product-design review before changing the product direction;
- writing-plans before implementation;
- subagent-driven development for independent UI/data tasks;
- test-driven-development for data and behavior;
- systematic-debugging for failures;
- requesting-code-review before large merges;
- verification-before-completion before declaring the project finished.

Do not repeatedly re-read this full specification in every task. Extract the relevant section into the task context when dispatching subagents.

---

# 1. PRODUCT DEFINITION

## 1.1 Product name

**SENTINEL**

Preferred descriptor:

> **Indian Defence Archive**

Preferred positioning statement:

> SENTINEL is a source-first interactive digital archive of India's military history, connecting conflicts, operations, people, units and technology through maps, timelines, dossiers and verified public sources.

SENTINEL is **not**:

- an official Government of India website;
- a breaking-news portal;
- a political advocacy website;
- a fan wiki;
- a weapons marketplace;
- an operational-intelligence tracker;
- a simulation game;
- a social network.

The interface must clearly state:

> **Independent educational archive. Not an official Government of India or Armed Forces website.**

---

# 2. PRODUCT PRINCIPLES

Every product decision should be checked against these principles.

## P1 — Source before spectacle

Every material factual claim should be traceable to a credible source.

The interface should make verification easy rather than burying references in a footer.

## P2 — Stories over databases

A database answers *what*.  
SENTINEL should also answer:

- why it mattered;
- where it fits;
- who was involved;
- what happened before and after;
- how the claim is known.

## P3 — Connected knowledge

Users should be able to move naturally between:

**Conflict → operation → battle/event → location → unit → person → equipment → source**

Do not expose every relation as a graph by default. The graph is a discovery tool, not the primary navigation.

## P4 — Respect over gamification

War, injury and death are not game mechanics.

Avoid:

- kill counters;
- celebratory casualty animations;
- achievement badges;
- "win rate" scores;
- flashy victory effects;
- leaderboards;
- star ratings for military capability.

## P5 — Cinematic, not gimmicky

Target:

> **85% modern premium editorial UI + 15% intelligence-system visual language**

Avoid:

- Matrix-green screens;
- constant glitch effects;
- unreadably small mono text;
- excessive HUD circles;
- loud warning banners;
- fake hacking sequences;
- sound on routine interactions.

## P6 — Progressive disclosure

A newcomer should understand every major page without military knowledge.

A defence enthusiast should be able to drill much deeper.

## P7 — Public history, not operational intelligence

Do not aggregate information into current sensitive military intelligence.

The site may cover public historical deployments and officially public current high-level information, but should not create:

- live unit tracking;
- sensitive facility maps;
- exact current troop dispositions;
- current ammunition or storage locations;
- exploitable vulnerability analysis;
- routes, schedules or procedures that enable harm.

---

# 3. TARGET USERS

## 3.1 Curious citizen

Knows little about military history and wants a simple explanation.

Needs:

- plain English;
- quick summaries;
- maps;
- timelines;
- "why this matters";
- definitions for military terminology.

## 3.2 Student

Needs:

- chronological understanding;
- credible sources;
- citations;
- reading lists;
- context.

## 3.3 Defence enthusiast

Needs:

- deeper data;
- unit links;
- equipment specs;
- comparisons;
- operations;
- technical metadata;
- source provenance.

## 3.4 Research-oriented reader

Needs:

- original sources where legally/publicly available;
- source classifications;
- notes about disputed claims;
- filters;
- structured relationships.

---

# 4. V1 SCOPE

Do **not** attempt to populate the entire history of Indian defence before the UX is proven.

Build a polished vertical slice first.

## V1 required content coverage

### History
Create polished templates and a small seed dataset for:

- 1947–48 Indo-Pakistani War
- 1962 Sino-Indian War
- 1965 Indo-Pakistani War
- 1971 Indo-Pakistani War / Bangladesh Liberation War
- 1999 Kargil War

### Flagship deep experience
**Kargil 1999 / Operation Vijay**

This is the primary demonstration of the final product vision.

### People
Seed 12–20 profiles spread across periods and services.

### Operations
Seed 10–15 historically/publicly documented operations.

### Arsenal
Seed roughly 30 representative systems across:

- land;
- air;
- sea;
- missiles;
- ISR / support where appropriate.

### Forces
Provide a clear high-level structure for:

- Indian Army;
- Indian Navy;
- Indian Air Force;
- publicly documented specialist units as a separate subsection.

### Archive
Seed at least 25 source records so the source UX is meaningful.

---

# 5. PRIMARY INFORMATION ARCHITECTURE

The global navigation must have only these six primary destinations:

1. **HISTORY**
2. **PEOPLE**
3. **OPERATIONS**
4. **ARSENAL**
5. **FORCES**
6. **ARCHIVE**

Global utilities:

- Search
- About
- Methodology
- Sources
- Accessibility / reduced-motion preference if needed

Do not put every category in the top navigation.

---

# 6. ROUTE MAP

Use a route structure similar to:

```text
/
├── /history
│   ├── /history/[conflict-slug]
│   └── /history/[conflict-slug]/[event-slug]
│
├── /people
│   └── /people/[person-slug]
│
├── /operations
│   └── /operations/[operation-slug]
│
├── /arsenal
│   └── /arsenal/[system-slug]
│
├── /forces
│   ├── /forces/army
│   ├── /forces/navy
│   ├── /forces/air-force
│   └── /forces/[formation-or-unit-slug]
│
├── /archive
│   └── /archive/[source-slug]
│
├── /compare
│   └── /compare?items=...
│
├── /search
│
├── /methodology
├── /editorial-policy
├── /about
└── /not-found
```

The URL must be human-readable and stable.

---

# 7. CORE USER JOURNEYS

## Journey A — "I know almost nothing"

1. User lands on homepage.
2. Sees a clean India/topographic visual.
3. Chooses **Explore History**.
4. Sees chronological timeline.
5. Opens Kargil.
6. Reads a 90-second overview.
7. Scrubs a simple timeline.
8. Clicks Tiger Hill.
9. Discovers relevant units and people.
10. Opens a person's profile.
11. Opens a citation/source.

Success criterion:

> A beginner understands the relationship among war, operation, battle, unit and person without needing external explanation.

## Journey B — "I came for a hero"

1. Search a person's name.
2. Open profile.
3. View short biography.
4. View service/unit.
5. View campaign/event timeline.
6. Read verified account.
7. View awards/citations.
8. Open primary and secondary sources.
9. Explore related people/operations.

## Journey C — "I came for equipment"

1. Open Arsenal.
2. Filter to Air → Fighters.
3. Open a system.
4. Understand its role before technical specifications.
5. View Indian service history.
6. View related weapons/sensors/platforms only when publicly documented.
7. Compare with another Indian-service system.
8. Open manufacturer/government sources.

## Journey D — "I want to research"

1. Open Archive.
2. Filter by period/type/source class.
3. Search source title or connected event.
4. Open source record.
5. See provenance, publisher, date, source tier and linked entities.
6. Follow the original external source.

## Journey E — "I want to wander"

1. Open any entity.
2. Scroll to **Connections**.
3. Select another connected entity.
4. Continue navigating without losing context.
5. Use breadcrumbs/back navigation to return.

---

# 8. HOME PAGE SPECIFICATION

The homepage should feel restrained and cinematic.

## 8.1 Above the fold

Required elements:

- SENTINEL wordmark
- subtitle: `INDIAN DEFENCE ARCHIVE`
- brief one-line positioning statement
- low-contrast topographic / relief-inspired India backdrop
- one focal coordinate/location marker
- primary CTA: `ENTER THE ARCHIVE`
- secondary CTA: `EXPLORE HISTORY`
- global search affordance

Example composition:

```text
S E N T I N E L
INDIAN DEFENCE ARCHIVE

A source-first interactive archive of
India's military history.

                ○ KARGIL
                34.55° N
                76.13° E

          [ ENTER THE ARCHIVE ]

1947 ━━━ 1962 ━━━ 1965 ━━━ 1971 ━━━ 1999
```

Do not overload the hero with stats.

## 8.2 From the Archive

Display one editorial story card.

Fields:

- date;
- location;
- story title;
- 1–2 line intro;
- associated entity;
- source count;
- CTA.

## 8.3 Explore section

Six simple portal cards:

- History
- People
- Operations
- Arsenal
- Forces
- Archive

## 8.4 Featured timeline strip

A horizontal timeline of key periods.

It should be usable on touch devices and collapse gracefully on mobile.

## 8.5 Editorial trust block

Near the lower part of the homepage:

> **Every story should lead back to evidence.**

Explain source tiers and display a link to methodology.

---

# 9. HISTORY EXPERIENCE

## 9.1 History landing page

Views:

- default chronological timeline;
- optional grid by conflict;
- optional filter by service/theatre.

Do not build complicated map controls here.

Each conflict card contains:

- title;
- years;
- short description;
- theatre;
- services involved;
- source count;
- representative visual.

## 9.2 Conflict page anatomy

Required order:

1. Title and date range
2. 90-second summary
3. "Why it happened"
4. High-level outcome
5. Interactive timeline
6. Theatre map
7. Operations/events
8. People
9. Units
10. Equipment
11. Source-backed disputed claims if applicable
12. Sources / further reading
13. Connections

Use a sticky compact metadata rail on desktop only if it improves navigation.

---

# 10. FLAGSHIP: KARGIL "WAR ROOM"

This is the flagship experience and should receive disproportionate polish.

It must **not** feel like a game.

## 10.1 Layout

Desktop:

```text
┌────────────────────────────────────────────────────┐
│ KARGIL / 1999                                      │
│ OPERATION VIJAY                                    │
├───────────────────────────────┬────────────────────┤
│                               │                    │
│           MAP                 │ EVENT / DOSSIER    │
│                               │                    │
│                               │                    │
├───────────────────────────────┴────────────────────┤
│ MAY ━━━━━ JUN ━━━━━ JUL                         │
└────────────────────────────────────────────────────┘
```

Mobile:

- map becomes a contained card;
- timeline becomes horizontal swipe;
- event dossier appears below;
- no tiny floating HUD controls.

## 10.2 Behavior

Timeline events control map state.

Selecting an event:

- highlights relevant map marker;
- opens concise event dossier;
- reveals connected people/units;
- shows source count.

## 10.3 Required timeline model

Each event contains:

```ts
type TimelineEvent = {
  id: string
  slug: string
  title: string
  dateStart: string
  dateEnd?: string
  summary: string
  latitude?: number
  longitude?: number
  significance?: string
  sourceIds: string[]
  personIds?: string[]
  unitIds?: string[]
  equipmentIds?: string[]
}
```

## 10.4 Map limitations

Use coarse/historical coordinates suitable for educational visualization.

Do not create sensitive current operational maps.

## 10.5 Accessibility fallback

Every interactive timeline/map experience must have a textual chronological list that contains equivalent information.

---

# 11. PEOPLE / HALL OF VALOUR

## 11.1 People landing

Filters:

- service;
- conflict/operation;
- award;
- era;
- alphabetical search.

Do not rank people.

## 11.2 Profile anatomy

Required:

- name;
- portrait if legally usable;
- rank at relevant period;
- service;
- unit;
- lifespan where relevant/public;
- award(s);
- short overview;
- story;
- chronological service/event timeline;
- verified quotations only;
- associated operations;
- related people;
- source citations;
- media attribution.

## 11.3 Tone

Use solemn editorial design for casualties and posthumous awards.

Avoid visual effects such as:

- exploding particles;
- celebratory confetti;
- aggressive "mission accomplished" labels.

---

# 12. OPERATIONS

Operations are not synonymous with wars.

Support categories such as:

- combat;
- evacuation;
- humanitarian assistance/disaster relief;
- peacekeeping;
- maritime security;
- rescue;
- other publicly documented military operations.

Operation cards should show category clearly.

Operation page fields:

- title;
- date/date range;
- category;
- objective;
- context;
- services involved;
- theatre/location;
- outcome;
- timeline;
- related conflicts;
- people;
- units;
- equipment;
- sources.

---

# 13. ARSENAL

## 13.1 Arsenal landing

Primary exploration:

### AIR
- Fighters
- Transport
- Helicopters
- Trainers
- UAV/UAS
- AEW&C / ISR where publicly documented

### LAND
- Main battle tanks
- Armoured vehicles
- Artillery
- Air defence
- Engineering/support
- Small arms — overview-level only

### SEA
- Aircraft carriers
- Destroyers
- Frigates
- Corvettes
- Submarines
- Patrol/support vessels

### MISSILES
- Surface-to-air
- Air-to-air
- Cruise
- Ballistic
- Anti-tank
- Anti-ship

## 13.2 Equipment page anatomy

Order:

1. Name
2. Hero visual
3. Plain-English role
4. Status
5. Service/operator
6. Origin/development model
7. Why it matters in Indian service
8. Service history
9. Major public specifications
10. Variants in Indian service
11. Related systems
12. Operational/public historical usage
13. Sources
14. Comparison CTA

## 13.3 Technical data

Never include a technical value without a source.

If credible sources disagree:

```text
Range
Source A: X
Source B: Y
Status: PUBLIC SOURCES DIFFER
```

Do not silently choose the most impressive number.

## 13.4 Procurement/development badges

Use normalized badges:

- `INDIGENOUS`
- `JOINT DEVELOPMENT`
- `LICENSE PRODUCED`
- `IMPORTED`
- `UNDER DEVELOPMENT`
- `RETIRED`

Avoid political slogans.

---

# 14. COMPARE EXPERIENCE

Maximum 3 systems in V1.

Comparison rules:

- compare like-for-like where possible;
- explain when metrics are not directly comparable;
- never generate a single "winner";
- no star ratings;
- no fictional combat outcomes.

Comparison groups:

- role;
- service;
- induction;
- crew;
- dimensions;
- propulsion;
- public performance specs;
- sensors;
- armament categories;
- origin/development;
- status.

Every row should expose source references.

---

# 15. FORCES

Purpose: teach organization without overwhelming the reader.

## 15.1 Top-level

Explain:

- Army
- Navy
- Air Force

Provide:

- role;
- command structure at a high level;
- key publicly documented formations/commands;
- insignia only when legally appropriate and sourced.

## 15.2 Specialist formations

Create a carefully worded section for publicly documented special/specialist units.

Do not publish:

- current sensitive base locations;
- readiness details;
- tactics/procedures;
- exploitable training specifics;
- current deployment data.

---

# 16. ARCHIVE

The Archive is a first-class product, not a references page.

## 16.1 Archive landing

Search and filter by:

- era;
- source type;
- publisher;
- source tier;
- connected entity;
- conflict;
- service.

Source types include:

- official webpage;
- official report;
- government publication;
- parliamentary record;
- gallantry citation;
- speech;
- press release;
- academic work;
- book;
- reputable news report;
- photograph;
- map;
- interview;
- video;
- other.

## 16.2 Source detail page

Display:

- title;
- publisher;
- author if known;
- publication date;
- accessed date;
- source type;
- source tier;
- URL;
- archive URL if legally appropriate;
- summary;
- notes;
- linked entities;
- quotation snippets only within copyright limits;
- external CTA.

Do not mirror copyrighted articles.

---

# 17. SOURCE & EDITORIAL SYSTEM

## 17.1 Source tiers

### Tier A — Primary / authoritative
Examples:

- Government of India
- Ministry of Defence
- Indian Army
- Indian Navy
- Indian Air Force
- Press Information Bureau
- Parliament records
- National Archives
- official gallantry-award citations
- official commission/report material

### Tier B — Institutional / first-party technical
Examples:

- DRDO
- HAL
- BEL
- official manufacturers
- UN records
- relevant foreign-government archives
- official military histories

### Tier C — High-quality secondary
Examples:

- academic journals
- established historians
- reputable books
- major reputable news organizations

### Tier D — Specialist secondary
Examples:

- established specialist defence publications
- credible specialist historical archives

### Discovery-only
May be used to discover leads but should not establish material claims alone:

- social posts;
- forums;
- random blogs;
- unsourced videos;
- crowd-edited pages.

## 17.2 Claim verification states

Use:

- `OFFICIALLY_CONFIRMED`
- `MULTIPLE_CREDIBLE_SOURCES`
- `DISPUTED`
- `UNVERIFIED`
- `DECLASSIFIED_RECORD`
- `SOURCE_CONFLICT`

Do not display `UNVERIFIED` as if it were fact.

## 17.3 Claim model

```ts
type Claim = {
  id: string
  text: string
  entityType: EntityType
  entityId: string
  verificationStatus: VerificationStatus
  sourceIds: string[]
  editorialNote?: string
}
```

## 17.4 Citation interaction

Inline citation:

```text
Indian forces recaptured [location] on [date]. [3]
```

Hover/tap:

```text
SOURCE 03

[Publisher]
[Source title]

SOURCE TIER
A — PRIMARY

VERIFICATION
OFFICIALLY CONFIRMED

[OPEN SOURCE]
```

On touch, use a bottom sheet rather than hover-only UI.

---

# 18. CONTENT DATA MODEL

For V1, keep content in version-controlled structured files.

Recommended:

```text
/content
  /conflicts
  /events
  /operations
  /people
  /units
  /equipment
  /sources
  /stories
```

Use Markdown/MDX for long narrative content plus YAML/JSON/TS frontmatter or sidecar metadata.

Avoid introducing a CMS in the first implementation unless the repository already has one.

## 18.1 Shared entity fields

```ts
type EntityBase = {
  id: string
  slug: string
  title: string
  shortTitle?: string
  summary: string
  status: "draft" | "reviewed" | "published"
  sourceIds: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}
```

## 18.2 Conflict

```ts
type Conflict = EntityBase & {
  type: "conflict"
  dateStart: string
  dateEnd?: string
  theatres: string[]
  serviceIds: string[]
  operationIds: string[]
  eventIds: string[]
  personIds: string[]
  unitIds: string[]
  equipmentIds: string[]
  outcomeSummary?: string
  contextSummary?: string
}
```

## 18.3 Person

```ts
type Person = EntityBase & {
  type: "person"
  fullName: string
  serviceId: string
  rank?: string
  unitIds: string[]
  awardIds?: string[]
  birthDate?: string
  deathDate?: string
  operationIds?: string[]
  conflictIds?: string[]
  eventIds?: string[]
  portrait?: MediaRef
}
```

## 18.4 Operation

```ts
type Operation = EntityBase & {
  type: "operation"
  category:
    | "combat"
    | "evacuation"
    | "humanitarian"
    | "peacekeeping"
    | "maritime-security"
    | "rescue"
    | "other"
  dateStart: string
  dateEnd?: string
  serviceIds: string[]
  conflictIds?: string[]
  eventIds?: string[]
  personIds?: string[]
  unitIds?: string[]
  equipmentIds?: string[]
}
```

## 18.5 Equipment

```ts
type Equipment = EntityBase & {
  type: "equipment"
  domain: "air" | "land" | "sea" | "missile" | "space-isr" | "support"
  category: string
  serviceIds: string[]
  manufacturerIds?: string[]
  originCountries: string[]
  developmentModel:
    | "indigenous"
    | "joint-development"
    | "license-produced"
    | "imported"
    | "mixed"
  serviceStatus:
    | "active"
    | "retired"
    | "under-development"
    | "planned"
    | "limited"
  inductedYear?: number
  retiredYear?: number
  variants?: string[]
  specs: EquipmentSpec[]
}
```

## 18.6 Equipment specification

```ts
type EquipmentSpec = {
  key: string
  label: string
  value: string
  unit?: string
  sourceIds: string[]
  note?: string
}
```

## 18.7 Unit

```ts
type Unit = EntityBase & {
  type: "unit"
  serviceId: string
  unitType: string
  parentUnitId?: string
  historicalOnly?: boolean
}
```

## 18.8 Source

```ts
type SourceRecord = {
  id: string
  slug: string
  title: string
  publisher: string
  author?: string
  publishedAt?: string
  accessedAt: string
  url: string
  archiveUrl?: string
  sourceType:
    | "official-webpage"
    | "official-report"
    | "parliament"
    | "gallantry-citation"
    | "press-release"
    | "academic"
    | "book"
    | "news"
    | "photo"
    | "map"
    | "interview"
    | "video"
    | "other"
  tier: "A" | "B" | "C" | "D" | "DISCOVERY"
  summary?: string
  notes?: string
}
```

## 18.9 Media

```ts
type MediaRef = {
  src: string
  alt: string
  caption?: string
  credit?: string
  sourceUrl?: string
  license?: string
}
```

---

# 19. REFERENTIAL INTEGRITY

Create a build-time validation script.

It must fail CI if:

- an entity references a missing source ID;
- an entity references a missing person/unit/equipment/event;
- slugs collide;
- source IDs collide;
- a public page has zero sources;
- an equipment spec has zero sources;
- media has no alt text;
- publication status is invalid.

Suggested command:

```bash
npm run validate:content
```

Create clear failures such as:

```text
content/equipment/rafale.mdx
ERROR: spec "combat-radius" references unknown source "src-rafale-09"
```

This validation is mandatory.

---

# 20. SEARCH

Search is a major navigation mode.

V1 should support:

- title;
- aliases;
- summary;
- tags;
- category;
- connected conflict/operation names.

Preferred behavior:

```text
> tiger hill

LOCATION
Tiger Hill

EVENT
Battle of Tiger Hill

CONFLICT
Kargil War

OPERATION
Operation Vijay

PEOPLE
[related names]

ARCHIVE
[related source records]
```

Implementation:

- use a lightweight local/static index for V1;
- do not add Elasticsearch/Algolia unless scale later requires it.

Search should work without an account.

Keyboard shortcut:

- `/` or `⌘K / Ctrl+K` opens search.

---

# 21. CONNECTIONS / KNOWLEDGE EXPLORER

Every major entity page ends with a **Connections** section.

Use curated edge types:

- PART_OF
- INVOLVED_IN
- SERVED_IN
- USED_IN
- OPERATED_BY
- AWARDED_FOR
- REPLACED_BY
- VARIANT_OF
- RELATED_TO
- SUPPORTED_BY
- SOURCE_FOR

Do not expose a giant hairball graph.

## Graph UI

Default:

- center node;
- 6–12 most relevant neighboring nodes;
- grouped by category;
- labels always readable;
- click expands or navigates;
- a `View all connections` secondary action.

Mobile:

- render as grouped connection cards rather than forcing a dense graph.

---

# 22. VISUAL DESIGN SYSTEM

## 22.1 Design direction

Keywords:

- intelligence archive;
- command room;
- aerospace systems;
- archival documents;
- topographic maps;
- modern editorial;
- restrained military technical design.

Do not clone any film, game or military interface directly.

## 22.2 Palette

Suggested semantic palette:

```css
--bg-0: #05080D;
--bg-1: #0B1118;
--bg-2: #111A24;

--text-primary: #F1F4F6;
--text-secondary: #A6B0BA;
--text-muted: #707C88;

--accent-primary: #C99A45;     /* muted amber */
--accent-secondary: #708773;   /* desaturated tactical green */
--critical: #B85B5B;

--border-subtle: rgba(255,255,255,0.08);
--surface-glass: rgba(15,22,31,0.78);
```

The design does not need to use these exact hex codes if an existing design system is present, but preserve the semantic character.

## 22.3 Typography

Preferred:

- Body/display: `Geist`, `Inter`, or equivalent highly legible sans-serif.
- Metadata/coordinates: `IBM Plex Mono`, `Geist Mono`, or equivalent.

Rules:

- body copy should never be monospace;
- long reading sections should target 60–75 characters per line;
- minimum body text should be comfortably readable on mobile;
- uppercase tracking is for labels, not paragraphs.

## 22.4 Grid and spacing

Use an 8px base rhythm.

Maximum readable content width:

- narrative: ~760px;
- technical/data page: ~1200–1320px;
- immersive War Room: full viewport with internal max widths.

## 22.5 Corner treatment

Use restrained radii:

- cards: 10–16px;
- chips: pill only where appropriate;
- intelligence panels may use squared/4px treatment sparingly.

Avoid making every surface a rounded floating card.

## 22.6 Borders

Prefer subtle one-pixel hairlines.

Use corner brackets or technical ticks as a decorative motif only in important hero/dossier components.

---

# 23. MOTION SYSTEM

Motion should communicate state.

## Allowed

- 150–250ms hover/focus transitions;
- 250–450ms drawer/page-panel transitions;
- slow subtle map drift;
- coordinate pulse when a location becomes active;
- timeline selection movement;
- blueprint line reveal on equipment hero.

## Avoid

- perpetual glitches;
- constant animated noise;
- page-wide parallax;
- rapid flashing;
- spinning loaders when skeletons work;
- forced animation before content is accessible.

Honor `prefers-reduced-motion`.

---

# 24. ICONOGRAPHY

Use a consistent modern line icon library.

Avoid novelty gun/war icons in navigation.

Prefer semantic icons:

- archive box;
- map;
- person;
- timeline;
- aircraft/ship/tank silhouettes only within relevant content;
- source/document;
- search;
- compare;
- external link.

---

# 25. MAP DESIGN

Use maps as storytelling surfaces.

Preferred visual treatment:

- dark terrain/topographic base;
- subdued national/state boundary context;
- amber focus marker;
- thin route/front annotations when historically documented;
- labels with careful collision behavior.

Do not simulate classified tactical plotting.

For V1, prioritize a good historical map for Kargil over a generic map on every page.

---

# 26. MICROINTERACTIONS

Examples:

### Coordinates
Hover/focus a coordinate label → softly reveal location name.

### Source citation
Hover/tap citation → source preview.

### Equipment card
Hover → one subtle blueprint contour or metadata reveal.

### Timeline
Selecting an event → timeline marker and associated map location transition together.

### Search
Keyboard input highlights matched words.

### Navigation
Current section displayed as:

```text
ARCHIVE / PEOPLE / [NAME]
```

No audio by default.

---

# 27. COMPONENT INVENTORY

Create reusable components with clear responsibilities.

## Global

- `SiteHeader`
- `SiteFooter`
- `GlobalSearch`
- `CommandSearchDialog`
- `Breadcrumbs`
- `SectionLabel`
- `PageContainer`
- `PageIntro`
- `SourceBadge`
- `VerificationBadge`
- `ExternalSourceLink`
- `EmptyState`
- `ErrorState`

## Editorial

- `DossierHeader`
- `NarrativeSection`
- `MetadataGrid`
- `SourceCitation`
- `SourcePreview`
- `SourceList`
- `RelatedEntities`
- `ConnectionExplorer`
- `StoryCard`
- `PersonCard`
- `OperationCard`
- `EquipmentCard`
- `ConflictCard`

## History

- `ConflictTimeline`
- `TimelineEventCard`
- `HistoricalMap`
- `WarRoom`
- `WarRoomTimeline`
- `WarRoomMap`
- `WarRoomDossier`

## Arsenal

- `EquipmentHero`
- `SpecificationTable`
- `VariantList`
- `CompareTray`
- `CompareTable`

## Archive

- `ArchiveFilters`
- `ArchiveResult`
- `SourceRecordCard`

Keep components focused. Do not place entire pages in one giant client component.

---

# 28. RECOMMENDED TECH STACK

Keep the stack boring and reliable.

## Frontend

- Next.js using App Router
- TypeScript with strict mode
- React
- Tailwind CSS
- shadcn/ui or equivalent accessible primitives
- Motion/Framer Motion for restrained transitions
- Lucide icons or equivalent

## Content

V1:

- MDX + typed metadata
- Zod for schemas/validation
- version-controlled content
- generated static search index

## Mapping

Use a browser-friendly map library only for the handful of experiences that need it.

Candidates:

- MapLibre GL JS
- React Map GL with MapLibre-compatible provider

Avoid proprietary map dependency unless needed.

## Graph / connections

V1:

- simple derived adjacency data
- React Flow or a light custom SVG/D3 view only for the small Connections explorer

Do not add Neo4j in V1.

## Testing

- Vitest
- React Testing Library
- Playwright
- ESLint
- TypeScript checks

## Deployment

- Vercel or equivalent static/serverless platform
- no login required
- no backend required for initial public browsing

---

# 29. WHY NO DATABASE IN V1

A dynamic database is not necessary to prove the product.

Version-controlled content gives:

- source review through pull requests;
- transparent change history;
- low hosting cost;
- straightforward build-time validation;
- excellent static rendering;
- easy rollback;
- no admin-auth surface.

Migration trigger to Postgres/Supabase:

Use a database only when one or more becomes true:

- non-technical editors need a CMS;
- content volume makes Git workflows painful;
- user accounts/bookmarks are added;
- editorial workflow needs roles/approvals;
- source ingestion becomes automated.

When migrating, preserve the same content IDs and schemas.

---

# 30. REPOSITORY STRUCTURE

Recommended:

```text
/
├── app/
│   ├── (site)/
│   │   ├── page.tsx
│   │   ├── history/
│   │   ├── people/
│   │   ├── operations/
│   │   ├── arsenal/
│   │   ├── forces/
│   │   ├── archive/
│   │   └── compare/
│   ├── methodology/
│   ├── editorial-policy/
│   ├── about/
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── global/
│   ├── editorial/
│   ├── history/
│   ├── arsenal/
│   ├── archive/
│   └── connections/
│
├── content/
│   ├── conflicts/
│   ├── events/
│   ├── operations/
│   ├── people/
│   ├── units/
│   ├── equipment/
│   ├── sources/
│   └── stories/
│
├── lib/
│   ├── content/
│   ├── search/
│   ├── maps/
│   ├── citations/
│   ├── connections/
│   └── utils/
│
├── public/
│   ├── images/
│   ├── maps/
│   └── textures/
│
├── scripts/
│   ├── validate-content.ts
│   └── build-search-index.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── docs/
    ├── implementation-plan.md
    ├── content-style-guide.md
    └── source-methodology.md
```

Adapt to the repository's existing structure when appropriate.

---

# 31. SERVER VS CLIENT COMPONENT RULE

Default to server-rendered components.

Use client components only for:

- search dialog state;
- filters;
- War Room interactions;
- interactive map;
- connection explorer;
- compare tray;
- motion requiring browser state.

Do not mark whole pages `use client` merely for one interactive widget.

---

# 32. PERFORMANCE BUDGET

Target excellent performance on average Indian mobile connections.

Goals:

- minimal JavaScript on normal article pages;
- lazy-load interactive maps;
- lazy-load graph explorer;
- optimized responsive images;
- no autoplay video;
- no oversized background video;
- no multi-megabyte 3D scene on homepage.

Performance targets:

- Lighthouse Performance: 90+ on representative production pages where feasible;
- Accessibility: 95+;
- SEO: 95+;
- Best Practices: 95+.

Treat targets as diagnostics, not excuses to compromise accessibility.

---

# 33. RESPONSIVE UX

Design mobile-first.

## Mobile

- top navigation becomes simple menu;
- global search remains prominent;
- timelines become horizontal swipe or vertical list;
- source previews become bottom sheets;
- data tables become cards or horizontal-scroll containers with visible cues;
- maps retain readable labels;
- graph explorer becomes connection list/cards.

Never require hover.

## Tablet/Desktop

Use wider layouts for:

- map + dossier split view;
- equipment metadata side rail;
- archive filters;
- compare tables.

---

# 34. ACCESSIBILITY

Required:

- WCAG 2.2 AA target;
- keyboard navigable;
- visible focus states;
- semantic landmarks/headings;
- form labels;
- alt text;
- reduced-motion support;
- maps have textual equivalents;
- charts/graphs have tabular or list equivalents;
- color is never the only status indicator;
- sufficient contrast despite dark aesthetic.

Use `aria-live` sparingly for search result counts and dynamic state.

---

# 35. SEO & SHAREABILITY

Each public entity page should provide:

- unique title;
- meta description;
- canonical URL;
- Open Graph metadata;
- social preview image where possible;
- structured data where appropriate.

Generate a sitemap.

Search engines should be able to read the core narrative without executing interactive map code.

---

# 36. CONTENT WRITING STYLE

Tone:

- precise;
- respectful;
- restrained;
- educational;
- plain English;
- non-sensational.

Prefer:

> Indian forces began an operation to recapture occupied positions along the Line of Control.

Avoid:

> India's fearless warriors unleashed a devastating reply.

Explain jargon on first use.

Use metric units primarily. Include alternate units when common and useful.

Dates should use an unambiguous format in metadata, e.g. `26 July 1999`.

---

# 37. DISPUTED INFORMATION

Do not hide disagreement.

Create a dedicated pattern:

```text
PUBLIC SOURCES DIFFER

Official source A states ...
Source B reports ...

SENTINEL does not resolve the discrepancy without stronger evidence.
```

Sources must be shown beside each version.

Never let generative text reconcile contradictory data automatically.

---

# 38. QUOTATIONS

Only use quotations when:

- wording is verified;
- source is cited;
- quote is short enough for legal/copyright-safe use.

For famous phrases with uncertain provenance, explicitly say that the attribution is disputed.

---

# 39. IMAGES & MEDIA

Prefer:

1. official public-domain/government media where reuse is allowed;
2. Wikimedia Commons with license verification;
3. licensed photographs;
4. custom illustrations/maps.

Every media object needs:

- alt text;
- credit;
- source URL;
- license/status;
- caption where useful.

Do not scrape random Google Images.

---

# 40. MAP DATA & COPYRIGHT

Use legally reusable geographic data.

Document map data sources in `/methodology`.

Historical battle overlays should be custom reconstructions with sources.

Use wording such as:

> Approximate historical location based on cited public sources.

when exact historical locations are uncertain.

---

# 41. CONTENT INGESTION WORKFLOW

Do not build automated bulk AI publishing.

Use this workflow:

```text
DISCOVER
  ↓
COLLECT SOURCES
  ↓
DRAFT STRUCTURED RECORD
  ↓
VERIFY CLAIMS
  ↓
LINK ENTITIES
  ↓
EDITORIAL REVIEW
  ↓
PUBLISH
```

AI may help:

- summarize source material;
- identify candidate relationships;
- generate draft metadata;
- flag inconsistent dates.

AI must not autonomously mark claims verified.

---

# 42. OPTIONAL ADMIN/CMS — NOT V1

Do not implement until needed.

Future editorial flow could include:

- draft;
- fact review;
- source review;
- legal/media review;
- publish.

If this is later added, Postgres/Supabase is a reasonable choice, but it should be a separate project phase.

---

# 43. ANALYTICS & PRIVACY

V1 does not need invasive analytics.

If analytics are added:

Track:

- page views;
- search usage;
- filter usage;
- connection clicks;
- citation opens;
- War Room engagement.

Do not fingerprint users.

No account required.

Prefer privacy-respecting analytics.

---

# 44. SECURITY

Even a mostly static site needs sensible defaults.

Required:

- dependency scanning;
- CSP where practical;
- sanitize MDX/HTML;
- no arbitrary executable content from content files;
- validate external URLs;
- safe external-link attributes;
- no secrets in client bundle;
- no user-provided HTML in V1.

---

# 45. ERROR STATES

## Missing content

Never crash because one optional relationship is absent.

Show:

> No verified public record has been added for this section yet.

## Broken external source

Display the source record but flag:

> Original link unavailable.

Allow an archive URL where legally appropriate.

## Search no result

Offer:

- spelling correction;
- browse History;
- browse People;
- browse Arsenal.

---

# 46. EMPTY STATES

Empty states should reinforce trust.

Example:

```text
NO VERIFIED RECORDS YET

We have not added a source-backed record for this category.
SENTINEL does not fill gaps with unsourced text.
```

---

# 47. KEY DESIGN PATTERNS

## Dossier header

```text
CLASSIFICATION
PUBLIC ARCHIVE

OPERATION VIJAY
KARGIL · 1999

THE BATTLE FOR THE HEIGHTS

THEATRE       KARGIL
PERIOD        MAY–JUL 1999
SERVICES      ARMY / AIR FORCE

SOURCES       18
```

"CLASSIFICATION: PUBLIC ARCHIVE" is decorative editorial language only. Do not imply access to classified material.

## Source chip

```text
[A] MINISTRY OF DEFENCE
```

## Verification chip

```text
OFFICIALLY CONFIRMED
```

## Coordinate label

```text
34.55° N
76.13° E
KARGIL
```

Keep decorative metadata subtle.

---

# 48. DESIGN ANTI-PATTERNS

Reject implementations that:

- turn every paragraph into a card;
- use neon green as dominant color;
- obscure text behind effects;
- use dozens of animations simultaneously;
- make the homepage a 3D WebGL demo;
- require scroll-jacking;
- put three sidebars on desktop;
- use infinite scroll for historical content;
- turn maps into unreadable icon clouds;
- show unsourced stat counters;
- use stock "soldier silhouette" hero art everywhere;
- imitate classified-document stamps deceptively.

---

# 49. HOMEPAGE COPY — SEED

Use as initial product copy, then refine:

```text
SENTINEL
INDIAN DEFENCE ARCHIVE

A source-first interactive archive of India's military history.

Explore conflicts, operations, people, formations and technology —
and follow every important story back to its sources.

[ENTER THE ARCHIVE]
[EXPLORE HISTORY]

Independent educational archive.
Not an official Government of India or Armed Forces website.
```

---

# 50. METHODOLOGY PAGE — REQUIRED CONTENT

Explain:

- what SENTINEL is;
- what it is not;
- source tiers;
- verification statuses;
- how conflicting information is handled;
- how media is licensed;
- how corrections are submitted later;
- safety boundary around current operational data;
- editorial independence;
- update date.

---

# 51. EDITORIAL POLICY PAGE — REQUIRED CONTENT

Core statements:

1. Historical and technical claims require sources.
2. Primary sources are preferred where available.
3. Secondary sources are used for context and interpretation.
4. Disputed claims remain visibly disputed.
5. SENTINEL does not infer operational secrets from aggregated public data.
6. Political commentary is outside the core product.
7. Respectful language is required for casualties and conflict.
8. Corrections should preserve a public revision history where practical.

---

# 52. V1 SEED CONTENT STRATEGY

Do not spend the first development cycle authoring hundreds of articles.

Seed enough data to prove every interaction.

Minimum functional seed:

- 5 conflicts;
- 20 timeline events;
- 12 people;
- 10 operations;
- 10 units/formations;
- 30 equipment records;
- 25 sources;
- 8 editorial story cards.

Each category must have at least one richly connected example.

Kargil should be the richest seed.

---

# 53. FIRST-PASS KARGIL ENTITY GRAPH

Use this as structural guidance, not unverified factual content.

```text
Kargil War
  ├── Operation Vijay
  ├── Operation Safed Sagar
  ├── key historical locations/events
  │   ├── Tololing
  │   ├── Tiger Hill
  │   └── Point 4875
  ├── selected public units
  ├── selected decorated personnel
  ├── selected publicly documented equipment
  └── primary/secondary sources
```

Before publishing the actual entity records, verify each link and historical claim against sources.

---

# 54. BUILD PHASES

## Phase 0 — Repository and quality foundation

Deliverables:

- Next.js/TS application or integration into existing stack;
- lint;
- formatting;
- tests;
- CI;
- base tokens;
- fonts;
- content schemas;
- validation script.

Acceptance:

```bash
npm run lint
npm run typecheck
npm test
npm run validate:content
npm run build
```

all pass.

## Phase 1 — Design system + shell

Build:

- header;
- footer;
- responsive nav;
- page container;
- typography;
- buttons;
- tags;
- dossier panels;
- source badge;
- search shell;
- dark visual system.

Acceptance:

- keyboard accessible;
- mobile responsive;
- reduced motion;
- no horizontal overflow.

## Phase 2 — Content engine

Build:

- typed entity schemas;
- content loading;
- relationship resolver;
- slug lookup;
- source lookup;
- content validation;
- seed content.

Acceptance:

- invalid relationship causes test/build failure;
- every public entity exposes its sources.

## Phase 3 — History

Build:

- history landing;
- conflict page;
- timeline;
- related entities;
- textual timeline fallback.

Acceptance:

- 5 seed conflicts navigable;
- Kargil entity relationships work.

## Phase 4 — War Room

Build:

- Kargil War Room;
- timeline selection;
- map markers;
- dossier synchronization;
- mobile fallback.

Acceptance:

- selection updates URL state or shareable state if reasonable;
- keyboard users can select events;
- map is not necessary to understand the sequence.

## Phase 5 — People + Operations

Build:

- filters;
- profiles;
- operation templates;
- connections.

Acceptance:

- user can move from Kargil → event → person → source.

## Phase 6 — Arsenal + Compare

Build:

- categories;
- filter;
- equipment dossier;
- source-backed specs;
- comparison tray;
- compare page.

Acceptance:

- maximum 3 comparison items;
- every spec row supports citations;
- no winner/rating generated.

## Phase 7 — Archive + Search

Build:

- source explorer;
- filters;
- source page;
- full-site search;
- command dialog.

Acceptance:

- `tiger hill` type queries return mixed entity categories;
- source filters are represented in URL query state.

## Phase 8 — Polish and verification

Perform:

- Playwright critical journeys;
- accessibility audit;
- performance pass;
- visual regression/screenshot review;
- broken link checks;
- metadata/sitemap;
- content/source audit.

---

# 55. IMPLEMENTATION TASKS

Create `docs/implementation-plan.md` from these tasks before coding.

## Task 1 — Project quality baseline

Files:

- package configuration
- lint config
- TypeScript config
- testing config
- CI workflow

Deliverable:

> A blank but production-building project with strict TS, lint, tests and CI.

## Task 2 — Tokens and primitives

Files:

- global CSS
- typography
- primitive components
- dark-mode-only V1 theme

Deliverable:

> Storybook is optional. A `/design-system` internal dev route is enough if useful.

## Task 3 — Content schemas

Create typed Zod schemas for all data models in this spec.

Write validation tests first.

Deliverable:

> Invalid content cannot enter a production build.

## Task 4 — Seed source records

Add 25 source objects and ensure their IDs validate.

Do not fabricate URLs.

When a source is not yet verified, use local clearly labelled demo data that is excluded from production publication.

## Task 5 — Seed entities

Create enough content to render every template.

## Task 6 — App shell

Implement responsive navigation, footer and global search entry.

## Task 7 — Homepage

Match the restrained homepage specification.

## Task 8 — History landing

Timeline + cards.

## Task 9 — Conflict template

Build from content data, not hardcoded Kargil JSX.

## Task 10 — War Room

Build Kargil as the first specialized view.

## Task 11 — People

Landing + profile.

## Task 12 — Operations

Landing + operation page.

## Task 13 — Arsenal

Landing + equipment page.

## Task 14 — Comparison

Source-backed side-by-side view.

## Task 15 — Archive

Source filters and source detail.

## Task 16 — Search

Build static index and command dialog.

## Task 17 — Connections

Derived relationship resolver + focused visual explorer.

## Task 18 — Methodology/editorial pages

Build required trust pages.

## Task 19 — E2E journeys

At minimum:

```text
Homepage → Kargil → event → person → source
Homepage → Arsenal → equipment → compare
Search → mixed results → entity
Archive → filter → source
Mobile nav → History → conflict
```

## Task 20 — Production readiness

- all tests;
- production build;
- accessibility pass;
- performance;
- broken links;
- no debug logs;
- metadata;
- sitemap;
- robots;
- error pages.

---

# 56. TEST STRATEGY

## Unit tests

Test:

- schema parsing;
- relationship resolution;
- source references;
- slug generation;
- filter logic;
- search indexing;
- comparison normalization.

## Component tests

Test:

- citation keyboard interaction;
- source preview;
- search dialog;
- compare tray;
- filters;
- timeline event selection.

## E2E

Use Playwright for the critical user journeys.

## Content integrity tests

These are as important as UI tests.

Examples:

```ts
it("rejects equipment specs without sources", () => {})
it("rejects missing source references", () => {})
it("rejects duplicate slugs", () => {})
it("requires alt text for all media", () => {})
it("rejects published entities without sources", () => {})
```

---

# 57. DEFINITION OF DONE — FEATURE

A feature is done only when:

- requirement is implemented;
- mobile works;
- keyboard navigation works;
- loading/empty/error state exists where relevant;
- tests exist;
- lint passes;
- typecheck passes;
- content validator passes;
- production build passes;
- source links render correctly;
- no unsourced production factual data was introduced.

---

# 58. DEFINITION OF DONE — V1

V1 is complete when a new visitor can:

1. land on a polished SENTINEL homepage;
2. understand the product in under 10 seconds;
3. navigate the five seed conflicts;
4. experience the Kargil War Room;
5. open an event;
6. reach a connected person;
7. reach the person's sources;
8. browse operations;
9. browse equipment;
10. compare systems;
11. search across entity types;
12. browse the Archive;
13. understand source tiers;
14. use the site well on a phone;
15. use the site with keyboard navigation.

---

# 59. NON-GOALS FOR V1

Do not build:

- user accounts;
- comments;
- forums;
- social feeds;
- live defence news;
- live aircraft/ship tracking;
- live troop location;
- AI chatbot;
- automated AI article publishing;
- complex CMS;
- Neo4j;
- Elasticsearch;
- multi-tenant admin;
- native mobile app;
- WebGL 3D homepage;
- VR experience;
- gamification;
- paid subscription;
- advertising platform.

These may be separate future product decisions.

---

# 60. FUTURE PHASES — ONLY AFTER V1

Potential additions:

### A — Full editorial CMS
Supabase/Postgres + authenticated reviewers.

### B — Deeper knowledge graph
Materialized relationship graph and richer exploration.

### C — Defence evolution timelines
Examples:

- fighter evolution;
- carrier history;
- submarines;
- tanks;
- artillery;
- missiles.

### D — "Popular Story vs Historical Record"
Investigate widely repeated military claims against source evidence.

### E — Documentary experiences
Long-form multimedia stories around selected historical events.

### F — Multilingual
Start with Hindi and one additional Indian language only after English content structure stabilizes.

### G — PWA/offline reading
Useful for educational access on lower-bandwidth networks.

---

# 61. TOKEN-EFFICIENT CODING-AGENT RULES

The agent should minimize context waste.

1. Do not load all content files when editing one component.
2. Read this master spec once; cite relevant headings in task prompts.
3. Keep design tokens centralized.
4. Keep schemas centralized.
5. Keep component files focused.
6. Avoid repeated code-generation passes before testing the first.
7. Use a dedicated content fixture for tests.
8. Use visual verification after UI slices instead of repeatedly reasoning about CSS from text.
9. Commit after independently testable slices.
10. When a bug appears, reproduce it before changing code.

For subagents, send:

- task goal;
- exact files in scope;
- relevant interfaces;
- acceptance criteria;
- test commands.

Do not send the entire repository context unless necessary.

---

# 62. CODE QUALITY RULES

- strict TypeScript;
- avoid `any`;
- use semantic names;
- no 1,000-line components;
- no unnecessary state libraries;
- no global state unless a feature truly needs it;
- URL state for filters where useful;
- server components by default;
- pure utility functions for relationship resolution;
- Zod validation at content boundary;
- descriptive test names;
- no silent catch blocks;
- no fake delays;
- no hardcoded historical data inside components.

---

# 63. COMPONENT DESIGN RULE

Before creating a new component, answer:

1. What single responsibility does it have?
2. What props does it accept?
3. Can it be tested independently?
4. Does a similar component already exist?
5. Is it presentation, data transformation or interaction?

Do not mix content loading, relationship resolution, animation and rendering in one file.

---

# 64. VISUAL QA CHECKLIST

For every main route, capture desktop and mobile screenshots.

Check:

- headline hierarchy;
- body line length;
- contrast;
- spacing rhythm;
- source visibility;
- hover/focus states;
- mobile overflow;
- map label collision;
- empty images;
- duplicated cards;
- awkward wrapping;
- excessive decorative noise.

The result should feel like a premium editorial archive, not a template dashboard.

---

# 65. CONTENT QA CHECKLIST

Before marking seed content publishable:

- correct dates;
- names spelled consistently;
- rank appropriate to historical period;
- service/unit relationship verified;
- award names correct;
- equipment variants correct;
- source URLs work;
- source tier assigned;
- conflicting claims labelled;
- quotation attribution verified;
- images licensed;
- alt text written;
- no current sensitive location data;
- no language suggesting SENTINEL is official.

---

# 66. BUILD PRIORITY IF TIME IS LIMITED

If schedule becomes constrained, preserve quality in this order:

1. source system;
2. content schemas;
3. homepage;
4. history;
5. Kargil War Room;
6. people;
7. arsenal;
8. search;
9. archive;
10. compare;
11. connection graph embellishments.

Cut fancy visualization before cutting sourcing or accessibility.

---

# 67. FIRST AGENT PROMPT

Copy/paste this prompt to the coding agent after placing this file in the repository:

```text
You are the lead engineer and product-minded frontend architect for SENTINEL.

Read `SENTINEL_MASTER_BUILD_SPEC.md` in full. Treat it as the product source of truth.

First inspect the repository and report:
1. current stack and folder structure;
2. what already satisfies the spec;
3. conflicts between the current repo and the spec;
4. the smallest sensible V1 implementation sequence.

Then create `docs/implementation-plan.md` with concrete tasks, exact files, test strategy and acceptance criteria.

Do not begin large-scale implementation until the plan exists.

Implementation principles:
- strict TypeScript;
- server components by default;
- content-first architecture;
- source IDs and referential integrity are mandatory;
- write validation/tests before critical behavior;
- keep client JS low;
- build mobile-first;
- honor reduced motion;
- do not invent historical content or citations;
- use clearly labelled non-production fixtures when verified content is unavailable;
- no database, CMS, authentication, AI chatbot, news feed or live tracking in V1;
- do not over-design with fake HUD/glitch effects.

Build in vertical slices and run:
npm run lint
npm run typecheck
npm test
npm run validate:content
npm run build

after each major phase.

The flagship experience is Kargil 1999 / Operation Vijay.
The design target is: premium modern editorial archive with restrained spy/intelligence visual language.

Start with repository inspection and the implementation plan.
```

---

# 68. PROMPT FOR IMPLEMENTING AFTER PLAN REVIEW

```text
Proceed with the approved `docs/implementation-plan.md`.

Work task-by-task.

For each task:
1. state the task and files in scope;
2. write or update tests first for behavior/data integrity;
3. implement the smallest correct solution;
4. run the relevant tests;
5. run lint/typecheck when the slice is complete;
6. visually verify UI work on desktop and mobile;
7. commit with a focused commit message if git is available;
8. update the task checklist.

Do not change the product scope without explaining why.

If a historical fact/source is not verified, do not invent it. Use an explicitly marked fixture or leave the content field unavailable.

After all tasks, run the complete verification suite and provide:
- implemented routes;
- test results;
- known limitations;
- deferred V2 items;
- screenshots or visual verification summary.
```

---

# 69. PRODUCT NORTH STAR

Every important SENTINEL experience should follow:

> **DISCOVER → UNDERSTAND → EXPLORE → VERIFY**

A visitor should be able to begin with a war, discover an operation, open a battle/event, meet a person, inspect the unit or equipment involved, and finally see where the story came from.

That connected, source-first journey is the product.

The cinematic visual language exists to make exploration memorable.

The evidence makes SENTINEL trustworthy.

---

---

# 69. VERSIONED PRODUCT & CONTENT STRATEGY

> This section supersedes any earlier roadmap guidance in this document where there is a conflict.  
> **Immediate implementation scope remains V1.** Future-version requirements are architectural direction, not permission to prematurely build those systems.

## 69.1 Long-term product evolution

```text
V1 — SOURCE-FIRST ARCHIVE
        ↓
V1.5 — COVERAGE EXPANSION
        ↓
V2 — CONNECTED DEFENCE ENCYCLOPAEDIA
        ↓
V2.5 — EDUCATION + DEFENCE INDUSTRY
        ↓
V3 — INTERACTIVE DIGITAL WAR MUSEUM
        ↓
V3.5 — GEOGRAPHIC / ORAL / MEDIA ARCHIVE
        ↓
V4 — RESEARCH + DATA PLATFORM
        ↓
V4.5 — EVIDENCE / CLAIM INVESTIGATION
        ↓
V5 — CITATION-GROUNDED INTELLIGENT ARCHIVE
        ↓
V6+ — MULTILINGUAL NATIONAL-SCALE DIGITAL MUSEUM
```

The roadmap must add new ways of understanding the archive, not merely more pages.

---

# 70. CONTENT CONSTITUTION

## 70.1 The canonical content pipeline

SENTINEL must conceptually model:

```text
SOURCE
   ↓
EVIDENCE
   ↓
CLAIM
   ↓
ENTITY
   ↓
STORY
   ↓
EXPERIENCE
```

Definitions:

### Source
The original publication, record, book, official webpage, report, citation, photograph, map, interview or other material.

### Evidence
The specific passage, table, image, statement, metadata field or other portion of a source relevant to a claim.

### Claim
A discrete factual assertion that can be supported, contradicted or left uncertain.

Example:

```text
Subject: Operation X
Predicate: start_date
Value: YYYY-MM-DD
```

### Entity
A reusable structured object such as a conflict, event, person, unit, equipment system, location, award or organization.

### Story
Editorial narrative assembled from verified claims and connected entities.

### Experience
The interface through which the user explores the material: dossier, timeline, War Room, map, comparison, data story, source reader or future AI answer.

The same verified knowledge should be reusable across multiple experiences.

---

# 71. EVIDENCE MODEL — INTRODUCE IN V1

The earlier V1 `Claim` model is extended to explicitly support evidence.

```ts
type EvidenceRecord = {
  id: string
  sourceId: string
  locator?: string
  excerpt?: string
  summary?: string
  evidenceType:
    | "text"
    | "table"
    | "image"
    | "map"
    | "metadata"
    | "audio"
    | "video"
    | "other"
  notes?: string
}
```

Copyright rule:

- `excerpt` must remain short and legally appropriate;
- prefer summaries for long passages;
- never copy entire copyrighted documents into the content repository.

Updated claim model:

```ts
type ClaimValue = string | number | boolean | string[]

type Claim = {
  id: string
  subjectEntityId: string
  predicate: string
  value: ClaimValue
  verificationStatus:
    | "OFFICIALLY_CONFIRMED"
    | "MULTIPLE_CREDIBLE_SOURCES"
    | "DISPUTED"
    | "UNVERIFIED"
    | "DECLASSIFIED_RECORD"
    | "SOURCE_CONFLICT"
  evidenceIds: string[]
  editorialNote?: string
  reviewedAt?: string
}
```

V1 does not need a full RDF/triple store. JSON/TS/YAML records are sufficient.

The important requirement is preserving stable IDs and the conceptual separation.

---

# 72. CONTENT DEPTH MODEL

Not every subject deserves the same editorial investment.

Use five levels.

## Level 1 — Record

Structured verified metadata and a concise summary.

Suitable for:

- minor equipment variants;
- individual source records;
- secondary formations;
- minor events.

## Level 2 — Dossier

Complete entity page containing:

- overview;
- context;
- structured metadata;
- related entities;
- sources.

Suitable for:

- operations;
- major equipment;
- decorated personnel;
- units;
- significant events.

## Level 3 — Story

Editorial narrative explaining why something mattered.

Suitable for:

- notable battles;
- capability evolution;
- overlooked historical episodes;
- humanitarian operations.

## Level 4 — Experience

Designed interactive experience.

Examples:

- Kargil War Room;
- 1971 theatre explorer;
- interactive capability evolution.

## Level 5 — Research Record

Evidence-rich view exposing:

- individual claims;
- supporting evidence;
- conflicting evidence;
- source provenance;
- research notes where publishable.

Primarily introduced in V4.

---

# 73. V1 — SOURCE-FIRST ARCHIVE

## Mission

Prove that SENTINEL can be:

1. beautiful;
2. easy to understand;
3. historically responsible;
4. deeply sourced;
5. meaningfully interconnected.

V1 should feel finished despite having a deliberately limited corpus.

## Public-launch content target

Approximate editorial targets:

| Type | V1 |
|---|---:|
| Major conflicts | 5 |
| Operations | 15–20 |
| Battles/events | 40–60 |
| People | ~50 |
| Units/formations | 30–50 |
| Equipment | ~100 |
| Editorial stories | 15–20 |
| Sources | 300–500 |
| War Rooms | 1 |

The smaller development fixture defined earlier may be used before launch.

## V1 flagship

**Kargil 1999 / Operation Vijay**

Kargil should be the richest connected content cluster.

## V1 content stages

### Stage V1.1 — Source foundation

Build:

- source schema;
- source tiers;
- source detail UI;
- citation component;
- archive records;
- URL checking;
- source methodology.

Exit gate:

- every production factual entity has at least one source;
- every equipment specification has source coverage.

### Stage V1.2 — Evidence and claims

Build lightweight:

- EvidenceRecord;
- Claim;
- claim-to-evidence relationships;
- verification states;
- validation.

Do not expose every claim in the public UI yet.

Exit gate:

- important Kargil seed facts can be traced from entity → claim → evidence → source.

### Stage V1.3 — Kargil campaign pack

Research Kargil as a connected cluster:

```text
CONFLICT
├── context
├── operations
├── events/battles
├── locations
├── people
├── units
├── equipment
├── documents
├── photographs
└── sources
```

Exit gate:

A user can travel:

```text
Kargil
→ event
→ person
→ unit/equipment
→ evidence/source
```

### Stage V1.4 — Other major conflict packs

Add curated coverage for:

- 1947–48;
- 1962;
- 1965;
- 1971.

Do not attempt Kargil-level interactive depth for all four yet.

### Stage V1.5 — Arsenal baseline

Create approximately 100 representative systems.

Prioritize breadth across domains before obscure variants.

### Stage V1.6 — People baseline

Build approximately 50 well-sourced profiles.

Avoid a popularity ranking.

### Stage V1.7 — Editorial stories

Create 15–20 narrative pieces from existing verified entities rather than conducting disconnected research for every story.

### Stage V1.8 — Launch content audit

Audit:

- claim/source coverage;
- spelling;
- dates;
- ranks;
- relationships;
- quotations;
- images/licenses;
- conflicting claims;
- sensitive information;
- broken links.

## V1 source mix

Editorial preference, not quota:

```text
PRIMARY / OFFICIAL       ~50%
ACADEMIC / BOOKS         ~30%
QUALITY JOURNALISM       ~15%
SPECIALIST                ~5%
```

Use specialist/community sources for discovery where useful, but material claims should not rely on low-quality sources alone.

## V1 success KPI

Primary:

> Percentage of material factual claims with evidence/source coverage.

Target: effectively 100% for published content.

---

# 74. CAMPAIGN PACK CONTENT METHOD

From V1 onward, research in connected packs rather than adding random entities.

Example:

```text
1971 CAMPAIGN PACK

CONTEXT
├── political/historical background
└── prelude

THEATRES
├── eastern
├── western
└── maritime

OPERATIONS
├── ...
└── ...

EVENTS / BATTLES
├── ...
└── ...

PEOPLE
├── ...
└── ...

UNITS
├── ...
└── ...

EQUIPMENT
├── aircraft
├── land systems
└── ships

ARCHIVE
├── government records
├── UN material
├── maps
├── photographs
└── other credible sources
```

Advantages:

- relationships emerge naturally;
- research is reused;
- source coverage improves;
- users encounter dense connected clusters;
- fewer orphan pages.

---

# 75. V1.5 — COVERAGE EXPANSION

## Mission

Make SENTINEL feel substantial without changing its fundamental architecture.

Suggested scale:

| Type | V1.5 |
|---|---:|
| Conflicts/campaigns | 10–15 |
| Operations | ~50 |
| Events | 200+ |
| People | 200–300 |
| Units | 100+ |
| Equipment | 250–350 |
| Stories | ~50 |
| Sources | 1,500+ |
| War Rooms | 2–3 |

## Stages

### Stage V1.5.1 — Coverage matrix

Create explicit coverage matrices for:

- conflicts;
- awards;
- services;
- equipment domains;
- historical eras.

### Stage V1.5.2 — Campaign pack production

Expand one coherent campaign at a time.

### Stage V1.5.3 — Arsenal completeness

Fill obvious gaps by service/domain.

### Stage V1.5.4 — People and awards

Systematically cover major gallantry-award recipients and other historically important public figures.

### Stage V1.5.5 — Archive enrichment

Increase primary-source density for existing entities before endlessly adding new entities.

## Exit gate

The site feels meaningfully explorable across several eras, not like a Kargil demo with filler pages.

---

# 76. V2 — CONNECTED DEFENCE ENCYCLOPAEDIA

## Mission

Move from a curated archive to systematic coverage.

## Knowledge model expansion

Add first-class entity types such as:

```text
CONFLICT
CAMPAIGN
OPERATION
EVENT
BATTLE
INCIDENT
PERSON
AWARD
UNIT
FORMATION
SQUADRON
SHIP
EQUIPMENT
LOCATION
ORGANIZATION
MANUFACTURER
PROGRAMME
SOURCE
MEDIA
```

Do not create separate types when one generalized type plus category works better.

## Approximate scale

| Type | V2 |
|---|---:|
| Conflicts/campaigns | 20+ |
| Operations | 150+ |
| Events | 500+ |
| People | 750+ |
| Units | 250+ |
| Equipment | 500+ |
| Sources | 5,000+ |
| Stories | 100+ |
| War Rooms | 3–5 |

## V2 stages

### Stage V2.1 — Coverage matrices

Examples:

```text
ARSENAL

                 ACTIVE  RETIRED  DEVELOPMENT
FIGHTERS            ✓       ✓          ✓
TRANSPORT            ✓       ✓
HELICOPTERS           ✓       ✓
TRAINERS              ✓       ✓
UAV/UAS               ✓
AEW&C / ISR           ✓
```

Track completeness internally.

### Stage V2.2 — Defence Evolution

Create thematic timelines:

- fighter aviation;
- carrier aviation;
- submarines;
- tanks;
- artillery;
- helicopters;
- missiles;
- air defence;
- military aviation manufacturing.

Each evolution experience explains *why capability changed*, not merely dates.

### Stage V2.3 — How It Works

Create beginner explainers:

- battalion;
- brigade;
- division;
- squadron;
- command;
- frigate vs destroyer;
- aircraft carrier;
- artillery;
- air defence;
- AEW&C;
- beyond-visual-range combat;
- military logistics.

Target reading level: intelligent general audience, approximately "ELI15".

### Stage V2.4 — Organizational depth

Expand Forces while maintaining safety boundaries.

### Stage V2.5 — Search and graph enrichment

Use the larger entity graph to improve:

- related content;
- search;
- discovery;
- timeline generation.

## V2 KPI

Primary:

> Coverage completeness against defined matrices.

Do not use raw article count as the primary success metric.

---

# 77. V2.5 — DEFENCE INDUSTRY & EDUCATION

## Mission

Explain how Indian military capability is developed, manufactured and organized.

## New content domains

### Organizations

- public R&D organizations;
- DPSUs;
- shipyards;
- private-sector organizations;
- joint ventures;
- foreign partners where relevant.

### Programmes

Model programmes separately from individual systems.

Example:

```text
LCA PROGRAMME
      │
 ┌────┼───────────┐
 │    │           │
ADA  HAL        DRDO
 │
TEJAS FAMILY
 │
├── Mk1
├── Mk1A
└── later publicly documented variants/programmes
```

All actual relationships must be sourced.

## Stages

### Stage V2.5.1 — Programme schema
### Stage V2.5.2 — Organization directory
### Stage V2.5.3 — Programme ↔ organization ↔ equipment relationships
### Stage V2.5.4 — Illustrated "How Defence Works" education collection
### Stage V2.5.5 — Indigenisation lens

Use neutral categories:

- indigenous;
- joint development;
- license produced;
- imported;
- mixed.

Avoid simplistic political scoring.

---

# 78. V3 — INTERACTIVE DIGITAL WAR MUSEUM

## Mission

Turn mature structured content into museum-quality historical experiences.

Content quality becomes more important than raw corpus growth.

## V3 stages

### Stage V3.1 — War Room framework

Generalize the Kargil War Room into a reusable editorial framework.

Possible curated experiences:

- 1947–48;
- 1962;
- 1965;
- 1971;
- Siachen;
- Kargil.

Not every conflict must receive one.

### Stage V3.2 — Theatre Explorer

For conflicts where geography matters:

```text
CONFLICT
  ↓
THEATRE
  ↓
TIMELINE
  ↓
EVENT
  ↓
PEOPLE / UNITS / SOURCES
```

### Stage V3.3 — Museum Story Experiences

Editorial collections may include:

- major battles;
- rescue and evacuation;
- air operations;
- naval history;
- logistics and engineering;
- peacekeeping;
- technology development;
- lesser-known verified stories.

### Stage V3.4 — Chaptered storytelling

Story format:

```text
INTRO
 ↓
CONTEXT
 ↓
MAP / PLACE
 ↓
PEOPLE
 ↓
EVENT
 ↓
OUTCOME
 ↓
LEGACY
 ↓
SOURCES
```

### Stage V3.5 — Editorial cadence

Aim for fewer, excellent experiences.

A reasonable mature cadence may be one major story every 2–4 weeks rather than mass AI publication.

## V3 KPI

Measure depth of exploration:

- Story → Entity;
- Entity → Source;
- War Room timeline completion;
- related-entity exploration.

---

# 79. V3.5 — GEOGRAPHIC, ORAL & MEDIA ARCHIVE

## Mission

Add human and geographic texture.

## Historical Map Explorer

Filters may include:

- era;
- conflict;
- event;
- operation;
- memorial;
- museum;
- historical/public locations.

Never convert this into a current operational map.

## Military geography explainers

Potential topics:

- Kargil;
- Siachen;
- Chushul;
- Tawang;
- Longewala;
- Andaman & Nicobar;
- Indian Ocean.

Teach:

- terrain;
- altitude;
- logistics;
- weather;
- sea lanes;
- strategic geography at a safe/public level.

## Oral history

Where legally and publicly available:

- veterans;
- service personnel;
- historians;
- journalists;
- families;
- official interviews.

Model transcript timestamps and entity links.

```text
INTERVIEW
├── 00:00 Introduction
├── 04:31 Deployment
├── 12:17 Event
└── 21:03 Aftermath
```

## Photography archive

Media becomes structured content:

```text
PHOTO
├── date
├── approximate/historical location
├── creator
├── source
├── license
└── depicts → entities
```

## Stages

### V3.5.1 Historical map index
### V3.5.2 Geographic explainers
### V3.5.3 Media entity model
### V3.5.4 Photo collections
### V3.5.5 Oral-history indexing

---

# 80. V4 — RESEARCH & DATA PLATFORM

## Mission

Turn accumulated structured knowledge into a serious research and exploration tool.

## V4 stages

### Stage V4.1 — Research-mode entity pages

Expose optional deeper views:

- claims;
- evidence;
- source provenance;
- disagreement;
- revision date.

### Stage V4.2 — Advanced knowledge explorer

Support structured queries such as:

```text
Indian Navy
→ Aircraft carriers
→ 1947–present
```

Do not expose an unreadable graph by default.

### Stage V4.3 — Data Lab

Potential public datasets:

- defence expenditure;
- force/equipment evolution;
- historical fleet composition;
- naval development;
- shipbuilding;
- public defence production/import/export trends;
- UN peacekeeping;
- gallantry awards.

Every visualization must have:

- methodology;
- source;
- data download where licensing permits;
- caveats.

### Stage V4.4 — Data Stories

Examples:

- evolution of Indian naval aviation;
- fighter fleet evolution;
- peacekeeping contribution;
- defence-industrial development.

### Stage V4.5 — Primary Source Reader

Where legally possible, allow a user to read/index a source while seeing linked entities.

Example:

```text
"...operations around Tololing..."
                 │
                 └── TOLOLING
                       ├── event
                       ├── map
                       ├── people
                       └── related sources
```

Do not illegally mirror copyrighted material.

## V4 KPI

Primary:

> Source richness and research utility.

Useful measures:

- authoritative sources per entity;
- evidence coverage;
- downloadable datasets;
- source-reader engagement.

---

# 81. V4.5 — EVIDENCE PLATFORM

## Mission

Make source criticism itself a recognizable SENTINEL experience.

## Popular Story vs Historical Record

Candidate claims should be researched as case files.

Internal model:

```text
CASE

CLAIM
ORIGIN / EARLIEST TRACE
PRIMARY EVIDENCE
SECONDARY EVIDENCE
CONTRADICTIONS
ASSESSMENT
RESEARCH NOTES
LAST REVIEWED
```

Public assessment vocabulary:

- `SUPPORTED`
- `MOSTLY_SUPPORTED`
- `PARTIALLY_SUPPORTED`
- `DISPUTED`
- `INSUFFICIENT_EVIDENCE`
- `FALSE_ATTRIBUTION`

Never use simplistic "TRUE/FALSE" when evidence is nuanced.

## Stages

### V4.5.1 Candidate-claim intake
### V4.5.2 Evidence review workflow
### V4.5.3 Research case schema
### V4.5.4 Public case-file UI
### V4.5.5 Revision/history mechanism

## KPI

> Readers can understand *why* SENTINEL reached an assessment.

---

# 82. V5 — CITATION-GROUNDED INTELLIGENT ARCHIVE

## Mission

AI changes how verified content is consumed; it does not become the source of truth.

Correct architecture:

```text
USER QUESTION
     ↓
QUERY INTERPRETATION
     ↓
ENTITY / CLAIM RETRIEVAL
     ↓
EVIDENCE RETRIEVAL
     ↓
SOURCE RETRIEVAL
     ↓
GROUNDED GENERATION
     ↓
ANSWER + CITATIONS
```

Never:

```text
USER → GENERAL LLM MEMORY → UNSOURCED ANSWER
```

## V5 stages

### Stage V5.1 — Retrieval benchmark

Before chat UI, build a benchmark of questions with expected supporting sources.

### Stage V5.2 — Ask SENTINEL

Examples:

- Why was Tiger Hill important?
- Which documented events involved a particular unit?
- Explain the Kargil War to a beginner.
- Show major naval events during a conflict.

### Stage V5.3 — Citation enforcement

Every factual answer section must link to retrieved evidence.

If evidence is inadequate:

> SENTINEL does not currently have sufficient verified material to answer this confidently.

### Stage V5.4 — Adaptive explanation

Generate views from the same knowledge:

```text
BEGINNER
STUDENT
ENTHUSIAST
RESEARCHER
```

These are presentation modes, not different truth layers.

### Stage V5.5 — Research Assistant

Generate research views combining:

- timeline;
- relevant entities;
- maps;
- sources;
- disagreements;
- further reading.

### Stage V5.6 — Contextual explainers

Examples:

- "Explain this event"
- "Explain this map"
- "Why does this equipment matter?"
- "Show related primary sources"

## V5 KPI

Primary:

> Percentage of generated factual statements supported by retrieved evidence.

Grounding quality matters more than number of chats.

---

# 83. V6+ — NATIONAL-SCALE DIGITAL MUSEUM

Potential directions only after the earlier layers work.

## Multilingual

Canonical pipeline:

```text
VERIFIED KNOWLEDGE
      ↓
CANONICAL EDITORIAL VERSION
      ↓
TRANSLATION
      ↓
LANGUAGE QA
      ↓
PUBLISHED LANGUAGE VERSION
```

Entity IDs, claims, evidence and citations remain language-independent.

Potential rollout:

1. English;
2. Hindi;
3. additional Indian languages based on usage and editorial capacity.

## Beginner / education modes

The same entity may expose:

```text
30-SECOND SUMMARY
3-MINUTE EXPLANATION
FULL DOSSIER
RESEARCH VIEW
PRIMARY SOURCES
```

Do not maintain four independent factual articles when one verified knowledge base can support multiple presentations.

## Memorial mode

Create a visually distinct, restrained experience for remembrance.

No tactical HUD styling around memorial content.

## Educational curriculum collections

Potential later collections:

- military organization;
- technology basics;
- major historical periods;
- geography;
- humanitarian operations;
- peacekeeping.

---

# 84. CONTENT PRODUCTION SYSTEM

## 84.1 Manual/AI-assisted workflow

```text
DISCOVER
   ↓
COLLECT
   ↓
REGISTER SOURCE
   ↓
EXTRACT CANDIDATE EVIDENCE
   ↓
PROPOSE CLAIMS
   ↓
VERIFY
   ↓
LINK ENTITIES
   ↓
DRAFT NARRATIVE
   ↓
EDITORIAL REVIEW
   ↓
MEDIA/LICENSE REVIEW
   ↓
PUBLISH
   ↓
CORRECT / UPDATE
```

## 84.2 AI may assist with

- source discovery;
- metadata extraction;
- candidate entity detection;
- candidate claim extraction;
- summarization;
- duplicate detection;
- relationship suggestions;
- inconsistent-date flags;
- first-draft prose;
- translation drafts in later versions.

## 84.3 AI may not autonomously

- mark a claim verified;
- invent missing dates;
- resolve source conflicts;
- invent citations;
- publish articles;
- infer sensitive current operational information;
- generate quotations from memory.

---

# 85. FUTURE INTERNAL CONTENT WORKBENCH

Do not build in V1.

Potential later editor experience:

```text
NEW SOURCE

TITLE       detected
PUBLISHER   detected
DATE        detected
TYPE        proposed: official report

ENTITIES DETECTED
[ ] entity A
[ ] entity B
[ ] entity C

CANDIDATE CLAIMS
12

[REVIEW EVIDENCE]
```

Editors accept/reject suggestions.

Only accepted, reviewed information becomes publishable knowledge.

---

# 86. CONTENT COVERAGE MATRICES

From V1.5 onward, maintain machine-readable coverage metrics.

Examples:

## Equipment

```text
service
domain
category
era
status
record_exists
dossier_complete
source_quality
spec_coverage
```

## People

```text
service
era
award
conflict
profile_exists
story_complete
citation_complete
```

## Conflicts

```text
conflict
overview
timeline
map
operations
people
units
equipment
primary_sources
story_experience
```

Use matrices internally to choose what to research next.

---

# 87. CONTENT PRIORITIZATION SCORE

Do not prioritize solely by popularity.

A future internal scoring model may consider:

```text
Historical significance      30%
Coverage gap                 20%
Source availability          20%
Connection density           15%
Educational value            10%
Audience interest             5%
```

Weights may evolve.

The purpose is to prevent content planning from becoming "whatever is trending".

---

# 88. CONTENT QUALITY SCORECARD

Every publishable dossier should be reviewed across:

| Dimension | Question |
|---|---|
| Accuracy | Are material facts evidence-backed? |
| Source quality | Are authoritative sources used where available? |
| Completeness | Does it answer the basic reader questions? |
| Context | Does it explain why the subject matters? |
| Neutrality | Is wording factual rather than propagandistic? |
| Connectivity | Are important relationships represented? |
| Media rights | Is imagery properly licensed/credited? |
| Accessibility | Is the content understandable and media described? |
| Safety | Does it avoid sensitive operational aggregation? |
| Freshness | Is review/update metadata appropriate? |

Do not reduce this to a public star score.

---

# 89. CONTENT LIFECYCLE

Use explicit states:

```text
DISCOVERED
  ↓
SOURCED
  ↓
DRAFT
  ↓
FACT_REVIEW
  ↓
EDITORIAL_REVIEW
  ↓
PUBLISHED
  ↓
REVISION_REQUIRED
  ↓
ARCHIVED
```

V1 Git-based workflows can approximate this with frontmatter/status fields.

Later CMS versions can formalize it.

---

# 90. CORRECTIONS POLICY

Corrections are part of credibility.

For meaningful published corrections, record:

- entity/page;
- field or claim;
- old value where appropriate;
- corrected value;
- reason;
- source;
- date;
- reviewer.

Minor typography fixes need not create public correction notices.

Material historical corrections should preserve an audit trail.

---

# 91. CONTENT METRICS BY VERSION

Do not use one KPI throughout the product's life.

## V1 — Trust

Measure:

- material claims with evidence;
- broken sources;
- content-validation failures;
- source quality.

## V1.5 / V2 — Coverage

Measure:

- coverage matrix completion;
- orphan entities;
- source density;
- domain/service/era gaps.

## V3 — Story depth

Measure:

- story completion;
- related-entity exploration;
- source opens;
- War Room interaction.

## V4 — Research value

Measure:

- authoritative sources/entity;
- evidence coverage;
- data downloads;
- source-reader use.

## V5 — AI grounding

Measure:

- supported factual statements;
- retrieval precision;
- citation correctness;
- abstention quality;
- unsupported-claim rate.

---

# 92. CONTENT SCALE GUIDANCE

Illustrative—not public commitments:

| | V1 | V1.5 | V2 | V3 | V4 | V5 |
|---|---:|---:|---:|---:|---:|---:|
| Sources | 300–500 | 1.5K+ | 5K+ | 15K+ | 50K+ | 100K+ |
| People | ~50 | 200–300 | 750+ | 1.5K+ | 3K+ | 5K+ |
| Equipment | ~100 | 250–350 | 500+ | 800+ | 1K+ | 1.5K+ |
| Events | 40–60 | 200+ | 500+ | 1.5K+ | 5K+ | 10K+ |
| Operations | 15–20 | ~50 | 150+ | 300+ | 500+ | 750+ |
| Stories | 15–20 | ~50 | 100+ | 250+ | 500+ | 750+ |
| War Rooms | 1 | 2–3 | 3–5 | ~10 | 15+ | 20+ |

Quality gates override numeric targets.

---

# 93. ARCHITECTURE EVOLUTION BY VERSION

## V1

```text
MDX / structured files
        ↓
Zod validation
        ↓
relationship resolver
        ↓
Next.js
        ↓
static/server-rendered site
```

## V1.5–V2

Keep content model stable.

Add better:

- indexes;
- generated search;
- relationship materialization;
- editorial scripts.

Migrate to a database only when operationally justified.

## V2.5–V3

Potential:

```text
Postgres / Supabase
      ↓
editorial workflow
      ↓
content API
      ↓
Next.js
```

Migration is optional until Git-based editing becomes a bottleneck.

## V4

Potential architecture:

```text
SOURCE STORE
      │
CLAIM / EVIDENCE
      │
STRUCTURED KNOWLEDGE
      │
 ┌────┼─────────┐
 │    │         │
WEB  SEARCH   DATA LAB
 │
GRAPH EXPLORER
```

A graph database is still optional. Postgres can represent many relationships effectively.

## V5

```text
              VERIFIED KNOWLEDGE
                     │
          ┌──────────┴──────────┐
          │                     │
     SEARCH / GRAPH        VECTOR INDEX
          │                     │
          └──────────┬──────────┘
                     │
                 RETRIEVAL
                     │
                    LLM
                     │
             CITATION VALIDATOR
                     │
                 USER ANSWER
```

Do not introduce V5 infrastructure in V1.

---

# 94. VERSION EXIT GATES

## V1 → V1.5

Proceed only when:

- core journeys work;
- Kargil War Room is polished;
- content validator is reliable;
- sourcing model works;
- mobile/accessibility are strong.

## V1.5 → V2

Proceed when:

- campaign-pack workflow is repeatable;
- content gaps can be measured;
- entity model remains stable under expansion.

## V2 → V2.5

Proceed when:

- core military-history coverage is substantial;
- beginner explainers show clear demand;
- programme/industry relationships can be sourced reliably.

## V2.5 → V3

Proceed when:

- underlying content is deep enough to support storytelling;
- interactive experiences can reuse structured entities rather than hardcoded facts.

## V3 → V4

Proceed when:

- archive/source corpus is large enough for serious research tools;
- claim/evidence records have useful density.

## V4 → V5

Proceed only when:

- retrieval quality can be benchmarked;
- evidence coverage is strong;
- the system can abstain;
- citation validation is reliable.

Do not launch Ask SENTINEL simply because an LLM API is available.

---

# 95. WHAT SENTINEL MUST NEVER BECOME

Across all versions, resist:

- breaking defence-news portal;
- political propaganda;
- "India vs X — who wins?" simulations;
- weapon power rankings;
- casualty scoreboards;
- live troop tracking;
- live military vessel/aircraft aggregation intended for operational awareness;
- sensitive facility intelligence;
- anonymous military forums;
- sensational clickbait;
- unsourced AI answers;
- automated SEO article farms;
- mass-generated hero stories without verification.

The competitive advantage is **trust + connection + experience**.

---

# 96. LONG-TERM PRODUCT NORTH STAR

SENTINEL should ultimately let a user begin anywhere:

```text
PERSON
CONFLICT
SHIP
AIRCRAFT
BATTLE
LOCATION
DOCUMENT
AWARD
OPERATION
```

and naturally move through:

```text
DISCOVER
   ↓
UNDERSTAND
   ↓
EXPLORE
   ↓
VERIFY
   ↓
GO DEEPER
```

The long-term moat is not the number of articles.

It is the combination of:

```text
VERIFIED SOURCES
      +
CLAIM-LEVEL EVIDENCE
      +
STRUCTURED KNOWLEDGE
      +
CONNECTED DISCOVERY
      +
MUSEUM-QUALITY STORYTELLING
      +
RESEARCH TOOLS
      +
CITATION-GROUNDED AI
```

---

# 97. UPDATED CODING-AGENT DIRECTIVE

The coding agent must understand the distinction between **future-proofing** and **premature implementation**.

For V1, implement:

- stable IDs;
- Source;
- Evidence;
- Claim;
- Entity;
- Story;
- relationships;
- content validation;
- source-first UI;
- Kargil War Room;
- the V1 experiences defined in this specification.

Do **not** implement merely because it appears in the roadmap:

- CMS;
- database migration;
- graph database;
- Data Lab;
- oral-history ingestion system;
- research workbench;
- multilingual infrastructure beyond normal i18n-friendly coding practices;
- RAG;
- vector database;
- chatbot;
- LLM generation;
- automated content ingestion.

The V1 data model should make those additions possible later without requiring them now.

---

# 98. UPDATED FIRST AGENT PROMPT

Use this prompt after placing this master specification in the repository:

```text
You are the lead engineer and product-minded frontend architect for SENTINEL.

Read `SENTINEL_MASTER_BUILD_SPEC.md` in full. Treat it as the product, content, editorial and engineering source of truth.

The specification contains a V1–V6+ roadmap. IMPORTANT: only V1 is current implementation scope. Future versions define architectural direction and must NOT be prematurely implemented.

First inspect the repository and report:
1. current stack and folder structure;
2. what already satisfies the specification;
3. conflicts between the repository and specification;
4. the smallest sensible V1 implementation sequence;
5. how you will preserve the Source → Evidence → Claim → Entity → Story → Experience model without over-engineering it.

Then create `docs/implementation-plan.md` containing:
- exact tasks;
- exact files;
- interfaces between tasks;
- tests;
- acceptance criteria;
- verification commands.

Do not begin large-scale implementation until that plan exists.

V1 engineering rules:
- strict TypeScript;
- server components by default;
- mobile-first;
- accessible;
- reduced-motion support;
- source-first;
- stable content IDs;
- Zod validation;
- referential integrity;
- Source, Evidence and Claim are distinct concepts;
- do not invent historical facts, technical values, quotations or citations;
- clearly mark non-production fixtures;
- no CMS;
- no auth;
- no database unless the existing repository already requires one;
- no Neo4j;
- no AI chatbot/RAG;
- no breaking-news system;
- no live military tracking;
- no fake spy/HUD gimmicks.

Flagship V1 experience:
Kargil 1999 / Operation Vijay War Room.

Design target:
premium modern editorial archive + restrained intelligence/aerospace visual language.

Product journey:
DISCOVER → UNDERSTAND → EXPLORE → VERIFY.

Run after each major implementation phase:
npm run lint
npm run typecheck
npm test
npm run validate:content
npm run build

Start with repository inspection and `docs/implementation-plan.md`.
```

---

# END OF VERSIONED ROADMAP & CONTENT STRATEGY

# END OF MASTER SPEC

---

# 29. EXHAUSTIVE DATASET STRATEGY & PROVENANCE (Version 2.5)

Before proceeding to immersive storytelling (Version 3), SENTINEL must establish a heavily provenanced, bounded-exhaustive dataset. The long-term moat of the project is not UI spectacle, but rather:
- trusted sources;
- claim-level evidence;
- stable entity IDs;
- temporal relationships;
- source lineage.

## 29.1 The Provenance Chain
All future architecture must preserve this chain:
`Source Family -> Source -> Source Version -> Document/Media -> Evidence -> Candidate Claim -> Editorial Review -> Verified Claim -> Entity + Temporal Relationship`

## 29.2 Bounded Exhaustiveness
Absolute exhaustiveness is impossible. Every domain must define its inclusion criteria, exclusions, and known universe, and map its internal coverage (e.g. known vs. source complete vs. editorially reviewed). Never publicly claim "100% complete" unless the universe is finite and authoritative.

## 29.3 Strict Safety Boundary
SENTINEL is an educational/historical archive, not an operational-intelligence product. Do not create or publish aggregated datasets of live troop locations, current readiness states, sensitive facility layouts, or any data whose primary utility is real-time targeting.

## 29.4 Source Authority Tiers
- **Tier A (Primary/Authoritative):** Government of India, MoD, Armed Forces, National Archives, PIB, etc.
- **Tier B (Institutional/Technical):** DRDO, DPSUs, UN records, official military histories.
- **Tier C (Scholarly/Secondary):** Peer-reviewed research, established historians, major reputable journalism.
- **Tier D (Specialist):** Established specialist defence publications.
- **Discovery Only:** Wikipedia, social media, blogs, unattributed infographics. Discovery material cannot establish a material claim by itself.

---

# 30. AUTOMATED GOLDEN DATASET FACTORY (Version 3.0)

## 30.1 Concept
After establishing the manual provenance foundation (V2.5), the objective is to build a machine-driven pipeline to orchestrate the generation of Exhaustive Datasets with 80-95% automation.

## 30.2 Core Architecture
- **Dagster Orchestration:** Manages the lineage of data from Source → Document → Claim → Gold.
- **Agentic Extraction:** LLM agents act as "Database Transaction Proposers," strictly extracting atomic claims linked to evidence locators.
- **Exception-Based Review:** Humans interact via a Review Dashboard to approve Candidate datasets, resolve ambiguity, and correct source contradictions.
- **dbt Analytics:** Used strictly downstream of Postgres for presentation and analytics modeling.

The long-term automation vision is appended to `SENTINEL_EXHAUSTIVE_DATASET_BUILD_STRATEGY.md`. For the existing application's current implementation, follow `docs/implementation-plan.md` and its shared contracts/test/content runbooks. Begin at the first unverified task in `progress_tracker.md`; do not execute legacy initial-build prompts or treat the automation vision as a completed feature.
