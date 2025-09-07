"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ParticipantsPage() {
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);

    // Filters
    const [activeFilters, setActiveFilters] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        gender: "",
        lifeStatus: "",
        parish: "",
        travelWithUs: "",
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

            if (res.ok) {
                setAuthenticated(true);
            } else {
                alert("Incorrect password!");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong.");
        }
    };


    if (!registrations) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-gray-600 text-lg animate-pulse">Loading participants...</p>
            </div>
        );
    }

    // Filtering
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
    if (activeFilters.includes("travelWithUs") && filters.travelWithUs) {
        filteredData = filteredData.filter((r) => r.travelWithUs === filters.travelWithUs);
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
        saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "participants.xlsx");
    };

    if (!authenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">🔐 Admin Login</h2>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Login
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
        { key: "travelWithUs", label: "Travel With Us" },
        { key: "paymentMethod", label: "Payment Method" },
        { key: "dobRange", label: "Date of Birth Range" },
        { key: "regDate", label: "Registration Date Range" },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">📋 Participants</h1>
                <div className="text-sm text-gray-600">
                    <span className="mr-3">Total: {registrations.length}</span>
                    <span>Filtered: {filteredData.length}</span>
                </div>
            </div>

            {/* Filter Selector */}
            <div className="mb-6 flex items-center gap-3">
                <label className="font-medium">➕ Add Filter:</label>
                <select
                    onChange={(e) => {
                        if (e.target.value && !activeFilters.includes(e.target.value)) {
                            setActiveFilters([...activeFilters, e.target.value]);
                        }
                        e.target.value = "";
                    }}
                    className="border px-3 py-2 rounded-md bg-white shadow-sm"
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
            <div className="flex flex-wrap gap-4 mb-6">
                {activeFilters.map((key) => {
                    const removeFilter = () => {
                        setActiveFilters(activeFilters.filter((f) => f !== key));
                        setFilters((prev) => ({
                            ...prev,
                            [key]:
                                key === "dobRange" || key === "regDate"
                                    ? { from: "", to: "" }
                                    : "",
                        }));
                    };

                    const wrapper = (child) => (
                        <div key={key} className="flex items-center gap-2">
                            {child}
                            <button
                                type="button"
                                onClick={removeFilter}
                                className="text-red-500 hover:text-red-700 font-bold"
                            >
                                Cancel
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
                                    className="border px-3 py-2 rounded-md shadow-sm"
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
                        case "travelWithUs":
                            return wrapper(
                                <select
                                    value={filters.travelWithUs}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, travelWithUs: e.target.value }))
                                    }
                                    className="border px-3 py-2 rounded-md shadow-sm"
                                >
                                    <option value="">Travel With Us?</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
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
                                <div className="flex gap-2 items-end">
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
                                <div className="flex gap-2 items-end">
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

            <button
                onClick={downloadExcel}
                className="mb-6 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
            >
                ⬇ Download Excel
            </button>

            {/* Table or Empty State */}
            {filteredData.length === 0 ? (
                <div className="bg-white p-10 rounded-xl shadow-md text-center text-gray-500">
                    <p className="text-lg">No participants found.</p>
                    <p className="text-sm mt-2">Try removing some filters to see more records.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="border px-4 py-3">Name</th>
                                <th className="border px-4 py-3">Gender</th>
                                <th className="border px-4 py-3">Life Status</th>
                                <th className="border px-4 py-3">Parish</th>
                                <th className="border px-4 py-3">DOB</th>
                                <th className="border px-4 py-3">WhatsApp</th>
                                <th className="border px-4 py-3">Payment</th>
                                <th className="border px-4 py-3">Travel</th>
                                <th className="border px-4 py-3">Registered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((r) => (
                                <tr key={r._id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{r.fullName}</td>
                                    <td className="border px-4 py-2">{r.gender}</td>
                                    <td className="border px-4 py-2">{r.lifeStatus}</td>
                                    <td className="border px-4 py-2">{r.parishName}</td>
                                    <td className="border px-4 py-2">{r.dateOfBirth}</td>
                                    <td className="border px-4 py-2">{r.whatsappNumber}</td>
                                    <td className="border px-4 py-2 capitalize">{r.paymentMethod}</td>
                                    <td className="border px-4 py-2">{r.travelWithUs}</td>
                                    <td className="border px-4 py-2">
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
