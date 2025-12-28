"""
Pydantic models for appointment data validation
Mimics production data structures for Aurora PostgreSQL
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import datetime
import uuid


class AppointmentBase(BaseModel):
    """Base appointment model with common fields"""
    patient_name: str = Field(..., min_length=2, max_length=100)
    date: str = Field(..., pattern=r'^\d{4}-\d{2}-\d{2}$')
    time: str = Field(..., pattern=r'^\d{2}:\d{2}$')
    duration: int = Field(..., ge=15, le=180)
    doctor_name: str = Field(..., min_length=2, max_length=100)
    mode: Literal["In-person", "Video", "Phone"]

    @field_validator('date')
    @classmethod
    def validate_date(cls, v: str) -> str:
        """Validate date format"""
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError as e:
            raise ValueError(f'Invalid date format: {str(e)}')

    @field_validator('time')
    @classmethod
    def validate_time(cls, v: str) -> str:
        """Validate time format"""
        try:
            hour, minute = map(int, v.split(':'))
            if not (0 <= hour <= 23 and 0 <= minute <= 59):
                raise ValueError('Invalid time range')
            return v
        except ValueError:
            raise ValueError('Invalid time format. Use HH:MM (24-hour format)')


class AppointmentCreate(AppointmentBase):
    """Model for creating new appointments"""
    status: Optional[Literal["Scheduled", "Confirmed", "Upcoming", "Completed", "Cancelled"]] = "Scheduled"


class Appointment(AppointmentBase):
    """Complete appointment model with system-generated fields"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: Literal["Scheduled", "Confirmed", "Upcoming", "Completed", "Cancelled"] = "Scheduled"
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
