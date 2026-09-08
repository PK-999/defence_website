# T12 verification — reviewed Forces and units

Forces now reads published Unit rows only, keeps service and tab state in the URL, renders honest empty overview/organization states, and links to canonical `/forces/units/[slug]` pages. Unsourced hardcoded map, strength, base, motto, and war-cry claims are no longer rendered by the public Forces page.

The production build includes the unit route, and `tests/e2e/forces.spec.ts` covers URL tab state and the truthful empty-unit state. On 7 September 2026, the spec passed in desktop and mobile Chromium as part of a 14/14 passing suite. A sourced, published real unit is still needed before the complete unit-detail journey can be accepted.
