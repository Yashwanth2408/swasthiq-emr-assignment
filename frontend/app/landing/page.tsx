"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiCalendar, FiFilter, FiBarChart2, FiClock, FiSearch, FiDownload, FiCheckCircle, FiArrowRight, FiPlus } from "react-icons/fi";

export default function LandingPage() {
    const features = [
        {
            icon: FiCalendar,
            title: "Interactive Calendar",
            description: "Visual date selection with instant appointment filtering",
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            icon: FiClock,
            title: "Doctor Timeline View",
            description: "Day-view schedule visualization showing all appointments and available slots",
            gradient: "from-purple-500 to-pink-500",
        },
        {
            icon: FiBarChart2,
            title: "Real-time Analytics",
            description: "Live dashboard with appointment statistics and insights",
            gradient: "from-emerald-500 to-teal-500",
        },
        {
            icon: FiFilter,
            title: "Advanced Filtering",
            description: "Multi-parameter filtering by date, status, and doctor",
            gradient: "from-orange-500 to-red-500",
        },
        {
            icon: FiSearch,
            title: "Global Search",
            description: "Lightning-fast search across patients and doctors",
            gradient: "from-indigo-500 to-purple-500",
        },
        {
            icon: FiDownload,
            title: "Data Export",
            description: "Export appointment data to CSV for reporting",
            gradient: "from-pink-500 to-rose-500",
        },
    ];

    const usps = [
        "GraphQL API for efficient data fetching",
        "Time conflict detection preventing double-booking",
        "Production-grade TypeScript codebase",
        "Real-time data synchronization",
        "Responsive design for all devices",
        "Professional UI/UX following healthcare standards",
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b bg-white/95 backdrop-blur-lg fixed w-full z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <FiCalendar className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">SwasthiQ</h1>
                            <p className="text-xs text-slate-600">EMR System</p>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                    >
                        Open Dashboard
                        <FiArrowRight />
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/40">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-semibold">
                            Modern Healthcare Management
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            Streamline Your
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {" "}Appointment Management
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            A comprehensive Electronic Medical Records system built with modern technologies,
                            featuring intelligent scheduling, conflict detection, and real-time analytics.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                href="/"
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-semibold text-lg shadow-xl shadow-indigo-600/30 flex items-center gap-2"
                            >
                                Get Started
                                <FiArrowRight />
                            </Link>
                            <Link
                                href="/appointments/new"
                                className="px-8 py-4 bg-white text-slate-900 rounded-xl hover:bg-slate-50 transition font-semibold text-lg border-2 border-slate-200 shadow-lg"
                            >
                                Create Appointment
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
                        <p className="text-xl text-slate-600">Everything you need to manage appointments efficiently</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl border-2 border-slate-200 hover:border-transparent hover:shadow-2xl transition-all bg-white group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 from-slate-900 to-transparent"></div>
                                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <feature.icon className="text-white text-2xl" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* USPs Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why Choose SwasthiQ?</h2>
                        <p className="text-xl text-indigo-200">Built with enterprise-grade technologies</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {usps.map((usp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition border border-white/10"
                            >
                                <FiCheckCircle className="text-2xl text-emerald-400 flex-shrink-0 mt-0.5" />
                                <p className="text-lg">{usp}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-slate-900 mb-12">Built With Modern Technology</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: "Next.js 14", desc: "React Framework", gradient: "from-slate-600 to-slate-800" },
                            { name: "TypeScript", desc: "Type Safety", gradient: "from-blue-600 to-blue-800" },
                            { name: "GraphQL", desc: "API Layer", gradient: "from-pink-600 to-rose-800" },
                            { name: "Python", desc: "Backend", gradient: "from-yellow-600 to-amber-800" },
                        ].map((tech) => (
                            <motion.div
                                key={tech.name}
                                whileHover={{ scale: 1.05 }}
                                className="p-6 rounded-xl bg-white border-2 border-slate-200 hover:border-transparent hover:shadow-xl transition-all"
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${tech.gradient} rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                                    {tech.name.charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{tech.name}</h3>
                                <p className="text-slate-600 text-sm">{tech.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to Get Started?</h2>
                    <p className="text-xl text-slate-600 mb-8">
                        Experience the next generation of appointment management
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition font-semibold text-lg shadow-2xl shadow-indigo-600/40"
                    >
                        Launch Dashboard
                        <FiArrowRight className="text-xl" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 bg-slate-900 text-slate-400 text-center border-t border-slate-800">
                <p>&copy; 2025 SwasthiQ EMR. Built for SwasthiQ Hiring Assignment.</p>
            </footer>
        </div>
    );
}
