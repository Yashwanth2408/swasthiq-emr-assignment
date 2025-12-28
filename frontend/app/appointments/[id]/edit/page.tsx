"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { GET_APPOINTMENT, UPDATE_APPOINTMENT, DELETE_APPOINTMENT, GET_APPOINTMENTS } from "@/lib/graphql/operations";
import { Appointment } from "@/lib/types";

export default function EditAppointmentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data, loading: queryLoading } = useQuery<{ appointment: Appointment }>(GET_APPOINTMENT, {
        variables: { id },
    });

    const [updateAppointment, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_APPOINTMENT, {
        refetchQueries: [{ query: GET_APPOINTMENTS }],
    });

    const [deleteAppointment, { loading: deleteLoading }] = useMutation(DELETE_APPOINTMENT, {
        refetchQueries: [{ query: GET_APPOINTMENTS }],
    });

    const initialized = useRef(false);

    const [formData, setFormData] = useState({
        patientName: "",
        date: "",
        time: "",
        duration: 30,
        doctorName: "",
        status: "Scheduled",
        mode: "In-person",
    });

    useEffect(() => {
        if (data?.appointment && !initialized.current) {
            initialized.current = true;
            setFormData({
                patientName: data.appointment.patientName,
                date: data.appointment.date,
                time: data.appointment.time,
                duration: data.appointment.duration,
                doctorName: data.appointment.doctorName,
                status: data.appointment.status,
                mode: data.appointment.mode,
            });
        }
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateAppointment({
                variables: { id, input: { ...formData, duration: Number(formData.duration) } },
            });
            router.push("/");
        } catch (err) {
            console.error("Error updating appointment:", err);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this appointment?")) {
            try {
                await deleteAppointment({ variables: { id } });
                router.push("/");
            } catch (err) {
                console.error("Error deleting appointment:", err);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (queryLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="mt-4 text-gray-600">Loading appointment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">SwasthiQ EMR</h1>
                        <p className="text-sm text-gray-500">Appointment Management</p>
                    </div>
                    <nav className="flex gap-2">
                        <Link href="/" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm font-medium">
                            Appointments
                        </Link>
                        <Link href="/appointments/new" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm font-medium">
                            New Appointment
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Edit Appointment</h2>
                        <button
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 text-sm font-medium"
                        >
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </button>
                    </div>

                    {updateError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
                            <p className="text-red-900 font-semibold">Error updating appointment</p>
                            <p className="text-red-700 text-sm mt-1">{updateError.message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                                Patient Name *
                            </label>
                            <input
                                type="text"
                                id="patientName"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                                    Time *
                                </label>
                                <input
                                    type="time"
                                    id="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (min) *
                                </label>
                                <select
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="15">15 min</option>
                                    <option value="30">30 min</option>
                                    <option value="45">45 min</option>
                                    <option value="60">60 min</option>
                                    <option value="90">90 min</option>
                                    <option value="120">120 min</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-2">
                                Doctor Name *
                            </label>
                            <select
                                id="doctorName"
                                name="doctorName"
                                value={formData.doctorName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a doctor</option>
                                <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                                <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                                <option value="Dr. David Lee">Dr. David Lee</option>
                                <option value="Dr. Emily White">Dr. Emily White</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mode *
                                </label>
                                <select
                                    id="mode"
                                    name="mode"
                                    value={formData.mode}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="In-person">In-person</option>
                                    <option value="Video">Video</option>
                                    <option value="Phone">Phone</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={updateLoading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                            >
                                {updateLoading ? "Updating..." : "Update Appointment"}
                            </button>
                            <Link href="/" className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-gray-700">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
