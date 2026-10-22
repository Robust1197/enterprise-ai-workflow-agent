# Day 2 evidence — 2026-10-22
**Stage:** PASS — learner-authored TicketCreate, Ticket and TriageResult implemented and verified in Windows DevSpace. Four conceptual explanations can be revisited during review.

## Environment and Git
- Project: `$HOME\Project\enterprise-ai-workflow-agent`.
- Git branch `main`, last committed revision `5c83ef9 chore: initialize AI workflow agent project`, was clean before Day 2 scaffold.
- Installed: Python 3.12.15 / Pydantic 2.14.1 / FastAPI 0.156.8 / pytest 9.1.1.
- The local Windows branch still has untracked Day 2 files; these model changes are not committed locally. Separately, only the mobile website and Pages workflow were published to GitHub via connector commit `8d5b037`; local Git history has not been synchronized with that remote commit.

## Repeated Day 1 regression
`uv run pytest tests/test_health.py -q --tb=line`:
```
2 passed, 1 warning in 0.46s
```
The warning is the previously known Starlette TestClient/httpx compatibility deprecation notice.

## Day 2 test-first baseline (intentionally failing)
`uv run pytest tests/test_models.py -q --tb=line`:
```
10 failed in 0.26s
```
All failures are expected: `TicketCreate`, `Ticket`, `TriageResult` are deliberately empty `BaseModel` placeholders. Failures include missing required fields, missing validation on short/oversized input and uncontrolled enum or boolean values.

## Mobile companion implementation (separate from learner's model task)
- `learning-web/`: phone-optimized HTML/JS, worker-based Pyodide 314.0.7 with planned Pydantic 2.14.1 runtime; ten matching Pydantic validation cases, progress export/import and local auto-save.
- Standalone harness independently verified on Windows: `uv run pytest tests/test_learning_web.py tests/test_health.py -q` = **5 passed, 1 warning** (three harness tests + two health tests).
- JS syntax validated with `node --check`, Python harness compiled on Windows. Source and Pages workflow are now present in the public GitHub repository; **actual Pages deployment/public URL and Android/WebAssembly execution remain unverified**.

## TicketCreate and Ticket verified (learner-authored)
- User's `TicketCreate` with `ConfigDict(extra="forbid")`, subject 3–120, description 10–2000, and locale `ja` was reviewed and applied.
- User's `Ticket` extends `TicketCreate` with required `id: UUID`, `created_at: datetime`, and `status: Literal["new", "triaged"] = "new"`. Syntax, creation, inherited fields, default, and unknown status rejection tested.
- Targeted project tests: `uv run pytest tests/test_models.py -q -k 'ticket_create or ticket_includes' --tb=short` => **6 passed, 4 deselected**.
- Full suite: `uv run pytest -q --tb=short` => **11 passed, 4 failed, 1 warning**. All four failures are intentionally incomplete `TriageResult`, left untouched for learner.

## Final Day 2 acceptance — PASS (2026-10-22)
User wrote and corrected the full `TriageResult` model. Only its placeholder body and the necessary `StrictBool` import were changed in `app/domain/models.py`, with whitespace-only formatting normalization; `TicketCreate` and `Ticket` remained unchanged.

Validated fields:
- `category: Literal["payment_issue", "access_issue", "general", "other"]`
- `priority: Literal["low", "medium", "high", "critical"]`
- `summary: str = Field(min_length=5, max_length=300)`
- `needs_human_review: StrictBool`

Executed in Windows DevSpace:
```
uv run pytest tests/test_models.py -q -k triage_result
4 passed, 6 deselected in 0.19s

uv run pytest -q
15 passed, 1 warning in 0.57s

uv run python -m py_compile app/domain/models.py
PASS (no errors)
```
The warning remains the known Starlette TestClient/httpx deprecation, deferred to maintenance. Total: 2 health + 10 business model + 3 mobile harness tests = 15.

**Git status:** No local commit was created. Local HEAD is still `5c83ef9`; website deploy files exist on remote commit `8d5b037`, so local/remote histories must be reconciled before attempting to push the learner's work. Do not force-push or use blanket `git add .` without reviewing files.

## Next checkpoint
- Explain `Literal` vs `StrictBool`, validation vs authorization, and why `TicketCreate` and persisted `Ticket` have separate ownership of fields.
- Proceed to Day 3 API request/response schemas, HTTP status codes and input-validation tests.
- Reconcile Git local/remote history carefully and commit the completed Day 2 models separately. Ensure no secrets are staged.
