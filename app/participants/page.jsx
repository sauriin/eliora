"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { api } from "../../convex/_generated/api";

export default function ParticipantsPage() {
    const registrations = useQuery(api.registration.listAll);
    const updateRegistration = useMutation(api.registration.update);
    const fetchPaymentUrl = useMutation(api.registration.fetchPaymentUrl); // fetch file URL

    const [filters, setFilters] = useState({
        search: "",
        gender: "",
        paymentMethod: "",
    });

    const [editingRowId, setEditingRowId] = useState(null);
    const [editingData, setEditingData] = useState({});
    const [downloadingExcel, setDownloadingExcel] = useState(false)

    if (!registrations) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-gray-600 text-lg animate-pulse">Loading participants...</p>
            </div>
        );
    }

    // Apply filters
    console.log(registrations)
    let filteredData = registrations;
    if (filters.search) {
        filteredData = filteredData.filter(
            (r) =>
                r.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                r.emailAddress?.toLowerCase().includes(filters.search.toLowerCase())
        );
    }
    if (filters.gender) filteredData = filteredData.filter((r) => r.gender === filters.gender);
    if (filters.paymentMethod)
        filteredData = filteredData.filter((r) => r.paymentMethod === filters.paymentMethod);

    const downloadExcel = async () => {
        try {
            setDownloadingExcel(true)
            const selectedFields = await Promise.all(
                filteredData.map(async (item) => {
                    let paymentUrl = "";
                    if (item.paymentProof) {
                        try {
                            paymentUrl = await fetchPaymentUrl({ storageId: item.paymentProof });
                        } catch (e) {
                            console.error("Error fetching payment proof:", e);
                        }
                    }

                    return {
                        Name: item.fullName,
                        Gender: item.gender,
                        "Life Status": item.lifeStatus,
                        DOB: item.dateOfBirth,
                        WhatsApp: item.whatsappNumber,
                        "Emergency Contact": item.emergencyContact,
                        Email: item.emailAddress,
                        Address: item.address,
                        Parish: item.parishName,
                        Payment: item.paymentMethod,
                        Comment: item.comment || "",
                        "Prayer Intention": item.prayerIntention,
                        "Registered Date": new Date(item.createdAt).toLocaleString(),
                        "Payment Proof": paymentUrl || "Not done or check comment",
                    };
                })
            );

            const worksheet = XLSX.utils.json_to_sheet(selectedFields);
            
            const range = XLSX.utils.decode_range(worksheet["!ref"]);
            for (let row = range.s.r + 1; row <= range.e.r; row++) {
                const cellRef = XLSX.utils.encode_cell({ r: row, c: 13 }); // Payment Proof = 14th column (0-indexed)
                const cell = worksheet[cellRef];
                if (cell && cell.v && cell.v.startsWith("http")) {
                    worksheet[cellRef] = {
                        t: "s",
                        v: "Open Image",
                        l: { Target: cell.v, Tooltip: "Click to view payment proof" }
                    };
                }
            }

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "participants.xlsx");
        }
        finally {
            setDownloadingExcel(false)
        }
    };

    const handleEditChange = (field, value) => {
        setEditingData((prev) => ({ ...prev, [field]: value }));
    };

    const saveEdit = async () => {
        try {
            const allowedFields = [
                "fullName",
                "gender",
                "lifeStatus",
                "dateOfBirth",
                "whatsappNumber",
                "emergencyContact",
                "emailAddress",
                "address",
                "parishName",
                "paymentMethod",
                "prayerIntention",
                "comment",
            ];

            const updates = {};
            allowedFields.forEach((field) => {
                updates[field] = editingData[field];
            });

            await updateRegistration({ id: editingRowId, ...updates });
            setEditingRowId(null);
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const openPaymentProof = async (storageId) => {
        try {
            const url = await fetchPaymentUrl({ storageId });
            window.open(url, "_blank");
        } catch (err) {
            console.error("Failed to open payment proof:", err);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-blue-600 text-white px-6 py-4 text-xl font-bold">
                Participants - Eliora '25
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 px-6 py-4 border-b">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="border px-3 py-2 rounded text-sm w-64"
                    value={filters.search}
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                />
                <select
                    className="border px-3 py-2 rounded text-sm"
                    value={filters.gender}
                    onChange={(e) => setFilters((prev) => ({ ...prev, gender: e.target.value }))}
                >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <select
                    className="border px-3 py-2 rounded text-sm"
                    value={filters.paymentMethod}
                    onChange={(e) => setFilters((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                >
                    <option value="">All Payments</option>
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                </select>
                <span className="text-sm font-medium">{filteredData.length} records</span>
                <button
                    onClick={downloadExcel}
                    className="ml-auto bg-blue-600 text-white px-4 py-2 rounded text-sm cursor-pointer"
                >
                    {downloadingExcel ? <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Export to Excel"}
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 border-b">
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
                                "Comment",
                                "Prayer Intention",
                                "Registered",
                                "Payment Proof",
                                "Edit",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="px-4 py-2 text-left font-medium text-gray-700"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={15} className="px-4 py-6 text-center text-gray-500">
                                    No participants found.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((r) => (
                                <tr key={r._id} className="border-b hover:bg-gray-50">
                                    {editingRowId === r._id ? (
                                        <>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={editingData.fullName}
                                                    onChange={(e) => handleEditChange("fullName", e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <select
                                                    value={editingData.gender}
                                                    onChange={(e) => handleEditChange("gender", e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-2">
                                                <select
                                                    value={editingData.lifeStatus}
                                                    onChange={(e) => handleEditChange("lifeStatus", e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                >
                                                    <option value="Study">Study</option>
                                                    <option value="Job">Job</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="date"
                                                    value={editingData.dateOfBirth}
                                                    onChange={(e) => handleEditChange("dateOfBirth", e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={editingData.whatsappNumber}
                                                    onChange={(e) => handleEditChange("whatsappNumber", e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={editingData.emergencyContact}
                                                    onChange={(e) => handleEditChange("emergencyContact", e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={editingData.emailAddress}
                                                    onChange={(e) => handleEditChange("emailAddress", e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={editingData.address || ""}
                                                    onChange={(e) => handleEditChange("address", e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={editingData.parishName}
                                                    onChange={(e) => handleEditChange("parishName", e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <select
                                                    value={editingData.paymentMethod}
                                                    onChange={(e) => handleEditChange("paymentMethod", e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                >
                                                    <option value="cash">Cash</option>
                                                    <option value="online">Online</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={editingData.comment || ""}
                                                    onChange={(e) => handleEditChange("comment", e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    value={editingData.prayerIntention || ""}
                                                    onChange={(e) => handleEditChange("prayerIntention", e.target.value)}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </td>
                                            <td className="px-4 py-2">{new Date(editingData.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">
                                                {editingData.paymentProof ? (
                                                    <span
                                                        className="text-blue-600 underline cursor-pointer"
                                                        onClick={() => openPaymentProof(editingData.paymentProof)}
                                                    >
                                                        Open File
                                                    </span>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="px-4 py-2 flex gap-2">
                                                <button
                                                    onClick={saveEdit}
                                                    className="text-green-600 underline"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingRowId(null)}
                                                    className="text-red-600 underline"
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-2 font-medium">{r.fullName}</td>
                                            <td className="px-4 py-2">{r.gender}</td>
                                            <td className="px-4 py-2">{r.lifeStatus}</td>
                                            <td className="px-4 py-2">{r.dateOfBirth}</td>
                                            <td className="px-4 py-2">{r.whatsappNumber}</td>
                                            <td className="px-4 py-2">{r.emergencyContact}</td>
                                            <td className="px-4 py-2">{r.emailAddress}</td>
                                            <td className="px-4 py-2">{r.address || "-"}</td>
                                            <td className="px-4 py-2">{r.parishName}</td>
                                            <td className="px-4 py-2 font-semibold">
                                                {r.paymentMethod === "cash" ? (
                                                    <span className="text-red-600">cash</span>
                                                ) : (
                                                    <span className="text-green-600">online</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">{r.comment || "-"}</td>
                                            <td className="px-4 py-2">{r.prayerIntention || "-"}</td>
                                            <td className="px-4 py-2">{new Date(r.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">
                                                {r.paymentProof ? (
                                                    <span
                                                        className="text-blue-600 underline cursor-pointer"
                                                        onClick={() => openPaymentProof(r.paymentProof)}
                                                    >
                                                        Open File
                                                    </span>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td
                                                className="px-4 py-2 text-blue-600 underline cursor-pointer"
                                                onClick={() => {
                                                    setEditingRowId(r._id);
                                                    setEditingData(r);
                                                }}
                                            >
                                                Edit
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
