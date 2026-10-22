# Quality, Evidence and Release Gates

## Current state: PLANNED (not tested)
No production features, performance claims, model benchmark outcomes or release tags exist yet. **Active 30-day Gate A/B/C/D and dates** are defined in [ROADMAP_30D.md](ROADMAP_30D.md). Original full-scope targets still apply to the capabilities ultimately developed; the one-month MVP must clearly mark deferred integrations.

## Scorecard and method
| Metric | Planned threshold | Measurement |
|---|---|---|
| Week 1 API/contract tests | >=12 meaningful passing tests | pytest -q log with cases |
| JSON schema validity | >=99% of 100+ model outputs | independent test requests / count |
| Triage accuracy | >=90% on labeled holdout | correct class / total; breakdown by class and confusion matrix |
| Retrieval Recall@5 | baseline first; then improve | gold source within top 5 / evaluated queries |
| Citation grounding | >=95% validated source IDs | supported returned citations / all citations |
| Tool-call success | >=95% allowed fixture calls | executed valid calls / eligible calls |
| Unauthorized write acceptance | **0** in adversarial suite | at least 20 negative cases |
| Duplicate business writes | **0** for repeated idempotency keys | controlled retries / recorded writes |
| Recovery state tests | pass | terminate/restart/resume pending approval |
| Project reproducibility | pass | separate clean environment follows README |

Targets are **goals, not current results**. Measure on a frozen holdout set not used for prompt tuning. Document model version, hardware, dataset version, sample sizes, runtime, and error cases.

## Baselines
- Deterministic rule-based triage benchmark before an LLM.
- Term/FTS retrieval baseline before vector search.
- Measure quality-vs-cost/latency; do not add framework purely for novelty.

## Evidence directory convention (to create upon actual runs)
```text
evidence/
  w01/pytest-summary.txt
  w02/model-comparison.md
  w04/rag-evaluation.md
  w08/approval-threat-tests.md
  w09/metrics.json
  w11/salesforce-developer-edition.md
  w12/final-release-checklist.md
```
All evidence must be sanitized. No customer data, secrets, raw browser cookies or live CRM tokens.

## Release readiness questions
- Can another developer reproduce tests without private credentials?
- Are model outputs labeled as probabilistic and not guarantees?
- Can a malicious document cause a tool to exceed its allowlist?
- Does rejection/expiry fail closed?
- Is approval uniquely tied to action ID, actor and arguments?
- Are failures visible, audited and retry-safe?
- Are project disclosures truthful: local test, Developer Edition test, no production customers?

## CV evidence format
`Feature -> Design decision -> Commit/PR -> Test/evaluation -> Demo -> Status`.
Use "個人開発" unless a genuine client or workplace deployment is independently verifiable.
