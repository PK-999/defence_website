# T11 verification — bounded collections

Added normalized collection query parsing, database-side public predicates and filters, stable title/id ordering, 24-item pagination with clamping, facet queries, collection toolbar, and pagination links. People and Equipment now use bounded repository reads instead of full-array filtering.

`npm run test:integration` passed the 55-person 24/24/7 pagination case, out-of-range clamping, public filtering, incompatible equipment filters, and legacy `force` alias handling. Component/browser filter checks remain deferred to the unavailable browser gate.
