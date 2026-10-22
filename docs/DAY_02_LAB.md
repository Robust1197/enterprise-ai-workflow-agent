# Day 2 lab — Pydantic business contracts
**Date:** 2026-10-22 | **Morning:** 60 min concepts | **Evening:** 120 min learner writes the models.
**Status:** Completed; 2026-10-23 clarification added after learner feedback. This is a retrospective exercise specification, not a request to redo the models.

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

3. `TriageResult(BaseModel)` — the **schema of an AI-proposed analysis**, NOT the classification algorithm.

   **Customer ticket example:** "クレジットカードで決済しようとするとエラーが発生し、注文を完了できません。"  
   **Illustrative proposed analysis** (the high priority is a teaching example, not a production decision rule):

   ```json
   {
     "category": "payment_issue",
     "priority": "high",
     "summary": "決済時にエラーが発生し、注文を完了できない",
     "needs_human_review": true
   }
   ```

   **Your job for Day 2:** only declare four **required** data fields and validation rules; do not generate a category, decide urgency from ticket wording, summarize with an LLM, or call a CRM.

   | Field | Business meaning | Allowed data / coding concept |
   | --- | --- | --- |
   | `category` | Type of customer issue | `Literal["payment_issue", "access_issue", "general", "other"]` = payment, login/access, general inquiry, other |
   | `priority` | Relative queue handling priority | `Literal["low", "medium", "high", "critical"]` = low, medium, high, severe |
   | `summary` | Short text restatement of the customer's issue, not a category | Required `str`, length 5–300; use `Field(min_length=5, max_length=300)` |
   | `needs_human_review` | Should a person review the AI proposal? | Required `StrictBool`; true/false only, reject the string `"yes"` |

   **What should pass:** a valid sample using these four fields.

   **What should fail:** `priority="super_urgent"`, `summary="NG"`, `needs_human_review="yes"` (a string, not a Boolean). Every failed case must raise a Pydantic `ValidationError`.

   **Why:** an AI model may invent business labels or send malformed values. Pydantic checks their *shape and constraints*, but does not prove classification accuracy, assign priorities, or grant CRM write permission. Those are separate parts of the Agent workflow.

   **Read first:** https://docs.python.org/3/library/typing.html#typing.Literal · https://docs.pydantic.dev/latest/concepts/fields/ · https://docs.pydantic.dev/latest/api/types/#pydantic.types.StrictBool

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
- 10 domain tests (Day 2) plus 2 earlier health tests; full repo also has mobile browser-harness tests; all pass without skip/xfail;
- explain at least the four questions above;
- `git diff --check` clean; secrets not added; completed work recorded in GitHub; remote/local history synchronization tracked separately;
- capture test summary in docs/QUALITY.md after verification.

## Do NOT confuse with a production release
These are domain validation tests only. Day 2 does not add ticket HTTP endpoints, database persistence, model inference or Salesforce integration.
