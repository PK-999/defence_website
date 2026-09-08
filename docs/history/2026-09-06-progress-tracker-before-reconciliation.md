# Historical progress tracker — not current verification evidence

Preserved before documentation reconciliation on 6 September 2026. The checkboxes below were historical assertions and include known mismatches with the implementation. Use ../../progress_tracker.md only for current status.

# SENTINEL — Master Progress Tracker

This document tracks the progress of SENTINEL (Indian Defence Archive) across multiple versions and development stages.

## VERSION 1: The Core Vertical Slice
**Status:** In Progress
**Goal:** Prove the UX and architecture. Focus on a restricted seed dataset and the flagship "Kargil 1999" interactive experience. No database; content stored in Markdown/MDX.

### Stage 1: Foundation & Setup
- [x] Initialize Next.js App Router project (TypeScript, Tailwind CSS v4)
- [x] Configure `shadcn/ui` and install necessary primitives
- [x] Implement the visual design system palette (dark intelligence-archive theme)
- [x] Set up content folder structure (`/content/conflicts`, `/content/people`, etc.)
- [x] Define Zod schemas for markdown/MDX frontmatter validation
- [x] Create the build-time content validation script (`npm run validate:content`)

### Stage 2: Global UI Components
- [x] Build `SiteHeader` (Navigation, Branding)
- [x] Build `SiteFooter` (Trust block, Methodology links)
- [x] Build `Breadcrumbs` (Hierarchical navigation)
- [x] Implement `GlobalSearch` (Client-side static index using fuse.js or similar)
- [x] Create `SourceBadge` and `VerificationBadge` UI components
- [x] Create `ExternalSourceLink` component

### Stage 3: Core Pages & Templates
- [x] **Home Page**: Hero section, Editorial story cards, Explore portals, Timeline strip
- [x] **History Landing Page**: Chronological timeline and conflict cards
- [x] **People Landing Page**: Hall of Valour listing with filters
- [x] **Person Profile**: Biography, service timeline, citations
- [x] **Operations Landing Page**: Operations listing by category
- [x] **Operation Detail**: Objective, outcome, timeline, linked entities
- [x] **Arsenal Landing Page**: Equipment categorized by domain (Air, Land, Sea, Missiles)
- [x] **Equipment Detail**: Role, status, specifications, service history
- [x] **Forces Landing Page**: High-level structure (Army, Navy, Air Force)
- [x] **Archive Landing Page**: Source record exploration with filters
- [x] **Source Detail**: Provenance, publisher, summary, linked entities
- [x] **Compare Experience**: Compare up to 3 systems side-by-side

### Stage 4: Flagship Experience (Kargil War Room)
- [x] Implement `HistoricalMap` (Static/coarse coordinates map)
- [x] Implement `WarRoomTimeline` (Interactive scrubbing)
- [x] Implement `WarRoomDossier` (Event details synchronized with map/timeline)
- [x] Connect map, timeline, and dossier states

### Stage 5: Connections Explorer & Content Seeding
- [x] Implement `ConnectionExplorer` (React Flow or grouped cards) for entity relationships
- [x] Seed content: 5 major conflicts (1947, 1962, 1965, 1971, 1999)
- [x] Seed content: 12-20 person profiles
- [x] Seed content: 10-15 operations
- [x] Seed content: ~30 representative equipment systems
- [x] Seed content: ~25 source records

### Stage 6: Polish & Verification
- [x] Ensure fully responsive design (Desktop & Mobile)
- [x] Implement motion system (Framer motion - hover/focus transitions, `prefers-reduced-motion` support)
- [x] Final content validation pass (`validate:content`)
- [x] Accessibility review (Screen readers, textual fallbacks for map)

---

## VERSION 2: Expansion & Scale
**Status:** Planned
**Goal:** Expand the dataset, move to a formal CMS or Database, and introduce advanced search capabilities.

### Stage 1: Data Migration
- [x] Evaluate headless CMS or relational database (e.g., PostgreSQL + Prisma)
- [x] Migrate Markdown/MDX seed data to the database
- [x] Build admin dashboard for editorial content entry

### Stage 2: Advanced Search & Discovery
- [x] Integrate database-level search for full-text search (Option B)
- [x] Implement advanced filtering (boolean searches, deep tags)
- [x] Refine the global search UI with autocomplete and rich previews

### Stage 3: Advanced Graph & Relationships
- [x] Integrate a graph database/API to map complex relationships
- [x] Enhance the `ConnectionExplorer` into a full-page graph discovery tool
- [x] Map unit lineage and historical deployments

### Stage 4: Expanded Content
- [x] Expand History to include pre-1947 colonial and ancient military history (1857 Rebellion)
- [x] Add comprehensive order-of-battle (ORBAT) structures for historical periods
- [x] Increase equipment database to cover more variants (Tejas, Vikramaditya)

---

## VERSION 2.5: Exhaustive Dataset Foundation
**Status:** Planned
**Goal:** Establish a heavily provenanced, bounded-exhaustive dataset following the Source → Evidence → Claim → Entity model before adding flashy presentation features.

### Stage 1: Ontology & Provenance Model
- [x] Implement precise DB schemas for `Source`, `SourceVersion`, `Evidence`, `Claim`, and `EntityAlias`
- [x] Transition from flat models to temporal modeling (e.g. `valid_from`, `valid_to` for relationships)

### Stage 2: Source Registry Validation
- [x] Ingest the trusted source seed list (MoD, Armed Forces, Archives, etc.)
- [x] Implement Tier A-D classification for sources
- [x] Set up infrastructure for tracking source versions and fetching documents

### Stage 3: Golden Datasets
- [x] Build Golden Dataset 1 (e.g., Aircraft in Indian Service), 100% source-backed
- [x] Build Golden Dataset 2 (e.g., specific conflict or unit history), editorially reviewed

### Stage 4: Resolution & Coverage Mapping
- [x] Implement robust entity resolution (aliases, contextual matches) without relying purely on fuzzy string matching
- [x] Map internal coverage (known universe vs. source complete vs. editorially reviewed)

---

## VERSION 3.0: Automated Golden Dataset Factory (Dagster/dbt)
**Goal:** Transition from manual seeding to 80-95% machine-automated dataset generation with LLM transaction proposers and rigorous regression tests.

- [x] Create YAML configuration templates for datasets and sources (`config/`)
- [x] Establish Dagster orchestration pipeline for source ingestion and parsing
- [x] Implement AI Research Agents to extract atomic claims and handle gap analysis
- [x] Build Review Exception Dashboard for human-in-the-loop approvals
- [x] Integrate downstream dbt models for analytics transformations

---

## VERSION 4: Immersive Storytelling
**Status:** Concept
**Goal:** Add rich media, interactive 3D elements, and deeper community/research features.

### Stage 1: Rich Media Integration
- [ ] Integrate verified historical audio and video archives
- [ ] Add 3D model viewers for legacy and modern equipment (e.g., tanks, aircraft)
- [ ] Implement high-resolution document viewers for declassified sources

### Stage 2: Interactive Campaigns
- [ ] Expand the "War Room" concept to other major campaigns (1971 Bangladesh Liberation War)
- [ ] Create detailed maritime and aerospace operation visualizers

### Stage 3: Researcher Tools
- [ ] Add citation generators for students and researchers
- [ ] Implement a "Save for later" or "Research Collections" feature (requires user accounts)
- [ ] Allow community submission of sources (subject to strict editorial review and tiering)
