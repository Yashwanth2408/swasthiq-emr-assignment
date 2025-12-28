export interface Appointment {
    id: string;
    patientName: string;
    date: string;
    time: string;
    duration: number;
    doctorName: string;
    status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled";
    mode: "In-person" | "Video" | "Phone";
}

export interface AppointmentInput {
    patientName: string;
    date: string;
    time: string;
    duration: number;
    doctorName: string;
    status: string;
    mode: string;
}
  