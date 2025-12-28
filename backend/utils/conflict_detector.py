"""
Time conflict detection algorithm
Prevents double-booking of doctors
"""

from datetime import datetime, timedelta
from typing import List, Optional


def parse_time(time_str: str) -> datetime:
    """Convert HH:MM string to datetime object"""
    return datetime.strptime(time_str, "%H:%M")


def detect_time_conflict(
    new_date: str,
    new_time: str,
    new_duration: int,
    doctor_name: str,
    existing_appointments: List,
    exclude_id: Optional[str] = None,
    buffer_minutes: int = 5
) -> bool:
    """
    Detect if new appointment conflicts with existing appointments
    
    Returns:
        True if conflict detected, False otherwise
    """
    
    # Calculate new appointment time range
    new_start = parse_time(new_time)
    new_end = new_start + timedelta(minutes=new_duration)
    
    # Add buffer
    new_start_with_buffer = new_start - timedelta(minutes=buffer_minutes)
    new_end_with_buffer = new_end + timedelta(minutes=buffer_minutes)
    
    # Check against all existing appointments
    for apt in existing_appointments:
        # Skip if same appointment (for updates)
        if exclude_id and apt.id == exclude_id:
            continue
        
        # Only check appointments for same doctor on same date
        if apt.doctor_name != doctor_name or apt.date != new_date:
            continue
        
        # Skip cancelled appointments
        if apt.status == "Cancelled":
            continue
        
        # Calculate existing appointment time range
        existing_start = parse_time(apt.time)
        existing_end = existing_start + timedelta(minutes=apt.duration)
        
        # Add buffer
        existing_start_with_buffer = existing_start - timedelta(minutes=buffer_minutes)
        existing_end_with_buffer = existing_end + timedelta(minutes=buffer_minutes)
        
        # Check for overlap
        if (new_start_with_buffer < existing_end_with_buffer and 
            new_end_with_buffer > existing_start_with_buffer):
            return True  # Conflict detected
    
    return False  # No conflict
