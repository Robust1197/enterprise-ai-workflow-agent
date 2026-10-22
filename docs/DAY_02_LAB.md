# Day 2 lab — Pydantic business contracts
**Date:** 2026-10-22 | **Morning:** 60 min concepts | **Evening:** 120 min learner writes the models.
**Status:** tests prepared by AI, core Pydantic models deliberately incomplete.

## Business scenario
A Japanese-language support operator submits a ticket. The system validates incoming data, assigns an identity when storing it, and later validates structured output produced by an LLM. Incorrect values must not silently enter the CRM.

## Contract to implement in app/domain/models.py

1. `TicketCreate(BaseModel)`
   - `subject`: required `str`, 3–120 characters.
   - `description`: required `str`, 10–2000 characters.
   - `locale`: default `"ja"` (string).
   - Unknown extra input fields must be rejected rather than silently dropped. Hint: `ConfigDict(extra="forbid")`.

2. `Ticket(TicketCreate)`
   - `id`: required UUID.
   - `created_at`: required datetime.
   - `status`: limited to `"new"` or `"triaged"`; default `"new"`.

3. `TriageResult(BaseModel)`
   - `category`: required, one of `"payment_issue"`, `"access_issue"`, `"general"`, `"other"`.
   - `priority`: required, one of `"low"`, `"medium"`, `"high"`, `"critical"`.
   - `summary`: required text, 5–300 chars.
   - `needs_human_review`: required, **strict Boolean**; string `"yes"` is invalid.

## Concepts to research and use
`from pydantic import BaseModel, Field, ConfigDict, StrictBool`
`from typing import Literal`
`from uuid import UUID`
`from datetime import datetime`

Hint: `Field(min_length=..., max_length=...)`, `Literal["new", "triaged"]`, `model_config = ConfigDict(extra="forbid")`.

Important: a type hint without Pydantic does not automatically validate function calls, and Pydantic v2 may coerce input types unless strict validation is specified.

## Deliberate RED -> GREEN sequence
- RED: run `uv run pytest tests/test_models.py -q --tb=line` before editing the models. Failures are **expected**, not a broken environment.
- GREEN: implement `TicketCreate` first; run `uv run pytest tests/test_models.py -q -k ticket_create`.
- Then implement `Ticket` and test it: `uv run pytest tests/test_models.py -q -k ticket_includes`.
- Finally implement `TriageResult`, checking `StrictBool`/schema tests: `uv run pytest tests/test_models.py -q -k triage_result`.
- REGRESSION: `uv run pytest -q` should include yesterday's two health tests and today's ten new tests.
- REFACTOR: remove `pass`, use clear typing and no hacks that silence the tests; make small changes.

## Required explanations from learner
- What differs between a type annotation and Pydantic runtime validation?
- Why do we reject unknown `priority` values instead of accepting arbitrary strings?
- Why do we enforce a strict Boolean for the LLM output?
- Why is `TicketCreate` different from persisted `Ticket`?

## Free reference
- https://docs.pydantic.dev/latest/concepts/models/
- https://docs.pydantic.dev/latest/concepts/fields/
- https://docs.pydantic.dev/latest/concepts/config/
- https://docs.pytest.org/en/stable/how-to/assert.html

## Definition of done
- 12 tests total (Day 1: two, Day 2: ten), all passed without skip/xfail;
- explain at least the four questions above;
- `git diff --check` clean; secrets not added; learner commits implementation as a separate commit;
- capture test summary in docs/QUALITY.md after verification.

## Do NOT confuse with a production release
These are domain validation tests only. Day 2 does not add ticket HTTP endpoints, database persistence, model inference or Salesforce integration.
