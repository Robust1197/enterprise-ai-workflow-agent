# 12-Week Engineering and Learning Roadmap — ORIGINAL FULL-SCOPE BASELINE

> **Schedule superseded on 2026-10-21.** The active schedule is [ROADMAP_30D.md](ROADMAP_30D.md). This original document is retained to show deferred features and original completion criteria; it does not mean these features are expected to ship within 30 days.
**Start:** 2026-10-21 | **Target review:** 2027-01-12 | **Effort:** 10–15 h/week, approximately 120–180 hours. Dates are planning targets, not external delivery promises.

> Every week: concept note (in learner's own words), coded artifact, negative/edge-case tests, short demo, evidence record. A milestone is not complete simply because code exists.

| W | Dates | Understand first | Deliverable (increment to same product) | Exit / proof |
|---|---|---|---|---|
| 1 | Oct 21–27 | Python typing, HTTP, validation, testing | FastAPI /health + /api/v1/tickets + deterministic triage + tests | Clean install; >=12 passing tests; error responses covered |
| 2 | Oct 28–Nov 3 | Tokenization, sampling, prompting, JSON schema, adapters | MockLLM / optional Ollama adapters, structured classification, output repair policy | 20 test tickets; 100% deterministic mock validation; model report if available |
| 3 | Nov 4–10 | Retrieval, inverted index, chunking, rank metrics | FAQ import + BM25 or SQLite FTS retrieval baseline with source IDs | 30 question set, Recall@k computed, no fabricated citations |
| 4 | Nov 11–17 | Embeddings, vector similarity, RAG grounding | Embedding retrieval experiment and grounded response service | Side-by-side baseline comparison, >=40 QA cases, abstention tested |
| 5 | Nov 18–24 | Agent loop, tool schemas, stopping rules | Self-implemented bounded Agent runtime and read-only tools | Unknown tool / bad args / repeated calls / timeout tests pass |
| 6 | Nov 25–Dec 1 | Trust boundaries, adapters, policy | CRM simulator, scoped read and proposed write, explicit authorization guard | No side effect if approval absent; 20 adversarial policy tests |
| 7 | Dec 2–8 | Persistence, checkpoints, state machine | Durable workflows, audit log, restart-resume support; framework comparison note | Kill/restart test preserves pending decision and audit history |
| 8 | Dec 9–15 | Transactions, idempotency, HITL | Approver UI/API and write execution with idempotency | Approve/reject/expire/retry cases; duplicate write 0 |
| 9 | Dec 16–22 | Offline evaluation, golden dataset, measurement | 100+ labeled tests and performance report with error taxonomy | Metrics script reproducible; separate development vs holdout set |
|10 | Dec 23–29 | Deployment, CI, secrets, monitoring | CI pipeline; Docker only if safely available; local deployment recipe | Rebuild + tests from clean environment; secret scan; safe logs |
|11 | Dec 30–Jan 5 | OAuth, integration contracts, rate limits | Salesforce Developer Edition isolated adapter & integration test | Read and human-approved write; rollback/recover demonstration |
|12 | Jan 6–12 | Architecture review, reproducibility, interview defense | v1.0 tag, showcase, Japanese resume evidence sheet, maintenance backlog | Third party can run documented sample and verify quality report |

## Incremental release gates
- **Gate A (Week 2):** Validated REST contract, mock + provider abstraction.
- **Gate B (Week 4):** Search with evidence; baseline vs RAG evaluation.
- **Gate C (Week 8):** Safe, durable end-to-end simulated business workflow.
- **Gate D (Week 12):** Reproducible integrated system, measured quality, Salesforce test integration, interview-ready explanation.

## Scope policy
- Critical path is **server + workflow + evaluation**. A pretty UI, multiple agents and cloud hosting are stretch goals.
- If local LLM is too slow or resource intensive, use mock for deterministic tests and run limited model quality experiments on a permitted free hosted notebook only when its terms and data rules allow it.
- If Docker cannot be installed, publish a uv-based reproducible run path and log Docker as an open item (do not claim it exists).
- If Salesforce Developer Edition access is delayed, freeze the adapter contract with a simulator and label the integration explicitly "not yet validated".
- If less than 10 hours in a week, preserve milestone exit criteria and slide noncritical features rather than inflate claims.

## Hiring outcomes to prepare
1. Public or shareable source code with license review.
2. Architecture tradeoff document and two-page Japanese explanation.
3. Measured results including failures; no cherry-picking.
4. A clear distinction between solo learning, personal project, and real client delivery.
