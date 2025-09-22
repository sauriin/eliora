"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Eye, EyeOff, Lock } from "lucide-react";
import { api } from "../../convex/_generated/api";

export default function ParticipantsPage() {
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [activeFilters, setActiveFilters] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        gender: "",
        lifeStatus: "",
        parish: "",
        paymentMethod: "",
        dobRange: { from: "", to: "" },
        regDate: { from: "", to: "" },
    });

    const registrations = useQuery(api.registration.listAll);

    const handleLogin = async () => {
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            if (data.success) setAuthenticated(true);
            else alert(data.message || "Incorrect password!");
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong.");
        }
    };

    if (!registrations) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-gray-600 text-lg animate-pulse">
                    Loading participants...
                </p>
            </div>
        );
    }

    // Apply filters
    let filteredData = registrations;
    if (activeFilters.includes("search")) {
        filteredData = filteredData.filter(
            (r) =>
                r.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                r.emailAddress?.toLowerCase().includes(filters.search.toLowerCase())
        );
    }
    if (activeFilters.includes("gender") && filters.gender) {
        filteredData = filteredData.filter((r) => r.gender === filters.gender);
    }
    if (activeFilters.includes("lifeStatus") && filters.lifeStatus) {
        filteredData = filteredData.filter((r) => r.lifeStatus === filters.lifeStatus);
    }
    if (activeFilters.includes("parish") && filters.parish) {
        filteredData = filteredData.filter((r) =>
            r.parishName?.toLowerCase().includes(filters.parish.toLowerCase())
        );
    }
    if (activeFilters.includes("paymentMethod") && filters.paymentMethod) {
        filteredData = filteredData.filter((r) => r.paymentMethod === filters.paymentMethod);
    }
    if (activeFilters.includes("dobRange") && filters.dobRange.from && filters.dobRange.to) {
        filteredData = filteredData.filter(
            (r) =>
                new Date(r.dateOfBirth) >= new Date(filters.dobRange.from) &&
                new Date(r.dateOfBirth) <= new Date(filters.dobRange.to)
        );
    }
    if (activeFilters.includes("regDate") && filters.regDate.from && filters.regDate.to) {
        filteredData = filteredData.filter(
            (r) =>
                new Date(r.createdAt) >= new Date(filters.regDate.from) &&
                new Date(r.createdAt) <= new Date(filters.regDate.to)
        );
    }

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(
            new Blob([excelBuffer], { type: "application/octet-stream" }),
            "participants.xlsx"
        );
    };

    // 🔐 Admin Login Layout
    if (!authenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-4">
                <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md relative border border-indigo-100">
                    <div className="flex flex-col items-center mb-6">
                        <div className="bg-indigo-600 text-white p-3 rounded-full shadow-lg mb-3">
                            <Lock size={28} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-800">Admin Access</h2>
                        <p className="text-gray-500 text-sm mt-1">Please enter your password</p>
                    </div>

                    <div className="relative mb-6">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-4 py-3 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-[1.02]"
                    >
                        Unlock
                    </button>
                </div>
            </div>
        );
    }

    const availableFilters = [
        { key: "search", label: "Search (Name/Email)" },
        { key: "gender", label: "Gender" },
        { key: "lifeStatus", label: "Life Status" },
        { key: "parish", label: "Parish" },
        { key: "paymentMethod", label: "Payment Method" },
        { key: "dobRange", label: "Date of Birth Range" },
        { key: "regDate", label: "Registration Date Range" },
    ];

    return (
        <div className="p-4 sm:p-6 md:p-10 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight">
                    📋 Participants
                </h1>
                <div className="text-sm sm:text-base text-gray-600 flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                        Total: {registrations.length}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        Filtered: {filteredData.length}
                    </span>
                </div>
            </div>

            {/* Filter Selector */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                <label className="font-medium mb-2 sm:mb-0 text-gray-700">
                    ➕ Add Filter:
                </label>
                <select
                    onChange={(e) => {
                        if (e.target.value && !activeFilters.includes(e.target.value)) {
                            setActiveFilters([...activeFilters, e.target.value]);
                        }
                        e.target.value = "";
                    }}
                    className="border px-3 py-2 rounded-lg shadow-sm w-full sm:w-auto focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Select filter</option>
                    {availableFilters
                        .filter((f) => !activeFilters.includes(f.key))
                        .map((f) => (
                            <option key={f.key} value={f.key}>
                                {f.label}
                            </option>
                        ))}
                </select>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
                {activeFilters.map((key) => {
                    const removeFilter = () => {
                        setActiveFilters(activeFilters.filter((f) => f !== key));
                        setFilters((prev) => ({
                            ...prev,
                            [key]:
                                key === "dobRange" || key === "regDate" ? { from: "", to: "" } : "",
                        }));
                    };

                    const wrapper = (child) => (
                        <div
                            key={key}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-100 p-3 rounded-xl shadow-sm"
                        >
                            {child}
                            <button
                                type="button"
                                onClick={removeFilter}
                                className="text-red-500 hover:text-red-700 font-semibold"
                            >
                                ✕
                            </button>
                        </div>
                    );

                    switch (key) {
                        case "search":
                            return wrapper(
                                <input
                                    type="text"
                                    placeholder="Search by name/email"
                                    value={filters.search}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, search: e.target.value }))
                                    }
                                    className="border px-3 py-2 rounded-md shadow-sm w-full sm:w-auto"
                                />
                            );
                        case "gender":
                            return wrapper(
                                <select
                                    value={filters.gender}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, gender: e.target.value }))
                                    }
                                    className="border px-3 py-2 rounded-md shadow-sm"
                                >
                                    <option value="">All Genders</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            );
                        case "lifeStatus":
                            return wrapper(
                                <select
                                    value={filters.lifeStatus}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, lifeStatus: e.target.value }))
                                    }
                                    className="border px-3 py-2 rounded-md shadow-sm"
                                >
                                    <option value="">All Life Status</option>
                                    <option value="Study">Study</option>
                                    <option value="Job">Job</option>
                                    <option value="Other">Other</option>
                                </select>
                            );
                        case "parish":
                            return wrapper(
                                <input
                                    type="text"
                                    placeholder="Filter by Parish"
                                    value={filters.parish}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, parish: e.target.value }))
                                    }
                                    className="border px-3 py-2 rounded-md shadow-sm"
                                />
                            );
                        case "paymentMethod":
                            return wrapper(
                                <select
                                    value={filters.paymentMethod}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            paymentMethod: e.target.value,
                                        }))
                                    }
                                    className="border px-3 py-2 rounded-md shadow-sm"
                                >
                                    <option value="">All Payments</option>
                                    <option value="cash">Cash</option>
                                    <option value="online">Online</option>
                                </select>
                            );
                        case "dobRange":
                            return wrapper(
                                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
                                    <div>
                                        <label className="block text-xs text-gray-600">DOB From</label>
                                        <input
                                            type="date"
                                            value={filters.dobRange.from}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    dobRange: { ...prev.dobRange, from: e.target.value },
                                                }))
                                            }
                                            className="border px-3 py-2 rounded-md shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600">DOB To</label>
                                        <input
                                            type="date"
                                            value={filters.dobRange.to}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    dobRange: { ...prev.dobRange, to: e.target.value },
                                                }))
                                            }
                                            className="border px-3 py-2 rounded-md shadow-sm"
                                        />
                                    </div>
                                </div>
                            );
                        case "regDate":
                            return wrapper(
                                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
                                    <div>
                                        <label className="block text-xs text-gray-600">Reg From</label>
                                        <input
                                            type="date"
                                            value={filters.regDate.from}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    regDate: { ...prev.regDate, from: e.target.value },
                                                }))
                                            }
                                            className="border px-3 py-2 rounded-md shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600">Reg To</label>
                                        <input
                                            type="date"
                                            value={filters.regDate.to}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    regDate: { ...prev.regDate, to: e.target.value },
                                                }))
                                            }
                                            className="border px-3 py-2 rounded-md shadow-sm"
                                        />
                                    </div>
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </div>

            {/* Download button */}
            <button
                onClick={downloadExcel}
                className="mb-8 inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-2.5 rounded-full shadow-md hover:from-green-700 hover:to-emerald-600 transition transform hover:scale-105"
            >
                ⬇ Download Excel
            </button>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100 sticky top-0 z-10">
                        <tr>
                            {[
                                "Name",
                                "Gender",
                                "Life Status",
                                "DOB",
                                "WhatsApp",
                                "Emergency Contact",
                                "Email",
                                "Address",
                                "Parish",
                                "Payment",
                                "Prayer Intention",
                                "Registered",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="px-4 py-3 text-sm font-semibold text-gray-700 border-b"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={12}
                                    className="px-4 py-10 text-center text-gray-500"
                                >
                                    No participants found.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((r, i) => (
                                <tr
                                    key={r._id}
                                    className={`transition hover:bg-indigo-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                        }`}
                                >
                                    <td className="px-4 py-3 font-medium">{r.fullName}</td>
                                    <td className="px-4 py-3">{r.gender}</td>
                                    <td className="px-4 py-3">{r.lifeStatus}</td>
                                    <td className="px-4 py-3">{r.dateOfBirth}</td>
                                    <td className="px-4 py-3">{r.whatsappNumber}</td>
                                    <td className="px-4 py-3">{r.emergencyContact}</td>
                                    <td className="px-4 py-3">{r.emailAddress}</td>
                                    <td className="px-4 py-3">{r.address || "-"}</td>
                                    <td className="px-4 py-3">{r.parishName}</td>
                                    <td className="px-4 py-3 capitalize">{r.paymentMethod}</td>
                                    <td className="px-4 py-3">{r.prayerIntention || "-"}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
