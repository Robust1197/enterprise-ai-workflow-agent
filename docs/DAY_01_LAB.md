# Day 1 — Learning-by-building lab
**Status:** baseline and learner exercise completed; 2 tests passing in DevSpace. Conceptual review and first Git commit remain.
**Time budget:** 1 hour theory + 2 hours coding/review.

## Existing tested baseline (AI scaffold)
- Python 3.12 + uv project settings
- `GET /health/live` -> `{"status":"ok"}`
- `tests/test_health.py` tests the HTTP contract using FastAPI TestClient.

### Why this is only a baseline
A running liveness endpoint isn't real mastery. YOU must change the behavior and test together and be able to explain each line.

## Your own coding assignment (do not ask AI to generate it for you)
**Requirement ticket #D1-001:** Add one *additional* response field named `"service"` with exact value `"enterprise-ai-workflow-agent"` to the `GET /health/live` response. Keep `"status":"ok"`. Make the following **existing** test verify the new response and add a **second** test for an unknown route returning HTTP 404.

Do this personally:
1. Open `app/main.py`. Before editing, say aloud what `@app.get` and `-> dict[str, str]` mean.
2. Change **only** the returned dictionary in `health_live()` to meet the requirement.
3. Open `tests/test_health.py`. Change the existing JSON assertion to match the new contract.
4. Add a separate `test_unknown_route_returns_404` test using TestClient for `/no-such-endpoint`.
5. Run `uv run pytest -q`. Both tests must pass. Run `uv run python -c "from app.main import app; print(app.title)"` to verify the package imports.
6. Send your diff/test output to ChatGPT for a code review. Explain why we don't hardcode external dependency readiness in this route.

## Check-yourself prompts (answer without opening ChatGPT)
- Interpreter vs venv vs uv lockfile — what is different?
- Why does TestClient not need a running public web server?
- If the DB is down but the API process is alive, what is `/health/live` expected to say?
- What would fail if you change output but forget to update the test?
- How would you distinguish liveness from readiness in week 2?

## Free sources
- FastAPI first steps: https://fastapi.tiangolo.com/tutorial/first-steps/
- FastAPI testing: https://fastapi.tiangolo.com/tutorial/testing/
- Python typing: https://docs.python.org/3/library/typing.html
- uv environments: https://docs.astral.sh/uv/concepts/projects/
