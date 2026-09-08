# T07 verification — validation and publication

Implemented read-only database validation, field-level publication issues, revision-checked publish/withdraw transactions, audit rows, and legacy content validation that exits nonzero on errors.

`npm run test:integration` passed publication validation and withdrawal checks. `npm run validate:database` passes on the clean fixture and reports warnings for candidate/rejected claims without evidence. `npm run validate:content` correctly fails the legacy corpus for two missing slugs; no defaults were invented.
