# Week 1 — Engineering foundation: Day 1–7
**Dates:** Oct 22–28, 2026 | **Available hours:** 7 × 3 = 21 hours | **Gate A:** an independently runnable, tested API skeleton.

> Current state: SCHEDULED, not implemented. Do not mark an item as done before running its test. Use synthetic Japanese ticket records only.

## Daily division
Morning (60m): 15m recall + 30m theory + 15m explain in own words.
Evening (120m): 15m test design + 65m learner-authored coding + 25m run tests/debug + 15m notes/commit.
A scheduled 3-hour learning budget includes mini-breaks between sessions where feasible.

### Day 1 / Thu Oct 22 — Environment and reproducibility
- Morning: interpreter vs venv, lockfile, Git, Python package boundaries. Answer: Why separate Python 3.12 from system Python 3.13?
- Evening: verify project directory, initialize Git only in that directory, uv Python 3.12 package, add FastAPI/Pydantic/pytest/HTTPX, add a health endpoint and its first test.
- Proof: versions and `uv run pytest -q` with first passing test; exact setup command in README.

### Day 2 / Fri Oct 23 — Domain models and type validation
- Morning: classes, type hints, optional fields, Enum/Literal, Pydantic validation errors. Explain input validation versus model-output validation.
- Evening: write `TicketCreate`, `Ticket`, `TriageResult`, category/priority enums, size limits; tests for Japanese input, blank/huge input and invalid enums.
- Proof: 4+ meaningful positive and negative model tests.

### Day 3 / Sat Oct 24 — REST API and storage
- Morning: GET/POST, status codes, DTO vs persisted entity, SQLite transaction boundaries.
- Evening: `GET /health/live`, `POST /api/v1/tickets`, `GET /api/v1/tickets/{id}`; SQLite database adapter; include API integration tests.
- Proof: create/read round-trip, 201/404/422 and clean test isolation.

### Day 4 / Sun Oct 25 — Deterministic baseline
- Morning: domain service and pure function, baseline accuracy, separation of transport logic.
- Evening: create Japanese ticket rule-based triage baseline, tests for payment/access/general ticket samples, `POST /triage` service wiring.
- Proof: input-to-output typed contract and unit tests; failures analyzed, not suppressed.

### Day 5 / Mon Oct 26 — LLM interface and mock
- Morning: Ports/adapters, dependency injection, structured output and hallucination risk.
- Evening: `TriageProvider` interface, deterministic `MockTriageProvider`, data validation for provider responses, integration test for invalid output.
- Proof: services can swap provider without editing business rules; mock not represented as a real model.

### Day 6 / Tue Oct 27 — Failures and diagnostics
- Morning: timeouts, exception mapping, correlation IDs and secret-safe logs.
- Evening: simulated provider timeout, typed HTTP 503, malformed output guard, trace ID in output; test for no sensitive logging.
- Proof: negative/error tests and failure matrix.

### Day 7 / Wed Oct 28 — Gate A and recovery buffer
- Morning: review schemas, HTTP, ports and adapters without notes; explain the code design aloud.
- Evening: fix issues, fresh `uv sync`, verify reproducibility, count meaningful passing tests, save sanitized test evidence, write what remains unfinished.
- Proof: **>=15 meaningful tests passing**, reproducible install, sample request/response and one-page engineering reflection. If not achieved, Gate A stays open and the following week begins with fixes.

## Day 1 commands (run manually only within this project)
```powershell
cd $HOME\Project\enterprise-ai-workflow-agent
pwd
py -0p
uv --version
git status
# Initialize Git only after verifying this new project is not already a repo.
git init -b main
# The following 'uv init' step is for a new project; check first that pyproject.toml doesn't exist.
uv init --bare --python 3.12
uv add fastapi uvicorn pydantic
uv add --dev pytest httpx
uv sync
uv run python --version
```
Note: DevSpace runs Git Bash in some sessions. Those lines are written for PowerShell; translate `pwd` to Git Bash as appropriate. DevSpace command tool should be used for builds/tests, not writing project files.

## Suggested folder map by end of Week 1
```text
app/
  __init__.py
  main.py
  api/routes.py
  domain/models.py
  services/triage.py
  ports/model.py
  adapters/mock_model.py
  adapters/sqlite_ticket.py
tests/
  test_models.py
  test_api.py
  test_triage.py
pyproject.toml
uv.lock
.env.example
```

## Free references
- Python typing: https://docs.python.org/3/library/typing.html
- uv: https://docs.astral.sh/uv/
- FastAPI: https://fastapi.tiangolo.com/tutorial/
- Testing: https://fastapi.tiangolo.com/tutorial/testing/
- Pydantic: https://docs.pydantic.dev/latest/
