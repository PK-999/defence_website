# Research brief: useful, credible Indian defence discovery

8 September 2026. Audience: SENTINEL owner, designers, content editors and implementers. Scope: a public educational reference for enthusiasts, students and researchers; historical foundation plus dated current-information expansion. Findings combine fresh primary-source retrieval and limited public UX discussion. This is not a complete Indian defence dataset or research with SENTINEL users.

## Executive read

SENTINEL should make the path from a question to an attributable answer unusually easy. Public discussions reveal interest in reliable defence sources, but do not establish how often SENTINEL users experience any particular problem. Official material spans historical accounts, technical catalogs, financial periods and recruitment notices, which need different metadata. A single generic article schema and a green source badge cannot express those distinctions. The spy theme can make investigation engaging through dossiers, evidence inspection and saved trails while keeping factual status explicit. Complete one sourced historical trail first, then add bounded collections and time-sensitive desks with freshness rules.

## Source-grounded content additions

These are research candidates for editorial ingestion, **not public database writes**. Access date for every source: 8 September 2026. Retain underlying snapshots, hashes and exact locators before publication under the existing runbook.

| ID | Supported candidate / product implication | Primary source and date | Locator / confidence / limitation |
|---|---|---|---|
| R01 | Operation Safed Sagar supported Army Operation Vijay; Mirage-2000 is among the aircraft listed. Build conflict → operation → equipment evidence trail. | [MoD, The Nation remembers Kargil War Heroes](https://www.pib.gov.in/newsite/erelcontent.aspx?lang=2&reg=48&relid=50974), 26 July 2009 | Paragraph beginning “Various aircraft”. High for this official account; does not establish every variant or current service status. |
| R02 | 152 Helicopter Unit participated in Safed Sagar. This supports a unit-level connection, with a separate account of the 28 May 1999 event. | [MoD, Kargil anniversary at Sarsawa](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2033075&lang=2&reg=48), 14 July 2024 | Paragraphs on 152 HU and Nubra formation. High for attributable statement; each person, award and event still needs its own exact scoped record. |
| R03 | The 2026 retrospective places the IAF campaign entry on 26 May 1999. Use dated chronology rather than sorting raw strings. | [PIB, Kargil Vijay Diwas 2026](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2288840&lang=1&reg=3), 24 July 2026 | “Operation Vijay Begins”. High for this source's account. R01's mid-May support is a different activity; do not collapse both into one start date. |
| R04 | MoD allocation for FY 2026–27 is reported as ₹7.85 lakh crore. Store fiscal year, INR units, budget-estimate basis and source date. | [MoD budget allocation release](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2221612&lang=1&reg=3), 1 February 2026 | Headline/opening. High for announced allocation, not expenditure, delivery or combat capability. |
| R05 | PIB reports FY 2024–25 defence production ₹1.54 lakh crore and exports ₹23,622 crore. Separate realized-period figures from future targets. | [PIB, Defence Atmanirbharta](https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=156103&lang=1&reg=1), 20 November 2025 | Key Takeaways. High for dated official report; not a claim these are the latest revised series as of every future visit. |
| R06 | NDA/NA II 2026 examination is listed for 13 September 2026; applications closed 11 June 2026 at 6pm. As of this review, an Apply CTA would be wrong. | [UPSC examination record](https://www.upsc.gov.in/examinations/National%20Defence%20Academy%20and%20Naval%20Academy%20Examination%20(II),%202026), notification 20 May 2026; press note 3 September 2026 | Examination metadata table. High for listed dates. Eligibility advice requires reading the current notice and corrigenda; no eligibility extraction claimed here. |
| R07 | DRDO offers a product discovery catalog suitable for source discovery. Catalog presence alone does not prove operational induction. | [DRDO Products](https://www.drdo.gov.in/drdo/offerings/products?field_product_type_target_id=7), publication date unavailable | Listing accessed; detailed product evidence not comprehensively reviewed. Discovery only for individual systems. |
| R08 | DRDO policy calls for permission for reproduction and attribution for references; do not assume government media is freely reusable. | [DRDO Website Policy](https://www.drdo.gov.in/drdo/website-policy), update date unavailable | Copyright and hyperlinking sections. High for visible policy; use links and original summaries pending asset-level rights review. |

No new casualty totals, present force strength, combat readiness, inventory totals or system performance claims were inferred. Naval history, awards, space/ISR, veterans, doctrine and heritage remain planned source lanes; they are not represented as already comprehensively researched.

## Ranked UX research signals

| Problem / user goal | Evidence / frequency | Severity / confidence | Product move |
|---|---|---|---|
| Find credible updates without guessing which publisher to trust | [IndianDefense source-request discussion](https://www.reddit.com/r/IndianDefense/comments/1s2g3r8/what_are_your_sources_to_get_indian_defense_news/), one directly opened thread; public anecdote, not SENTINEL feedback | High task importance; low population-frequency confidence | Evidence Vault, explain source authority per claim; preserve disagreement and original links. |
| Understand technical systems beyond names | [Technical-information request](https://www.reddit.com/r/IndianDefense/comments/1go0ww6/), search snippet only; direct open failed twice | Medium; weak source access | Field Manual, variant-aware equipment records and comparison. Validate with novice usability sessions before attributing demand broadly. |
| Distinguish older facts, current announcements and deadlines | R04–R06 have materially different time semantics; product inference from official artifacts | High; high metadata need, unknown user frequency | Display “reported on”, “covers FY”, “as of” and “applications closed” separately. |
| Follow evidence through connected topics | Current code review finds missing provenance on unit/operation paths; internal source-code observation | High; high implementation confidence | One shared dossier layout and evidence-linked relationships. |
| Operate search by keyboard and recover from failure | Source review + [W3C Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), retrieved this run | High; static gaps confirmed, assistive testing pending | Label input; active descendant; one owner; full GET search; clear retry. |

No internal analytics, interviews, support tickets, CRM or authenticated user research was supplied. No public claim about SENTINEL adoption or satisfaction is made. X, Hacker News and Stack Overflow were not used as substitutes for relevant Indian-defence user evidence. Reddit source discovery is hypothesis generation, not an authority ranking of news outlets.

## Coverage programme

| Release lane | Finite first scope | Required fields and editorial controls | Proposed freshness review |
|---|---|---|---|
| Kargil case file | Existing T26 connected collection, use R01–R03 as targeted follow-up candidates | Identity, precise dates, section/claim evidence, explicit relationships, rights | Annual historical review; sooner on correction |
| 1971 case file | Existing T28 candidate manifest | Conflict/operation/ship-class distinctions; exact attribution; no guessed vessel specs | Annual |
| Services and units | One sourced overview per service plus explicitly evidenced starter units | Service taxonomy, historic/as-of hierarchy, no unsupported locations or strength | Quarterly for current organization |
| Equipment | Five sourced Indian-service variants across selected domains | Variant, role, development model, as-of service status, unit/context per spec | Quarterly status; versioned specification changes |
| Situation Briefs | One reviewed weekly digest with 3–5 original-source developments | Event date, publication date, source, what changed, uncertainty, linked dossiers | Daily expiry check, weekly editorial digest |
| Policy/industry | One fiscal-year budget brief and one programme milestone history | BE/RE/actual, INR scale, fiscal year, programme/organization/platform separation | On official revision; monthly check |
| Field Manual | 30 reviewed terms and three learning trails | Acronym expansion, plain definition, source, examples linked to public records | Six-month review |
| Careers | One current official examination/entry notice | Issuer, dates/timezone, eligibility notice, corrigenda, expiry, original CTA | Daily while active; mark stale if checks lapse |
| Heritage/veterans | Five official destinations/resources | Public visiting/contact information, dated access details, rights, original service links | Quarterly; time-sensitive detail on notice |
| Hindi expansion | Translate the first approved collection and glossary | Language tags, reviewed terminology, original citations, Devanagari font | With source revision |

These are proposed editorial service levels and finite targets, not measured coverage or promises of automated freshness. Expired content remains in the historical archive with clear status. Do not auto-publish scraped material to meet a cadence.

## Gap reconciliation and stopping decision

- **Historical date scope:** R01 describes mid-May support; R03 dates campaign entry to 26 May. Preserve activity-specific dates; no contradiction resolved by deleting one source.
- **Financial periods:** R04 budget allocation and R05 production/exports measure different things. No combined “defence capability” score.
- **Source metadata:** UPSC's footer says 2022 while its examination table includes 2026 updates; use document-specific dates rather than footer freshness.
- **Rights:** Catalog discovery does not authorize asset reuse. R08 bounds display rights; downloads/excerpts require the existing source policy.
- **Visual evidence:** the 9 September [resumed audit](visual-audit-2026-09-09.md) adds one accepted Equipment screenshot. Subsequent captures failed; no overall polish verdict. Resume the remaining capture gate; do not repeat broad research.
- **User evidence:** Public anecdotal scan is weak. Run five consenting usability sessions (novice, enthusiast, student mix), testing find→read→source, without priming users with proposed menu labels. Record task success, hesitation and label interpretation.

Search waves: (1) India MoD reporting/production and Indian-defence source requests; (2) exact PIB budget, DRDO catalog/policy, UPSC notice, W3C combobox; (3) Kargil/IAF primary follow-up; (4) exact opens and date/rights reconciliation. UK MoD results were excluded as wrong jurisdiction. Two failed opens of the technical-information discussion ended that retrieval. Stop: enough evidence supports the architecture/content plan; remaining gaps require publication/editor inputs, user sessions or functioning visual capture, not more broad queries.

## Delivery boundaries

The research data is added to this review package. No source snapshot is claimed imported, no new record is labeled GOLD, and no claim is represented as newly published. Future ingestion should deduplicate R01–R03 against existing T26 evidence before adding versions.
