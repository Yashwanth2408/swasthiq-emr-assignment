"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FiActivity,
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiUser,
    FiFileText,
    FiCheck,
    FiAlertCircle,
    FiTrash2,
} from "react-icons/fi";
import { GET_APPOINTMENT, UPDATE_APPOINTMENT, DELETE_APPOINTMENT, GET_APPOINTMENTS } from "@/lib/graphql/operations";
import { Appointment } from "@/lib/types";

const DOCTORS = [
    "Dr. Sarah Johnson",
    "Dr. Michael Chen",
    "Dr. Emily Rodriguez",
    "Dr. James Wilson",
    "Dr. Lisa Anderson",
];

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
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.patientName.trim()) newErrors.patientName = "Patient name is required";
        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.time) newErrors.time = "Time is required";
        if (!formData.doctorName) newErrors.doctorName = "Doctor selection is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

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

    if (queryLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/40 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-700 font-medium text-lg">Loading appointment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/40">
            {/* Header */}
            <header className="bg-white/95 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                                <FiActivity className="text-white text-xl" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">SwasthiQ EMR</h1>
                                <p className="text-xs text-slate-600">Healthcare Management System</p>
                            </div>
                        </motion.div>
                        <motion.nav
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-3"
                        >
                            <Link
                                href="/"
                                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all duration-200 flex items-center gap-2"
                            >
                                <FiArrowLeft />
                                Back to Appointments
                            </Link>
                        </motion.nav>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border-2 border-slate-200 shadow-2xl overflow-hidden"
                >
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8 text-white">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiCalendar className="text-3xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Edit Appointment</h2>
                                    <p className="text-indigo-100 text-sm mt-1">Update appointment details</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2.5 bg-red-500/90 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiTrash2 />
                                {deleteLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-8">
                        {updateError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3"
                            >
                                <FiAlertCircle className="text-red-600 text-xl flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-900 font-semibold">Error updating appointment</p>
                                    <p className="text-red-700 text-sm mt-1">{updateError.message}</p>
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-6">
                            {/* Patient Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <FiUser className="text-indigo-600" />
                                    Patient Name
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    placeholder="Enter patient full name"
                                    className={`w-full px-4 py-3 border-2 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${errors.patientName
                                            ? "border-red-300 bg-red-50"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                        }`}
                                />
                                {errors.patientName && (
                                    <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                                        <FiAlertCircle className="text-xs" />
                                        {errors.patientName}
                                    </p>
                                )}
                            </div>

                            {/* Date, Time, Duration Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Date */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                        <FiCalendar className="text-indigo-600" />
                                        Date
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border-2 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${errors.date ? "border-red-300 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                    />
                                    {errors.date && (
                                        <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                                            <FiAlertCircle className="text-xs" />
                                            {errors.date}
                                        </p>
                                    )}
                                </div>

                                {/* Time */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                        <FiClock className="text-indigo-600" />
                                        Time
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border-2 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${errors.time ? "border-red-300 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                    />
                                    {errors.time && (
                                        <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                                            <FiAlertCircle className="text-xs" />
                                            {errors.time}
                                        </p>
                                    )}
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                        <FiClock className="text-indigo-600" />
                                        Duration
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 bg-white hover:border-slate-300"
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

                            {/* Doctor Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <FiUser className="text-indigo-600" />
                                    Doctor Name
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="doctorName"
                                    value={formData.doctorName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border-2 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${errors.doctorName
                                            ? "border-red-300 bg-red-50"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                        }`}
                                >
                                    <option value="">Select a doctor</option>
                                    {DOCTORS.map((doctor) => (
                                        <option key={doctor} value={doctor}>
                                            {doctor}
                                        </option>
                                    ))}
                                </select>
                                {errors.doctorName && (
                                    <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                                        <FiAlertCircle className="text-xs" />
                                        {errors.doctorName}
                                    </p>
                                )}
                            </div>

                            {/* Status and Mode Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Status */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                        <FiFileText className="text-indigo-600" />
                                        Status
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 bg-white hover:border-slate-300"
                                    >
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>

                                {/* Mode */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                        <FiActivity className="text-indigo-600" />
                                        Mode
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="mode"
                                        value={formData.mode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 bg-white hover:border-slate-300"
                                    >
                                        <option value="In-person">In-person</option>
                                        <option value="Video">Video</option>
                                        <option value="Phone">Phone</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 mt-8 pt-6 border-t-2 border-slate-200">
                            <button
                                type="submit"
                                disabled={updateLoading}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 font-semibold transition-all duration-200 shadow-xl shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                            >
                                {updateLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FiCheck className="text-xl" />
                                        Update Appointment
                                    </>
                                )}
                            </button>
                            <Link
                                href="/"
                                className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-semibold transition-all duration-200 text-lg flex items-center justify-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </motion.div>

                {/* Help Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-center text-sm text-slate-600"
                >
                    <p>Fields marked with <span className="text-red-500 font-semibold">*</span> are required</p>
                </motion.div>
            </main>
        </div>
    );
}
