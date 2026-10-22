# 30-Day AI Engineer Intensive — Enterprise AI Workflow Agent
**Edition:** 2026-10-21 v1.0 | **Start:** 2026-10-22 | **End:** 2026-11-20 | **Budget:** 30 × (1h morning + 2h evening) = 90 hours.

> This 30-day MVP supersedes the 12-week calendar **for scheduling only**. It does not redefine the original full-product promise or lower acceptance standards. Missing features are explicitly deferred, never reported as complete.

## Outcome in one month
Build a **reproducible, testable, local-first vertical slice** for processing synthetic Japanese customer-support tickets: input -> validation -> ticket persistence -> triage with model abstraction -> document retrieval with grounded citations -> bounded agent tool calls -> proposed write -> human approve/reject -> controlled idempotent simulated CRM write -> trace/evaluation.

At month-end:
- Required: API with tested contract, model abstraction (mock always; local model if host supports it), FAQ retrieval with verifiable citations, handwritten bounded Agent Loop, tool allowlist and argument validation, persistent approval decisions, audit log, automated evaluation, CI or locally reproduced checks, runbook and Japanese portfolio evidence.
- Stretch: Ollama real model integration when PC performance permits, vector embeddings with measured improvement over a lexical baseline, a minimal operator UI.
- **After month 1**: Salesforce Developer Edition live adapter (not merely simulator), Docker/cloud production deployment, scalable PostgreSQL/pgvector, multi-user auth/RBAC, LangGraph migration, complex UI. These require separate milestones and explicit evidence. Do not describe deferred features as built.

## Daily rhythm (same schedule every day, times flexible)
**Morning — 60 minutes**: (15m) revise yesterday and predict a failure, (30m) fundamentals and source reading, (15m) explain mechanism without notes and write a design hypothesis.
**Evening — 120 minutes**: (15m) plan test-driven target, (65m) code core logic personally, (25m) tests/debugging with AI as reviewer, (15m) record decision, evidence and next action.
Use 50-minute focus cycles and breaks between blocks. 30 calendar days include 4 review/recovery days (days 7, 14, 21, 28), not mandatory heavy feature days; their purpose is to sustain quality and absorb delays.

## 30-day detailed plan
All dates local Japan time. The morning column is the **underlying principle**; evening is the **code+verification artifact**.

| Day | Date | Morning (1h) | Evening (2h) | Exit evidence |
|---|---|---|---|---|
| 01 | Oct 22 | Python environments, uv, Git, module layout | Verify repo path; initialize only this repo; uv Python 3.12; create project skeleton + first smoke test | Version info; reproducible local test command |
| 02 | Oct 23 | Python type hints, Pydantic validation | `TicketCreate`, `Ticket`, `TriageResult` + boundary tests | Invalid cases rejected by schema |
| 03 | Oct 24 | HTTP, REST, status codes, persistence tradeoffs | FastAPI health, POST/GET tickets, SQLite repository | 201/404/422 round-trip tests |
| 04 | Oct 25 | Deterministic baseline, separation of concerns | Triage service + rules baseline + negative examples | Pure unit tests and clear API/service boundary |
| 05 | Oct 26 | Ports/adapters, LLM structured output | Define `TriageProvider`; inject mock; test malformed output | Model does not bypass schema |
| 06 | Oct 27 | Timeout, logs, correlation IDs, safe errors | Typed exceptions, request IDs, no secrets in logs | Timeout and malformed-input tests pass |
| 07 | Oct 28 | Review HTTP / schema / architecture | Fix failures, fresh `uv sync`, document Gate A and oral self-check | **Gate A:** >=15 meaningful tests pass |
| 08 | Oct 29 | Tokens, context windows, sampling, hallucination | Explore structured prompts using synthetic ticket cases | Prompt and output schema contract |
| 09 | Oct 30 | Local inference constraints, JSON Schema | Optional Ollama install/adapter only if RAM/CPU permit; otherwise record blocker and keep mock | Live integration result or honest feasibility report |
| 10 | Oct 31 | Information retrieval baseline & chunking | Import 10+ synthetic FAQ docs; source IDs and chunk metadata | Deterministic corpus import tests |
| 11 | Nov 01 | Inverted index, term retrieval, Recall@k | SQLite FTS/keyword retriever with ranked sources | Retrieval top-k reproducible |
| 12 | Nov 02 | Embeddings and cosine similarity | Optional local embeddings; compare against lexical retrieval | Measured comparison or documented defer |
| 13 | Nov 03 | Grounding, prompt injection, abstention | Retrieval-augmented answer service; reject fake citations; abstain if no evidence | Unsupported answer does not fabricate source |
| 14 | Nov 04 | Retrieval metrics and error taxonomy | Curate 30 QA cases; compute Recall@5; fix defects | **Gate B:** traceable sources and measured baseline |
| 15 | Nov 05 | Agent loop, tool calling, exit criteria | Write minimal bounded Agent Loop without framework; step budget | Unknown/duplicate/stop behavior tested |
| 16 | Nov 06 | JSON tool schemas and trust boundaries | Allowlist tools, validate args and permissions before invocation | Unauthorized tool produces no side effect |
| 17 | Nov 07 | CRM domain adapter and least privilege | Synthetic CRM Case read-only tool + fixture records | Read-only tool safe under invalid inputs |
| 18 | Nov 08 | Proposals vs execution, approval principles | Typed proposed write; diff, source proof, approval state | Proposal creates no business write |
| 19 | Nov 09 | State machines and persistent transitions | SQLite approval decisions, expiry and resume after restart | Pending approval survives simulated restart |
| 20 | Nov 10 | Idempotency, audit, transactional boundaries | Guarded simulated CRM update and append-only logical audit | Repeated approval cannot duplicate writes |
| 21 | Nov 11 | Threat modeling, adversarial testing | 20+ unauthorized/expired/invalid/malicious scenarios; fix bugs | **Gate C:** zero unauthorized writes in tested suite |
| 22 | Nov 12 | Eval dataset leakage and holdouts | Freeze 100 synthetic labeled tickets/questions including 30 manually checked holdout items | Dataset version, distribution, rationale |
| 23 | Nov 13 | Confusion matrix, accuracy, calibration | Reproducible evaluation runner for triage and retrieval | Accuracy, failure cases, sample size recorded |
| 24 | Nov 14 | CI and test determinism | GitHub repository + Actions *if authenticated workflow available*; otherwise offline repeatable CI commands | Clean run checks logged; no claim of remote CI if absent |
| 25 | Nov 15 | Data protection, auth scope, log hygiene | Config separation, safe telemetry, secrets scan, exception hardening | No credentials or raw PII in repo/logs |
| 26 | Nov 16 | Recovery and end-to-end scenario | Japanese ticket -> triage -> cited retrieval -> tool -> approval -> execution -> audit | Full flow reproducibly demonstrated |
| 27 | Nov 17 | Quality vs latency vs cost | Compare mock vs real local LLM if present; collect latency and invalid-response stats | Explicit hardware/model and error conditions |
| 28 | Nov 18 | Release criteria, test gaps, rest buffer | Regression pass, fix flaky tests, freeze release candidate | **Gate D candidate:** no known critical safety failures |
| 29 | Nov 19 | Architecture defense and code review | Japanese README, diagram, ADR review, 5-minute recorded self-explanation | Learner explains agent loop and safety without prompts |
| 30 | Nov 20 | Tradeoffs, roadmap, interview Q&A | Reproducible install/test/release evidence + truthful Japanese CV draft | **Month-end:** signed checklist, verified scope vs deferred scope |

## Quality gates — keep standards, shrink scope
1. **Gate A (Day 7):** API contract and model-schema validation; >=15 meaningful passing tests. No skipped tests to artificially pass.
2. **Gate B (Day 14):** source-backed RAG baseline; >=30 question eval and non-fabrication tests. Optional embeddings only if measured.
3. **Gate C (Day 21):** allowlisted bounded Agent, persisted approval, restart test, idempotency; >=20 adversarial policy cases and **0 unauthorized writes**.
4. **Gate D (Day 30):** >=100 labeled eval items including frozen holdout, repeatable tests, documented accuracy and failures, full simulator workflow, developer setup, sanitized evidence, portfolio writeup. Any unmet original numeric *target* remains transparently marked as unmet, never quietly weakened.

## Explicit scope and evidence statements
- A synthetic system, even when complete, is a **personal project**; not proof of commercial production use.
- Real model response quality is assessed only if a model is actually available. Do not report mock accuracy as real LLM accuracy.
- The original 12-week Gate D (Salesforce Developer Edition + Docker + production-like hosting) is **not** included in this 30-day finish; complete separately before describing those features as implemented.
- If completion slips, use review/recovery days and rescope features, not negative tests or security controls. Keep a written gap list.
- A full 3h session each calendar day is a target, not an instruction to sacrifice sleep or work duties.

## Free references
- Python: https://docs.python.org/3/tutorial/
- FastAPI: https://fastapi.tiangolo.com/tutorial/
- Pydantic: https://docs.pydantic.dev/latest/
- uv: https://docs.astral.sh/uv/
- pytest: https://docs.pytest.org/
- RAG/evaluation practice: https://github.com/DataTalksClub/llm-zoomcamp
- Agent loop source research: https://github.com/KomorGiaoGiao/FirstCoder
