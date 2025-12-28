"""
Strawberry GraphQL types
"""

import strawberry
from typing import Optional


@strawberry.type
class Appointment:
    """GraphQL Appointment type"""
    id: str
    patient_name: str
    date: str
    time: str
    duration: int
    doctor_name: str
    status: str
    mode: str
    created_at: Optional[str] = None


@strawberry.input
class CreateAppointmentInput:
    """Input type for creating appointments"""
    patient_name: str
    date: str
    time: str
    duration: int
    doctor_name: str
    mode: str
    status: Optional[str] = "Scheduled"


@strawberry.type
class DeleteResult:
    """Result of delete operation"""
    success: bool
    message: str
