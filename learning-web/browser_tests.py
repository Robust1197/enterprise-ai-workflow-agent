"""Browser-side version of the Day 2 Pydantic contract checks.

The source is executed within a dedicated Web Worker / Pyodide environment.
Unlike simplistic keyword-matching, these checks instantiate REAL Pydantic
models and assert expected ValidationError behavior. This is not pytest:
the Windows repository tests/test_models.py remains the canonical test suite.
"""

import json
from datetime import datetime, timezone
from uuid import UUID, uuid4
from pydantic import ValidationError

source = USER_CODE  # provided as a Pyodide global from runner.worker.js
namespace = {"__name__": "__main__", "__builtins__": __builtins__}

names = [
    "日语工单输入有效",
    "缺少 description 时拒绝",
    "过短 subject 时拒绝",
    "过长 description 时拒绝",
    "未知字段时拒绝",
    "系统字段和默认状态",
    "合法分类及优先级",
    "未知优先级时拒绝",
    "过短摘要时拒绝",
    "布尔字符串不能冒充 bool",
]

cases = []

def run_case(name, function):
    try:
        function()
        cases.append({"name": name, "ok": True, "error": ""})
    except Exception as exc:
        cases.append({
            "name": name,
            "ok": False,
            "error": f"{type(exc).__name__}: {str(exc)[:400]}",
        })

def raises_validation_error(thunk):
    try:
        thunk()
    except ValidationError:
        return
    raise AssertionError("Expected pydantic.ValidationError, but no such error occurred")

def ex():
    return {
        "subject": "決済画面でエラー",
        "description": "クレジットカードで決済すると、エラー画面が表示されます。",
    }

try:
    exec(compile(source, "models.py", "exec"), namespace)
    TicketCreate = namespace["TicketCreate"]
    Ticket = namespace["Ticket"]
    TriageResult = namespace["TriageResult"]
except Exception as exc:
    for name in names:
        cases.append({
            "name": name, "ok": False,
            "error": f"代码无法加载: {type(exc).__name__}: {str(exc)[:350]}",
        })
else:
    def valid_ticket():
        ticket = TicketCreate(**ex())
        assert ticket.subject == "決済画面でエラー"
        assert ticket.description.startswith("クレジットカード")
        assert ticket.locale == "ja"

    def requires_description():
        raises_validation_error(lambda: TicketCreate(subject="ログインできません"))

    def short_subject():
        raises_validation_error(lambda: TicketCreate(subject="NG", description=ex()["description"]))

    def long_description():
        raises_validation_error(lambda: TicketCreate(subject="決済画面でエラー", description="x" * 2001))

    def unknown_fields():
        raises_validation_error(lambda: TicketCreate(**ex(), secret="should-not-be-accepted"))

    def stored_ticket_fields():
        uid = uuid4()
        when = datetime.now(timezone.utc)
        ticket = Ticket(id=uid, created_at=when, **ex())
        assert isinstance(ticket.id, UUID)
        assert ticket.id == uid
        assert ticket.created_at == when
        assert ticket.status == "new"

    def valid_triage():
        result = TriageResult(
            category="payment_issue",
            priority="high",
            summary="決済処理の途中でエラーが発生",
            needs_human_review=True,
        )
        assert result.category == "payment_issue"
        assert result.priority == "high"
        assert result.needs_human_review is True

    def unknown_priority():
        raises_validation_error(lambda: TriageResult(
            category="payment_issue",
            priority="super_urgent",
            summary="決済処理の途中でエラーが発生",
            needs_human_review=True,
        ))

    def short_summary():
        raises_validation_error(lambda: TriageResult(
            category="payment_issue",
            priority="high",
            summary="NG",
            needs_human_review=True,
        ))

    def strict_boolean():
        raises_validation_error(lambda: TriageResult(
            category="payment_issue",
            priority="high",
            summary="決済処理の途中でエラーが発生",
            needs_human_review="yes",
        ))

    checks = [
        valid_ticket,
        requires_description,
        short_subject,
        long_description,
        unknown_fields,
        stored_ticket_fields,
        valid_triage,
        unknown_priority,
        short_summary,
        strict_boolean,
    ]
    for name, fn in zip(names, checks):
        run_case(name, fn)

_RESULT_JSON = json.dumps({"cases": cases, "passed": sum(int(x["ok"]) for x in cases)},
                          ensure_ascii=False)
_RESULT_JSON
