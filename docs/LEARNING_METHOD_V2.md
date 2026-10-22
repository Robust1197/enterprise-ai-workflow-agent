# Learning Method v2 — Agent-first, fast feedback (2026-10-22)

## Why the course changed
Day 1 and Day 2 completed. User feedback: Python syntax examples were too small and shallow, review loops took longer than learning, mobile teaching omitted prerequisite concepts, and the mobile runner failed to load Pyodide.

## Agent-first architecture
Each lesson begins with:
Ticket input -> validation -> RAG retrieval -> LLM proposal -> validated structured output -> policy check -> human approval -> controlled CRM write -> audit and evaluation.
Always distinguish **shape validation**, **grounded truth**, **authorization**, and **side effects**.

## Fast feedback agreement
- Teach business architecture before individual syntax.
- Give one end-to-end relevant task, not many unrelated micro-exercises.
- Learner writes the critical function, AI gives **one batch review per meaningful feature**.
- Prefer browser checks or a single existing pytest command; don't repeatedly run remote inspections for tiny errors.
- State each new syntax prerequisite before using it, with a working example, clear acceptance criteria, one typical error, and an official documentation link.
- Retain comprehensive optional reference and an engineering trade-off discussion, not shallow worksheets.
- Maintain 30 days and roughly 1 hour theory + 2 hours hands-on when useful, not at the cost of padding.

## Revised engineering sequence
| Day | Engineering goal | Meaningful hands-on result | Evidence |
| --- | --- | --- | --- |
| 1 (done) | FastAPI baseline | health endpoint | 2 tests |
| 2 (done) | trust-boundary contracts | TicketCreate, Ticket, TriageResult | 15 tests incl web harness |
| 3 | **small full Agent vertical slice** | intake -> simulated retrieval -> mock classification -> policy -> approval decision -> trace | three scenarios and no unauthorized writes |
| 4 | expose business flow over FastAPI | POST endpoint and typed response | normal and invalid input |
| 5 | tool governance | allowlist + deny tests | no unsafe side effect |
| 6 | faults and recovery | bounded retry, timeout, idempotency | repeat safe |
| 7 | evaluation | dataset, confusion/error taxonomy | baseline report |
| 8–14 | real retrieval and optional LLM | FTS + citations + structured outputs | grounded responses |
| 15–21 | orchestration and durability | bounded Agent loop, persistence, approval checkpoints | workflow replay |
| 22–30 | production-minded hardening | CI, security, observability, demos | reproducer, portfolio |

The older 30-day detailed roadmap remains historical; this plan supersedes its lesson ordering where conflicting. Python is a tool, not the end goal. Reuse RPA, enterprise CRM and Salesforce experience.

## Mobile learning website changes
- Pyodide v314 requires module Workers, not classic importScripts. Fixed worker architecture.
- Run Pydantic from Pyodide 314 distribution instead of attempting to install a mismatched pinned Pydantic version.
- Reuse the same initialized worker for successive runs, reducing repeated initialization.
- Make runtime-loading errors distinct from failing code assertions.
- Add actual explanations/references for BaseModel, Field, ConfigDict, Literal, UUID/datetime, StrictBool and ValidationError.
- First run still depends on CDN and internet access; a real mobile test is required before claiming the issue completely solved.
- Cross-device autosync is not implemented; progress JSON export/import is supported.

## References
https://pyodide.org/en/stable/usage/webworker.html
https://pyodide.org/en/stable/usage/packages-in-pyodide.html
https://docs.pydantic.dev/latest/concepts/models/
https://docs.pydantic.dev/latest/concepts/fields/
