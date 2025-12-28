"""
Core business logic for appointment management
Simulates Aurora PostgreSQL with in-memory storage
"""

from models.appointment import Appointment, AppointmentCreate
from typing import List, Optional, Dict
from datetime import datetime
import uuid


class AppointmentService:
    """Singleton service managing appointment lifecycle"""
    
    def __init__(self):
        self._appointments: Dict[str, Appointment] = {}
        self._initialize_mock_data()
    
    def _initialize_mock_data(self):
        """Initialize with 15 realistic appointments"""
        mock_data = [
            # Today's appointments
            {"patient_name": "Rajesh Kumar", "date": "2025-12-28", "time": "09:00", "duration": 30, "doctor_name": "Dr. Sarah Johnson", "status": "Confirmed", "mode": "In-person"},
            {"patient_name": "Priya Sharma", "date": "2025-12-28", "time": "09:30", "duration": 45, "doctor_name": "Dr. Rajesh Verma", "status": "Scheduled", "mode": "Video"},
            {"patient_name": "Amit Patel", "date": "2025-12-28", "time": "10:00", "duration": 30, "doctor_name": "Dr. Sarah Johnson", "status": "Upcoming", "mode": "In-person"},
            {"patient_name": "Sneha Reddy", "date": "2025-12-28", "time": "14:00", "duration": 60, "doctor_name": "Dr. Anjali Desai", "status": "Confirmed", "mode": "Phone"},
            
            # Upcoming appointments
            {"patient_name": "Vikram Singh", "date": "2025-12-29", "time": "10:00", "duration": 30, "doctor_name": "Dr. Sarah Johnson", "status": "Scheduled", "mode": "In-person"},
            {"patient_name": "Ananya Iyer", "date": "2025-12-29", "time": "11:00", "duration": 45, "doctor_name": "Dr. Rajesh Verma", "status": "Confirmed", "mode": "Video"},
            {"patient_name": "Karan Malhotra", "date": "2025-12-30", "time": "09:00", "duration": 30, "doctor_name": "Dr. Anjali Desai", "status": "Scheduled", "mode": "In-person"},
            {"patient_name": "Deepika Nair", "date": "2025-12-30", "time": "15:00", "duration": 60, "doctor_name": "Dr. Sarah Johnson", "status": "Confirmed", "mode": "Video"},
            {"patient_name": "Arjun Chopra", "date": "2025-12-31", "time": "10:30", "duration": 45, "doctor_name": "Dr. Rajesh Verma", "status": "Scheduled", "mode": "Phone"},
            {"patient_name": "Meera Gupta", "date": "2026-01-02", "time": "09:00", "duration": 30, "doctor_name": "Dr. Anjali Desai", "status": "Scheduled", "mode": "In-person"},
            
            # Past appointments
            {"patient_name": "Rohit Sharma", "date": "2025-12-26", "time": "09:00", "duration": 30, "doctor_name": "Dr. Sarah Johnson", "status": "Completed", "mode": "In-person"},
            {"patient_name": "Kavya Menon", "date": "2025-12-26", "time": "14:00", "duration": 45, "doctor_name": "Dr. Rajesh Verma", "status": "Completed", "mode": "Video"},
            {"patient_name": "Sanjay Deshmukh", "date": "2025-12-27", "time": "10:00", "duration": 30, "doctor_name": "Dr. Anjali Desai", "status": "Completed", "mode": "In-person"},
            {"patient_name": "Pooja Bhat", "date": "2025-12-27", "time": "11:00", "duration": 60, "doctor_name": "Dr. Sarah Johnson", "status": "Cancelled", "mode": "Phone"},
            {"patient_name": "Nikhil Rao", "date": "2025-12-25", "time": "09:30", "duration": 45, "doctor_name": "Dr. Rajesh Verma", "status": "Completed", "mode": "Video"},
        ]
        
        for data in mock_data:
            appointment = Appointment(**data)
            self._appointments[appointment.id] = appointment
    
    def get_appointments(self, date: Optional[str] = None, status: Optional[str] = None, doctor_name: Optional[str] = None) -> List[Appointment]:
        """Retrieve appointments with optional filtering"""
        appointments = list(self._appointments.values())
        
        if date:
            appointments = [apt for apt in appointments if apt.date == date]
        if status:
            appointments = [apt for apt in appointments if apt.status == status]
        if doctor_name:
            appointments = [apt for apt in appointments if apt.doctor_name == doctor_name]
        
        appointments.sort(key=lambda x: (x.date, x.time))
        return appointments
    
    def get_appointment(self, appointment_id: str) -> Optional[Appointment]:
        """Retrieve single appointment by ID"""
        return self._appointments.get(appointment_id)
    
    def create_appointment(self, data: AppointmentCreate) -> Appointment:
        """Create new appointment with validation"""
        new_appointment = Appointment(
            id=str(uuid.uuid4()),
            patient_name=data.patient_name,
            date=data.date,
            time=data.time,
            duration=data.duration,
            doctor_name=data.doctor_name,
            status=data.status or "Scheduled",
            mode=data.mode,
            created_at=datetime.now().isoformat()
        )
        
        if self._has_conflict(new_appointment):
            raise ValueError(f"Time conflict: {data.doctor_name} already has an appointment at {data.time} on {data.date}")
        
        self._appointments[new_appointment.id] = new_appointment
        return new_appointment
    
    def update_appointment_status(self, appointment_id: str, new_status: str) -> Optional[Appointment]:
        """Update appointment status"""
        appointment = self._appointments.get(appointment_id)
        if not appointment:
            return None
        
        updated_appointment = appointment.model_copy(update={"status": new_status})
        self._appointments[appointment_id] = updated_appointment
        return updated_appointment
    
    def delete_appointment(self, appointment_id: str) -> bool:
        """Delete appointment"""
        if appointment_id in self._appointments:
            del self._appointments[appointment_id]
            return True
        return False
    
    def _has_conflict(self, new_appointment: Appointment) -> bool:
        """Detect time conflicts"""
        from utils.conflict_detector import detect_time_conflict
        
        return detect_time_conflict(
            new_date=new_appointment.date,
            new_time=new_appointment.time,
            new_duration=new_appointment.duration,
            doctor_name=new_appointment.doctor_name,
            existing_appointments=list(self._appointments.values()),
            exclude_id=None
        )


# Global singleton instance
appointment_service = AppointmentService()
