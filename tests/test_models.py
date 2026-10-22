"""Day 2 executable specification. These tests should FAIL until the learner implements the Pydantic models.

Use only synthetic Japanese support tickets. Pydantic ValidationError is the
expected way to reject data that violates the business contract.
"""

from datetime import datetime, timezone
from uuid import UUID, uuid4

import pytest
from pydantic import ValidationError

from app.domain.models import Ticket, TicketCreate, TriageResult


def example_ticket() -> dict[str, str]:
    return {
        "subject": "決済画面でエラー",
        "description": "クレジットカードで決済すると、エラー画面が表示されます。",
    }


def test_ticket_create_accepts_valid_japanese_input() -> None:
    ticket = TicketCreate(**example_ticket())
    assert ticket.subject == "決済画面でエラー"
    assert ticket.description.startswith("クレジットカード")
    assert ticket.locale == "ja"


def test_ticket_create_requires_description() -> None:
    with pytest.raises(ValidationError):
        TicketCreate(subject="ログインできません")


def test_ticket_create_rejects_short_subject() -> None:
    with pytest.raises(ValidationError):
        TicketCreate(subject="NG", description=example_ticket()["description"])


def test_ticket_create_rejects_long_description() -> None:
    with pytest.raises(ValidationError):
        TicketCreate(subject="決済画面でエラー", description="x" * 2001)


def test_ticket_create_rejects_unexpected_fields() -> None:
    with pytest.raises(ValidationError):
        TicketCreate(**example_ticket(), secret="should-not-be-accepted")


def test_ticket_includes_identity_timestamp_and_new_status() -> None:
    uid = uuid4()
    timestamp = datetime.now(timezone.utc)
    ticket = Ticket(id=uid, created_at=timestamp, **example_ticket())
    assert isinstance(ticket.id, UUID)
    assert ticket.id == uid
    assert ticket.created_at == timestamp
    assert ticket.status == "new"


def test_triage_result_accepts_valid_business_values() -> None:
    result = TriageResult(
        category="payment_issue",
        priority="high",
        summary="決済処理の途中でエラーが発生",
        needs_human_review=True,
    )
    assert result.category == "payment_issue"
    assert result.priority == "high"
    assert result.needs_human_review is True


def test_triage_result_rejects_unknown_priority() -> None:
    with pytest.raises(ValidationError):
        TriageResult(
            category="payment_issue",
            priority="super_urgent",
            summary="決済処理の途中でエラーが発生",
            needs_human_review=True,
        )


def test_triage_result_rejects_short_summary() -> None:
    with pytest.raises(ValidationError):
        TriageResult(
            category="payment_issue",
            priority="high",
            summary="NG",
            needs_human_review=True,
        )


def test_triage_result_rejects_coerced_boolean() -> None:
    with pytest.raises(ValidationError):
        TriageResult(
            category="payment_issue",
            priority="high",
            summary="決済処理の途中でエラーが発生",
            needs_human_review="yes",
        )
