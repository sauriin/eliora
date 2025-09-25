"use client"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useEffect, useState } from "react";
import { ArrowUpDown, Eye, EyeOff, Lock } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import FileDisplay from "./image";
import Loader from './loader';
import { useRouter } from "next/navigation";

export default function Page() {
    const [search, setSearch] = useState("");
    const [gender, setGender] = useState("all");
    const [payment, setPayment] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const route = useRouter();

    const participants = useQuery(api.registration.listAll);

    useEffect(() => {
        const auth = window.localStorage.getItem("authenticated");
        const authTime = window.localStorage.getItem("authTime");
        if (auth && authTime && Date.now() < parseInt(authTime)) {
            setAuthenticated(true);
        } else {
            window.localStorage.removeItem("authenticated");
            window.localStorage.removeItem("authTime");
        }
    }, [])

    const handleLogin = async () => {
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            if (data.success) {
                setAuthenticated(true);
                window.localStorage.setItem("authenticated", "true");
                const expireTime = Date.now() + 15 * 60 * 1000;
                window.localStorage.setItem("authTime", expireTime.toString());
            }
            else alert(data.message || "Incorrect password!");
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong.");
        }
    };

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

    else {
        if (!participants) {
            return <Loader />
        }

        const filteredMembers = participants
            .filter((m) => {
                const matchSearch = m.fullName.toLowerCase().includes(search.toLowerCase());
                const matchGender = gender === "all" || m.gender === gender;
                const matchPayment = payment === "all" || m.paymentMethod === payment;
                return matchSearch && matchGender && matchPayment;
            })
            .sort((a, b) => {
                if (!sortConfig.key) return 0;
                const valueA = a[sortConfig.key];
                const valueB = b[sortConfig.key];
                if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
                if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });

        const handleSort = (key) => {
            setSortConfig((prev) => {
                if (prev.key === key) {
                    return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
                }
                return { key, direction: "asc" };
            });
        };

        const renderSortIcon = (key) => (
            <ArrowUpDown
                size={14}
                className={`inline ml-1 transition-transform ${sortConfig.key === key
                    ? sortConfig.direction === "asc"
                        ? "rotate-180"
                        : ""
                    : "opacity-30"
                    }`}
            />
        );

        const downloadExcel = () => {

            const cleanedRegistrations = participants.map(data => {
                return {
                    "Full Name": data.fullName,
                    Gender: data.gender,
                    "Date of Birth": data.dateOfBirth,
                    Number: data.whatsappNumber,
                    "Emergency Contact": data.emergencyContact,
                    Email: data.emailAddress,
                    Address: data.address || '-',
                    Parish: data.parishName,
                    "Life Status": data.lifeStatus,
                    Payment: data.paymentMethod,
                    Comment: data.comment || '-',
                    "Prayer Intention": data.prayerIntention || '-',
                    Registered: new Date(data.createdAt).toLocaleDateString(),
                    "Payment Proof": data.paymentProof ? "Slip Attached" : '-'
                }
            });

            const worksheet = XLSX.utils.json_to_sheet(cleanedRegistrations);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            saveAs(
                new Blob([excelBuffer], { type: "application/octet-stream" }),
                "participants.xlsx"
            );
        };

        return (
            <div className="bg-gray-50 min-h-screen flex flex-col">
                <header className="bg-blue-600 text-white p-6">
                    <h1 className="text-3xl font-bold">Participants - Eliora '25</h1>
                </header>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b bg-white shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />

                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full md:w-40 px-4 py-2 border rounded-lg"
                        >
                            <option value="all">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <select
                            value={payment}
                            onChange={(e) => setPayment(e.target.value)}
                            className="w-full md:w-40 px-4 py-2 border rounded-lg"
                        >
                            <option value="all">All Payments</option>
                            <option value="online">Online</option>
                            <option value="cash">Cash</option>
                        </select>

                        <p className="bg-blue-400 flex justify-center items-center text-white px-2">{participants.length} records</p>
                    </div>

                    <div className="flex gap-2">
                        <button className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={downloadExcel}>
                            Export to Excel
                        </button>
                    </div>
                </div>

                <main className="flex-1 p-6 overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <thead className="bg-gray-100 text-gray-700 text-sm">
                            <tr>
                                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("name")}>
                                    Name {renderSortIcon("name")}
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("gender")}>
                                    Gender {renderSortIcon("gender")}
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("status")}>
                                    Life Status {renderSortIcon("status")}
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("dob")}>
                                    DOB {renderSortIcon("dob")}
                                </th>
                                <th className="px-4 py-3">WhatsApp</th>
                                <th className="px-4 py-3">Emergency Contact</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Address</th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("parish")}>
                                    Parish {renderSortIcon("parish")}
                                </th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("payment")}>
                                    Payment {renderSortIcon("payment")}
                                </th>
                                <th className="px-4 py-3">Comment</th>
                                <th className="px-4 py-3">Prayer Intention</th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("registered")}>
                                    Registered {renderSortIcon("registered")}
                                </th>
                                <th className="px-4 py-3">
                                    Payment Proof
                                </th>
                                <th className="px-4 py-3">
                                    Edit
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-200">
                            {filteredMembers.map((m, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{m.fullName}</td>
                                    <td className="px-4 py-3">{m.gender}</td>
                                    <td className="px-4 py-3">{m.lifeStatus}</td>
                                    <td className="px-4 py-3">{m.dateOfBirth}</td>
                                    <td className="px-4 py-3">{m.whatsappNumber}</td>
                                    <td className="px-4 py-3">{m.emergencyContact}</td>
                                    <td className="px-4 py-3">{m.emailAddress}</td>
                                    <td className="px-4 py-3">{m.address}</td>
                                    <td className="px-4 py-3">{m.parishName}</td>
                                    <td
                                        className={`px-4 py-3 font-semibold ${m.paymentMethod.toLowerCase() === "online" ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {m.paymentMethod}
                                    </td>
                                    <td className="px-4 py-3">{m.comment ||
                                        '-'}</td>
                                    <td className="px-4 py-3">{m.prayerIntention ||
                                        '-'}</td>
                                    <td className="px-4 py-3">{new Date(m.createdAt).toLocaleDateString()}</td>
                                    <td>{m.paymentProof && (<FileDisplay storageId={m.paymentProof} />)}</td>
                                    <td className="px-4 py-3 text-blue-500 font-medium cursor-pointer" onClick={() => { route.push('/parts/' + m._id) }}>Edit</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                    {participants.length == 0 && <div className="w-full text-center bg-red-400 text-white p-6 rounded-xl">No Registrations</div>}
                </main>
            </div>
        );
    }
}