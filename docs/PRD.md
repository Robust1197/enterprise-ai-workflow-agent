# PRD v0.1 — Enterprise AI Workflow Agent
**Last updated:** 2026-10-21 | **Owner:** learner | **State:** planning complete, implementation pending.

**Schedule and scope note (2026-10-21):** The active execution plan is a 30-day / 90-hour [MVP roadmap](ROADMAP_30D.md). The following PRD describes the **full intended product**. In the 30-day release, requirements for a *simulated* CRM, safety approval, audit and evaluated workflow remain mandatory. Real Salesforce Developer Edition integration, public cloud deployment, multi-user RBAC and optional infrastructure are deferred with their original acceptance standards preserved.

## 1. Problem and opportunity
Enterprise service desks repeatedly triage Japanese-language tickets, search knowledge, read relevant CRM records and propose resolution actions. Manual work is slow and inconsistent; naive chatbots lack evidence, auditability and write safeguards. Build a **local-first, auditable** assistant that helps a human agent without making uncontrolled business modifications.

## 2. Target users
- **Operator:** creates tickets, inspects classifications and evidence, requests an action.
- **Approver:** checks proposed edits, explicitly approves or rejects a transaction.
- **Administrator/Developer:** configures allowlisted tools, reviews traces and evaluation metrics.
Initial single-user local deployment; multi-tenant production hosting is explicitly outside scope.

## 3. Intended end-to-end scenario (Japanese-language)
1. Receive a payment-failure inquiry with a synthetic ticket ID.
2. Validate the request; store state and correlation ID.
3. Extract problem category, priority, summary and rationale under a strict schema.
4. Retrieve relevant FAQ and operational documents; attach source IDs/chunk metadata.
5. Query a synthetic CRM Case via allowlisted read-only tool.
6. Produce a typed action proposal with evidence, confidence and clear risks.
7. Show proposal for approval; **never auto-execute writes**.
8. Authorized approver accepts/rejects; a deterministic service validates arguments, actor, permission and idempotency key.
9. Perform approved write against simulator; in Week 11 optionally Salesforce Developer Edition only.
10. Persist immutable audit events and display final status/trace.

## 4. Functional requirements (acceptance traceability)
| ID | Priority | Requirement | Acceptance criterion |
|---|---|---|---|
| FR-01 | Must | Create/view tickets via versioned REST API | Valid sample returns 201; invalid schema returns 422, tested |
| FR-02 | Must | LLM/Mock triage under Pydantic schema | Response fields: category, priority, summary, needs_human_review; invalid model output rejected |
| FR-03 | Must | Provider interface with deterministic mock | Tests run offline, no API key and without a model download |
| FR-04 | Must | FAQ ingestion and grounded retrieval | Each cited answer includes existing source ID; unsupported answer abstains |
| FR-05 | Must | Explicit allowlisted tool registry | Unknown tool or invalid arguments rejected before any side effect |
| FR-06 | Must | Bounded agent loop | Max steps / time budget and termination conditions covered by tests |
| FR-07 | Must | Approval for all state-changing actions | Write called only with authenticated approved action ID and valid scope |
| FR-08 | Must | Persistent state + audit trail | Restart does not lose a pending approval; action transitions logged |
| FR-09 | Must | Retry rules and idempotency | Repeated authorized request does not duplicate the business side effect |
| FR-10 | Must | Evaluation harness | At least 100 curated labeled cases + scripted regression run |
| FR-11 | Should | Salesforce Developer Edition adapter | Test org only; least-privilege token; read + approved test write |
| FR-12 | Must | Docs, build/test, CI and demo script | Fresh install reproduces tests; tagged release contains evidence |

## 5. Nonfunctional requirements
- **Security:** local bind 127.0.0.1 initially; explicit authorization checks in server-side tool execution, not just prompting. No keys or real customer/company data in code or logs.
- **Reliability:** API model failures return a typed error, not a guessed business answer. Side effects are idempotent or reject ambiguity; always an audit event.
- **Observability:** correlation_id, tool latency, token cost where available, selected model, input sanitization and safe error codes. Never log access tokens or raw secrets.
- **Privacy:** use synthetic Japanese/Chinese sample records. Purge/retention documented prior to any external pilot.
- **Cost:** deterministic offline mode is sufficient for unit/contract tests. Optional local inference depends on host RAM/CPU; remote API is not required.
- **Maintainability:** Python type hints, mypy or pyright later, pytest, stable schemas, configuration via env, ADR for decisions.
- **Interface:** API first; minimal operator UI only when workflows are reliable.

## 6. Explicitly out of scope
Training/fine-tuning foundation models; public SaaS/multi-tenant hosting; autonomous unrestricted browser/shell/DB modifications; real payments; manipulating production Salesforce; unsolicited bulk email; using employer data; claims of SLA or commercial production deployment.

## 7. State machine
Created -> Triaged -> Grounded -> Proposed -> PendingApproval -> Approved/Rejected -> Executing -> Completed/Failed.
State transitions are explicit; rejection is terminal unless a new version of the action is proposed. Retries preserve the original action ID and approval scope. Fail-closed on unknown state.

## 8. Definition of done
A requirement is completed only when its implementation and tests pass, the learner explains its design tradeoffs, and a reproducible evidence artifact is linked in docs/QUALITY.md.

## 9. Risks/open decisions
- CPU/RAM unknown: determine Ollama feasibility before selecting a model.
- Docker not installed: SQLite and uv for initial development, postpone container dependency.
- Salesforce API requires isolated Developer Edition and authentication; no production org permitted.
- Real users/feedback not yet available: portfolio must honestly disclose synthetic and Developer Edition tests.
- Exact business data model: freeze minimal Ticket/Action schemas at end of Week 2.
