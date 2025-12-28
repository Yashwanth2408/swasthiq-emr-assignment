"use client";

import { useMemo } from "react";
import { Appointment } from "@/lib/types";

interface DoctorTimelineProps {
    appointments: Appointment[];
    selectedDate: string;
    selectedDoctor: string;
}

export default function DoctorTimeline({ appointments, selectedDate, selectedDoctor }: DoctorTimelineProps) {
    // Generate time slots from 7 AM to 9 PM
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let hour = 7; hour <= 21; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return slots;
    }, []);

    // Filter appointments for selected doctor and date
    const doctorAppointments = useMemo(() => {
        return appointments.filter(
            apt => apt.doctorName === selectedDoctor && apt.date === selectedDate
        );
    }, [appointments, selectedDoctor, selectedDate]);

    // Check if time slot has an appointment
    const getAppointmentAtTime = (timeSlot: string) => {
        return doctorAppointments.find(apt => {
            const aptHour = parseInt(apt.time.split(':')[0]);
            const slotHour = parseInt(timeSlot.split(':')[0]);
            const aptEndHour = aptHour + Math.ceil(apt.duration / 60);

            return slotHour >= aptHour && slotHour < aptEndHour;
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-500 border-green-600';
            case 'Confirmed':
                return 'bg-blue-500 border-blue-600';
            case 'Scheduled':
                return 'bg-yellow-500 border-yellow-600';
            case 'Cancelled':
                return 'bg-red-500 border-red-600';
            default:
                return 'bg-gray-500 border-gray-600';
        }
    };

    const formatTime = (time: string) => {
        const hour = parseInt(time.split(':')[0]);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        return `${displayHour}:00 ${ampm}`;
    };

    return (
        <div className="bg-white rounded-lg border p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{selectedDoctor}</h3>
                <p className="text-sm text-gray-600">
                    Schedule for {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    {doctorAppointments.length} appointment(s) scheduled
                </p>
            </div>

            <div className="space-y-1">
                {timeSlots.map((timeSlot) => {
                    const appointment = getAppointmentAtTime(timeSlot);
                    const isFirstSlot = appointment && appointment.time === timeSlot;

                    return (
                        <div key={timeSlot} className="flex items-stretch min-h-15">
                            {/* Time Label */}
                            <div className="w-24 shrink-0 pr-4 text-right">
                                <span className="text-sm font-medium text-gray-600">
                                    {formatTime(timeSlot)}
                                </span>
                            </div>

                            {/* Timeline Line */}
                            <div className="w-1 bg-gray-200 relative shrink-0">
                                <div className="absolute top-0 left-1/2 w-3 h-3 bg-gray-300 rounded-full transform -translate-x-1/2"></div>
                            </div>

                            {/* Appointment Slot */}
                            <div className="flex-1 pl-4 pb-1">
                                {isFirstSlot ? (
                                    <div
                                        className={`${getStatusColor(appointment.status)} border-l-4 p-4 rounded-lg shadow-sm hover:shadow-md transition`}
                                        style={{
                                            height: `${Math.ceil(appointment.duration / 15) * 15}px`,
                                            minHeight: '80px'
                                        }}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-white text-lg">
                                                {appointment.patientName}
                                            </h4>
                                            <span className="bg-white text-blue-900 text-xs px-2 py-1 rounded font-semibold shadow-sm">
                                                {appointment.duration} min
                                            </span>
                                        </div>
                                        <p className="text-white text-sm opacity-90">
                                            {appointment.time} - {(() => {
                                                const [hours, minutes] = appointment.time.split(':').map(Number);
                                                const totalMinutes = hours * 60 + minutes + appointment.duration;
                                                const endHours = Math.floor(totalMinutes / 60);
                                                const endMinutes = totalMinutes % 60;
                                                return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
                                            })()}
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="bg-white text-blue-900 text-xs px-2 py-1 rounded font-medium shadow-sm">
                                                {appointment.mode}
                                            </span>
                                            <span className="bg-white text-blue-900 text-xs px-2 py-1 rounded font-medium shadow-sm">
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                ) : appointment ? (
                                    // Continuation of previous appointment
                                    <div className="h-full"></div>
                                ) : (
                                    // Empty slot
                                    <div className="h-full flex items-center">
                                        <span className="text-sm text-gray-400 italic">Available</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {doctorAppointments.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No appointments scheduled for this day</p>
                </div>
            )}
        </div>
    );
}
