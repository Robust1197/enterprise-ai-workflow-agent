"""Unit tests for the mobile site's Python test harness, using Windows Pydantic.

These tests validate the harness logic but DO NOT prove the separate
Pyodide/Pydantic WebAssembly download works in a real Android browser.
"""

import json
from pathlib import Path

RUNNER = Path(__file__).parents[1] / "learning-web" / "browser_tests.py"

GOOD_SOURCE = """
from datetime import datetime
from uuid import UUID
from typing import Literal
from pydantic import BaseModel, Field, ConfigDict, StrictBool

class TicketCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    subject: str = Field(min_length=3, max_length=120)
    description: str = Field(min_length=10, max_length=2000)
    locale: str = "ja"

class Ticket(TicketCreate):
    id: UUID
    created_at: datetime
    status: Literal["new", "triaged"] = "new"

class TriageResult(BaseModel):
    category: Literal["payment_issue", "access_issue", "general", "other"]
    priority: Literal["low", "medium", "high", "critical"]
    summary: str = Field(min_length=5, max_length=300)
    needs_human_review: StrictBool
"""

EMPTY_SOURCE = """
from pydantic import BaseModel
class TicketCreate(BaseModel):
    pass
class Ticket(TicketCreate):
    pass
class TriageResult(BaseModel):
    pass
"""


def _run(code: str) -> dict:
    scope = {"USER_CODE": code}
    exec(compile(RUNNER.read_text(encoding="utf-8"), str(RUNNER), "exec"), scope)
    return json.loads(scope["_RESULT_JSON"])


def test_browser_test_harness_accepts_valid_pydantic_models() -> None:
    out = _run(GOOD_SOURCE)
    assert out["passed"] == 10
    assert len(out["cases"]) == 10
    assert all(item["ok"] for item in out["cases"])


def test_browser_test_harness_rejects_empty_models() -> None:
    out = _run(EMPTY_SOURCE)
    assert out["passed"] == 0
    assert len(out["cases"]) == 10


def test_browser_test_harness_handles_syntax_error() -> None:
    out = _run("def badly_indent(:\n  pass")
    assert out["passed"] == 0
    assert len(out["cases"]) == 10
    assert all("代码无法加载" in c["error"] for c in out["cases"])


def test_mobile_runner_uses_supported_module_worker_and_builtin_pydantic() -> None:
    root = RUNNER.parent
    worker = (root / "runner.worker.js").read_text(encoding="utf-8")
    app = (root / "app.js").read_text(encoding="utf-8")
    assert "\n  importScripts(" not in worker
    assert 'await import(url)' in worker
    assert 'await py.loadPackage("pydantic")' in worker
    assert 'new Worker("runner.worker.js", {type:"module"})' in app
    assert "terminateRunner();\n  setBusy(true)" not in app


def test_mobile_lesson_teaches_all_assigned_syntax_and_links_docs() -> None:
    html = (RUNNER.parent / "index.html").read_text(encoding="utf-8")
    for topic in ("BaseModel", "ConfigDict", "StrictBool", "Literal", "UUID", "datetime", "ValidationError"):
        assert topic in html
    assert "https://docs.pydantic.dev/latest/concepts/fields/" in html


def test_day_2_triage_question_explains_business_intent_and_scope() -> None:
    html = (RUNNER.parent / "index.html").read_text(encoding="utf-8")
    app = (RUNNER.parent / "app.js").read_text(encoding="utf-8")
    lab = (RUNNER.parents[1] / "docs" / "DAY_02_LAB.md").read_text(encoding="utf-8")
    for token in ("payment_issue", "access_issue", "general", "other", "critical", "summary", "needs_human_review"):
        assert token in html
        assert token in lab
    assert "第三关完整题目" in html
    assert "不实现自动分类算法" in html
    assert "priority=\"super_urgent\"" in html
    assert "go-triage" in app
    assert "NOT the classification algorithm" in lab
