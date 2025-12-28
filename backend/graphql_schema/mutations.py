"""
GraphQL Mutation resolvers
"""

import strawberry
from typing import Optional
from graphql_schema.types import Appointment as AppointmentType, CreateAppointmentInput, DeleteResult
from appointment_service import appointment_service
from models.appointment import AppointmentCreate


@strawberry.type
class Mutation:
    """Root Mutation type"""
    
    @strawberry.mutation
    def create_appointment(self, input: CreateAppointmentInput) -> AppointmentType:
        """Create new appointment"""
        try:
            # Convert GraphQL input to Pydantic model
            appointment_data = AppointmentCreate(
                patient_name=input.patient_name,
                date=input.date,
                time=input.time,
                duration=input.duration,
                doctor_name=input.doctor_name,
                mode=input.mode,
                status=input.status
            )
            
            # Create appointment
            apt = appointment_service.create_appointment(appointment_data)
            
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
        except ValueError as e:
            raise Exception(str(e))
    
    @strawberry.mutation
    def update_appointment_status(self, id: str, status: str) -> Optional[AppointmentType]:
        """Update appointment status"""
        apt = appointment_service.update_appointment_status(id, status)
        
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
    
    @strawberry.mutation
    def delete_appointment(self, id: str) -> DeleteResult:
        """Delete appointment"""
        success = appointment_service.delete_appointment(id)
        
        if success:
            return DeleteResult(
                success=True,
                message=f"Appointment {id} deleted successfully"
            )
        else:
            return DeleteResult(
                success=False,
                message=f"Appointment {id} not found"
            )
