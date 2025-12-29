"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiSearch,
  FiPlus,
  FiClock,
  FiUser,
  FiActivity,
  FiCheckCircle,
  FiEdit3,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { GET_APPOINTMENTS } from "@/lib/graphql/operations";
import { Appointment } from "@/lib/types";
import "./calendar.css";

const CalendarWidget = dynamic(() => import("@/components/Calendar"), { ssr: false });
const DoctorTimeline = dynamic(() => import("@/components/DoctorTimeline"), { ssr: false });

export default function AppointmentsPage() {
  const [filters, setFilters] = useState({
    date: "",
    status: "",
    doctorName: "",
  });
  const [activeTab, setActiveTab] = useState<"all" | "today" | "upcoming" | "past">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [timelineDoctor, setTimelineDoctor] = useState("");

  const { data, loading, error } = useQuery<{ appointments: Appointment[] }>(
    GET_APPOINTMENTS,
    {
      variables: filters.date || filters.status || filters.doctorName ? filters : {},
    }
  );

  const today = useMemo(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  }, []);

  const filteredAppointments = useMemo(() => {
    if (!data?.appointments) return [];
    let appointments = data.appointments;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      appointments = appointments.filter(apt =>
        apt.patientName.toLowerCase().includes(query) ||
        apt.doctorName.toLowerCase().includes(query)
      );
    }

    switch (activeTab) {
      case "today":
        return appointments.filter(apt => apt.date === today);
      case "upcoming":
        return appointments.filter(apt => apt.date > today);
      case "past":
        return appointments.filter(apt => apt.date < today);
      default:
        return appointments;
    }
  }, [data, activeTab, today, searchQuery]);

  const stats = useMemo(() => {
    if (!data?.appointments) return { total: 0, today: 0, upcoming: 0, completed: 0 };

    return {
      total: data.appointments.length,
      today: data.appointments.filter(a => a.date === today).length,
      upcoming: data.appointments.filter(a => a.date > today && a.status !== "Cancelled").length,
      completed: data.appointments.filter(a => a.status === "Completed").length,
    };
  }, [data, today]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key === "date") {
      setSelectedCalendarDate(value);
    }
  };

  const handleCalendarDateSelect = (date: string) => {
    setSelectedCalendarDate(date);
    setFilters(prev => ({ ...prev, date }));
  };

  const clearFilters = () => {
    setFilters({ date: "", status: "", doctorName: "" });
    setSelectedCalendarDate(null);
    setSearchQuery("");
  };

  const uniqueDoctors = useMemo(() => {
    if (!data?.appointments) return [];
    return Array.from(new Set(data.appointments.map(apt => apt.doctorName)));
  }, [data]);

  const exportToCSV = () => {
    if (!filteredAppointments.length) return;

    const headers = ["Patient", "Date", "Time", "Duration", "Doctor", "Status", "Mode"];
    const rows = filteredAppointments.map(apt => [
      apt.patientName,
      apt.date,
      apt.time,
      `${apt.duration} min`,
      apt.doctorName,
      apt.status,
      apt.mode,
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const hasActiveFilters = filters.date || filters.status || filters.doctorName || searchQuery;

  return (
    <div className="min-h-screen bg-white">
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
                href="/landing"
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all duration-200"
              >
                Home
              </Link>
              <Link
                href="/appointments/new"
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <FiPlus className="text-lg" />
                New Appointment
              </Link>
            </motion.nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Appointments", value: stats.total, icon: FiCalendar, gradient: "from-slate-500 to-slate-700" },
            { label: "Today's Schedule", value: stats.today, icon: FiClock, gradient: "from-blue-500 to-cyan-500" },
            { label: "Upcoming", value: stats.upcoming, icon: FiUser, gradient: "from-amber-500 to-orange-500" },
            { label: "Completed", value: stats.completed, icon: FiCheckCircle, gradient: "from-emerald-500 to-teal-600" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:shadow-2xl hover:border-transparent transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="text-white text-xl" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline Toggle */}
        <AnimatePresence>
          {data && data.appointments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 mb-8 text-white shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <FiClock className="text-xl" />
                    Doctor Schedule Timeline
                  </h3>
                  <p className="text-sm text-indigo-100 mt-1">Visual day view of doctor appointments</p>
                </div>
                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  className="px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 font-semibold transition-all duration-200 shadow-lg flex items-center gap-2"
                >
                  {showTimeline ? <FiX /> : <FiCalendar />}
                  {showTimeline ? "Hide Timeline" : "Show Timeline"}
                </button>
              </div>

              <AnimatePresence>
                {showTimeline && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 grid grid-cols-2 gap-4"
                  >
                    <select
                      value={timelineDoctor}
                      onChange={(e) => setTimelineDoctor(e.target.value)}
                      className="px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-white placeholder-white/60"
                    >
                      <option value="" className="text-slate-900">Select Doctor</option>
                      {uniqueDoctors.map((doctor) => (
                        <option key={doctor} value={doctor} className="text-slate-900">
                          {doctor}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={selectedCalendarDate || today}
                      onChange={(e) => setSelectedCalendarDate(e.target.value)}
                      className="px-4 py-3 border-2 border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline View */}
        <AnimatePresence>
          {showTimeline && timelineDoctor && selectedCalendarDate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8"
            >
              <DoctorTimeline
                appointments={data?.appointments || []}
                selectedDate={selectedCalendarDate}
                selectedDoctor={timelineDoctor}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm hover:shadow-xl transition-all duration-300">
              <CalendarWidget
                onDateSelect={handleCalendarDateSelect}
                selectedDate={selectedCalendarDate}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <FiActivity className="text-white text-sm" />
                </div>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={exportToCSV}
                  disabled={!filteredAppointments.length}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-xl hover:from-emerald-100 hover:to-teal-100 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-emerald-200"
                >
                  <FiDownload />
                  Export to CSV
                </button>
                <button
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="w-full px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 rounded-xl hover:from-slate-100 hover:to-slate-200 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-200"
                >
                  <FiRefreshCw />
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
              {/* Search Bar */}
              <div className="p-6 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-purple-50/30">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Search patients or doctors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b-2 border-slate-200 bg-white">
                <div className="flex px-6">
                  {[
                    { key: "all", label: "All", count: data?.appointments.length || 0 },
                    { key: "today", label: "Today", count: stats.today },
                    { key: "upcoming", label: "Upcoming", count: stats.upcoming },
                    { key: "past", label: "Past", count: null },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as "all" | "today" | "upcoming" | "past")}
                      className={`relative px-6 py-4 text-sm font-semibold transition-all duration-200 ${activeTab === tab.key
                          ? "text-indigo-600"
                          : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                      {tab.label} {tab.count !== null && `(${tab.count})`}
                      {activeTab === tab.key && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="p-6 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FiFilter className="text-white text-sm" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Filters</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <select
                    value={filters.doctorName}
                    onChange={(e) => handleFilterChange("doctorName", e.target.value)}
                    className="px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Doctors</option>
                    {uniqueDoctors.map((doctor) => (
                      <option key={doctor} value={doctor}>
                        {doctor}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="p-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-6 text-slate-600 font-medium">Loading appointments...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-6">
                  <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-red-900 font-bold text-lg">Error loading appointments</p>
                    <p className="text-red-700 text-sm mt-2">{error.message}</p>
                  </div>
                </div>
              )}

              {/* Appointments Table */}
              {data && filteredAppointments.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b-2 border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Doctor</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Mode</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y-2 divide-slate-100">
                      <AnimatePresence>
                        {filteredAppointments.map((appointment, index) => (
                          <motion.tr
                            key={appointment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-purple-50/20 transition-colors duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                              {appointment.patientName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                              {appointment.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                              {appointment.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                              {appointment.duration} min
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                              {appointment.doctorName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                              {appointment.mode}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-lg ${appointment.status === "Completed"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : appointment.status === "Confirmed"
                                      ? "bg-blue-100 text-blue-800"
                                      : appointment.status === "Scheduled"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                              >
                                {appointment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                href={`/appointments/${appointment.id}/edit`}
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-purple-600 font-semibold transition-colors duration-200"
                              >
                                <FiEdit3 />
                                Edit
                              </Link>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Empty State */}
              {data && filteredAppointments.length === 0 && (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiCalendar className="text-3xl text-indigo-600" />
                  </div>
                  <p className="text-slate-600 font-medium text-lg mb-2">No appointments found</p>
                  <p className="text-slate-500 text-sm mb-6">
                    {hasActiveFilters ? "Try adjusting your filters" : "Get started by creating your first appointment"}
                  </p>
                  <Link
                    href="/appointments/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/30"
                  >
                    <FiPlus />
                    Create Appointment
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
