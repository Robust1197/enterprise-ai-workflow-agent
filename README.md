# Enterprise AI Workflow Agent

> Portfolio engineering project | Kickoff: 2026-10-21 | Plan: **30 days (2026-10-22 to 2026-11-20), 3 h/day** | Status: **Day 1 + Day 2 validated; end-to-end Agent vertical slice next**

An auditable AI-assisted enterprise workflow application. It classifies Japanese-language customer tickets, retrieves knowledge with citations, proposes allowed business actions, requires human approval before writes, and records traceable outcomes.

**Purpose:** learn AI Agent fundamentals by implementing real engineering components personally, and build an honest, reproducible portfolio for AI Engineer career transition.

## What is implemented?
- [x] Project charter and technical planning initiated
- [x] Python 3.12 + uv project initialized; lockfile produced
- [x] First FastAPI liveness endpoint and 1 passing pytest contract test (2026-10-21)
- [x] Day 1 learner-authored extension and second test: verified 2 passed, 1 warning (2026-10-21)
- [x] Day 2 learner-authored TicketCreate, Ticket and TriageResult with strict output validation; 15 pytest checks passed (2026-10-22)
- [x] Mobile Agent Quest learning page and module-worker runtime improvements (mobile end-to-end pending)
- [ ] Ticket REST API and broader test suite
- [ ] Mock/Local LLM adapter
- [ ] Retrieval with citations
- [ ] Tool calling runtime
- [ ] Approval and audit log
- [ ] Salesforce Developer Edition connector
- [ ] Quality evaluation and deployment

**Do not claim unimplemented functionality in a CV.** Personal R&D is not commercial production experience.

## Documentation

- [PRD (requirements)](docs/PRD.md)
- [Architecture and API](docs/ARCHITECTURE.md)
- [Technical decisions and safety](docs/ADR.md)
- [Revised Agent-first course and fast-feedback teaching method](docs/LEARNING_METHOD_V2.md)
- [Original 30-day schedule (superseded day sequence)](docs/ROADMAP_30D.md)
- [Week 1 day-by-day implementation](docs/WEEK_01.md)
- [Day 1 learner coding exercise](docs/DAY_01_LAB.md)
- [Day 1 actual test evidence](docs/DAY_01_RESULTS.md)
- [Day 2 TDD lab (learner-authored Pydantic models)](docs/DAY_02_LAB.md)
- [Day 2 RED→GREEN test evidence and final results](docs/DAY_02_RESULTS.md)
- [Mobile practice web / GitHub Pages deployment](learning-web/README.md)
- [Original 12-week full-scope baseline (superseded calendar)](docs/ROADMAP_12W.md)
- [Evaluation and release criteria](docs/QUALITY.md)

## Constraints

- Local-only by default; no public DevSpace / ngrok exposure.
- No personal, company, or real customer records, keys or secrets in the repository.
- All CRM writes must be confirmed by a human and guarded by code-level policy.
- Free/open-source first; no paid model or hosting dependency required for core learning.
- Use current Windows + DevSpace and existing Git; do not change other running projects.

## Technology roadmap

Python 3.12, uv, FastAPI, Pydantic, pytest, HTTPX; early work uses SQLite and a deterministic mock model. Ollama is optional once machine capacity has been assessed. RAG and durable workflows arrive later; PostgreSQL/pgvector, LangGraph and Docker are introduced only when justified.

## 教学契约 / Learning contract

The learner writes or meaningfully reconstructs the core: Pydantic models, API use cases, agent loop, retrieval decisions, tool policy, and tests. Teach end-to-end Agent decisions first; provide prerequisite syntax, runnable examples and references before assigning exercises. AI groups reviews by meaningful feature, avoids multiple slow round trips per typo, and uses self-checks. Each milestone needs (1) reproducible tests, (2) a short design note, and (3) a learner-authored explanation. Details: [Learning Method v2](docs/LEARNING_METHOD_V2.md).

## 日本語の職務経歴書向け位置づけ

業務システム・RPA・Salesforce開発経験を土台に、個人開発としてLLM、RAG、Agentの設計・実装・評価を継続中。完成した機能のみ実績として記述し、商用導入と区別する。
