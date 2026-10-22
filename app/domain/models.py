"""Day 2 learner exercise: business data contracts.

The classes are deliberately incomplete. See docs/DAY_02_LAB.md and the
tests in tests/test_models.py. Fill in fields and constraints yourself.

Use Pydantic v2. Do NOT delete or skip failing tests to make them green.
"""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, StrictBool


class TicketCreate(BaseModel):
    """Validated customer ticket input; authored during Day 2 practice."""

    model_config = ConfigDict(extra="forbid")
    subject: str = Field(min_length=3, max_length=120)
    description: str = Field(min_length=10, max_length=2000)
    locale: str = "ja"


class Ticket(TicketCreate):
    """Stored ticket with identity, timestamp and a controlled status."""

    id: UUID
    created_at: datetime
    status: Literal["new", "triaged"] = "new"


class TriageResult(BaseModel):
    """Validated AI triage result with controlled business values."""

    category: Literal["payment_issue", "access_issue", "general", "other"]
    priority: Literal["low", "medium", "high", "critical"]
    summary: str = Field(min_length=5, max_length=300)
    needs_human_review: StrictBool
