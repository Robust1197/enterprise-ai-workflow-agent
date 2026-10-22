# Architecture Decision Records — 2026-10-21

## ADR-001: Local-first, isolated Windows project
**Decision:** Work within `$HOME\Project\enterprise-ai-workflow-agent` using the currently allowed DevSpace workspace. Do not widen DevSpace roots, modify watchdog/ngrok, or expose app ports publicly.
**Reason:** preserve other projects and avoid leaking local/test data.
**Status:** accepted.

## ADR-002: Python 3.12 + uv
**Decision:** use isolated Python 3.12 and uv (currently available); avoid altering global Python 3.13.
**Reason:** ecosystem compatibility and reproducible packaging.
**Status:** accepted.

## ADR-003: Model-port architecture and Mock-first tests
**Decision:** deterministic Mock model is always available. Ollama is optional and introduced only after RAM/CPU assessment.
**Reason:** free unit tests and predictable failure reproduction.
**Tradeoff:** mock results do not prove LLM quality.
**Status:** accepted.

## ADR-004: API first; avoid premature dashboard integration
**Decision:** build FastAPI contract, schema and tests before any dashboard UI. Add a link/card to the existing dashboard only after working tests, with a separate explicit permission check.
**Reason:** learn backend fundamentals, avoid collateral edits.
**Status:** accepted.

## ADR-005: No arbitrary agent writes
**Decision:** an LLM may recommend but never execute an unapproved write. Execution is server-side, allowlisted, schema-validated, scoped, idempotent and audited.
**Reason:** prevent uncontrolled CRM modifications.
**Status:** accepted.

## ADR-006: Staged persistence/vector stack
**Decision:** simple in-memory/SQLite for Week 1; add PostgreSQL and optional pgvector when RAG/persistence requirements justify it. Docker is not currently available.
**Reason:** avoid infrastructure delaying conceptual learning.
**Status:** accepted.

## ADR-007: Build the loop, then compare with framework
**Decision:** implement and test a minimal agent loop manually before introducing LangGraph.
**Reason:** understand token budgets, tool lifecycle, exit conditions, checkpoints and failure modes.
**Status:** accepted.

## ADR-008: Portfolio integrity
**Decision:** distinguish personal development, isolated platform tests and verified production experience in all CV descriptions.
**Reason:** truthful evidence and stronger interview performance.
**Status:** accepted.

## ADR-009: Repository visibility and external operations
**Decision:** first create local docs. GitHub remote initialization and publishing are separate steps; do not assume a repository exists until an actual remote URL is confirmed. Never commit private keys or company data.
**Status:** accepted.
