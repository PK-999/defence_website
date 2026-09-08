# T13 verification — ranked search

Added public SearchDocument projection/reconciliation, normalized aliases, deterministic title/alias/body ranking, all six entity types, literal punctuation matching, bounded quick/full responses, and 503 API handling. Publication transactions now rebuild or remove the changed projection.

`npm run test:integration` passed index rebuild, title ranking, quick result bounds, draft exclusion, typed Source/Equipment search, literal `%/_`, and short-query rejection. Run `npm run reconcile:search` as an explicit repair operation for an existing database.
