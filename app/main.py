"""HTTP entry point.

Day 1 goal: liveness only. A response from this endpoint means the process
can serve HTTP; it does NOT prove that the model or database is available.
"""

from fastapi import FastAPI

app = FastAPI(title="Enterprise AI Workflow Agent", version="0.1.0")


@app.get("/health/live", tags=["health"])
def health_live() -> dict[str, str]:
    """Answer a basic application liveness probe."""
    return {"status": "ok", "service": "enterprise-ai-workflow-agent"}
