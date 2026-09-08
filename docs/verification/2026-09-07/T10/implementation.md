# T10 verification — navigation and editorial pages

Added one navigation data source, active `aria-current` states, an accessible mobile Dialog menu, canonical redirects for history/people/equipment/sources, and real About, Methodology, Editorial Policy, Privacy, and Terms pages.

Production build confirms every new route compiles. `tests/e2e/navigation.spec.ts` covers editorial routes, the People heading, and the labeled mobile trigger. On 7 September 2026, `npm run test:e2e` passed this spec in both desktop Chromium and mobile Chromium as part of a 14/14 passing suite.
