"""
GraphQL Query resolvers
"""

import strawberry
from typing import List, Optional
from graphql_schema.types import Appointment as AppointmentType
from appointment_service import appointment_service


@strawberry.type
class Query:
    """Root Query type"""
    
    @strawberry.field
    def appointments(
        self,
        date: Optional[str] = None,
        status: Optional[str] = None,
        doctor_name: Optional[str] = None
    ) -> List[AppointmentType]:
        """Get all appointments with optional filters"""
        appointments = appointment_service.get_appointments(
            date=date,
            status=status,
            doctor_name=doctor_name
        )
        
        return [
            AppointmentType(
                id=apt.id,
                patient_name=apt.patient_name,
                date=apt.date,
                time=apt.time,
                duration=apt.duration,
                doctor_name=apt.doctor_name,
                status=apt.status,
                mode=apt.mode,
                created_at=apt.created_at
            )
            for apt in appointments
        ]
    
    @strawberry.field
    def appointment(self, id: str) -> Optional[AppointmentType]:
        """Get single appointment by ID"""
        apt = appointment_service.get_appointment(id)
        
        if not apt:
            return None
        
        return AppointmentType(
            id=apt.id,
            patient_name=apt.patient_name,
            date=apt.date,
            time=apt.time,
            duration=apt.duration,
            doctor_name=apt.doctor_name,
            status=apt.status,
            mode=apt.mode,
            created_at=apt.created_at
        )
