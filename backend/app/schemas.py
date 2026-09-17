from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


TicketStatus = Literal[
    "open",
    "in_progress",
    "completed"
]

TicketPriority = Literal[
    "low",
    "medium",
    "high"
]


# =========================
# TICKETS
# =========================

class TicketCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=150
    )

    description: str = Field(
        min_length=5
    )

    priority: TicketPriority = "medium"


class TicketUpdateStatus(BaseModel):
    status: TicketStatus


class TicketUpdate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=150
    )

    description: str = Field(
        min_length=5
    )

    priority: TicketPriority


class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    priority: str
    created_at: datetime

    class Config:
        from_attributes = True


# =========================
# USERS
# =========================

class UserCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100
    )

    email: str = Field(
        min_length=5,
        max_length=150
    )

    password: str = Field(
        min_length=8,
        max_length=100
    )


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str