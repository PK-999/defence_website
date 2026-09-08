# T25 verification — fail-closed extraction factory

Removed missing-source and unavailable-model fallbacks from the Python factory. The extraction core now validates Pydantic output against the ontology, requires every quote to exist in the captured source, derives deterministic source-version/claim identities, and returns candidates before any persistence call. The Dagster sync validates all source/entity preconditions before an atomic transaction; failures raise and roll back rather than silently skipping records. The CLI requires explicit source, ontology, and model-response inputs and never seeds demo data.

Evidence:

- `uv run --directory factory pytest tests/test_extraction.py` passed 4/4 on Python 3.14.6 / pytest 9.1.1.
- `uv run --directory factory factory --help` exposes the explicit validation CLI.
- A valid captured Tejas response produced stable source/claim identities; a response with a missing quote failed with `INVALID_EXTRACTION` before any write path.
- `uv.lock` records the pytest development dependency.
