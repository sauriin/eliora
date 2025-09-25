"use client"

import { useParams } from "next/navigation"
import { api } from "../../../convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import Loader from "../loader"
import { useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function Form() {
    const params = useParams()
    const [message, setMessage] = useState({ text: '', type: '' });
    const [authenticated, setAuthenticated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const registrationId = params.id;

    const registrationDetails = useQuery(api.registration.getRegistration, { registrationId });
    const updateRegistration = useMutation(api.registration.updateRegistration);

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

    if (!registrationDetails) {
        return <Loader />
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const parishName = form.parishName.value;
        const comment = form.comment.value;

        if (!parishName.trim()) {
            setMessage({ text: 'Parish Name cannot be empty. Please fill it out.', type: 'error' });
            return;
        }

        const updatedData = {
            registrationId: registrationId,
            parishName: parishName,
            comment: comment
        };

        try {
            await updateRegistration(updatedData);
            setMessage({ text: 'Changes saved successfully!', type: 'success' });
        } catch (error) {
            console.error("Failed to save changes:", error);
            setMessage({ text: 'Failed to save changes. Please try again.', type: 'error' });
        }

        setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 5000);
    };

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

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8 px-4 sm:px-6">
            <div className="w-full max-w-2xl bg-[#2b50f5] p-6 mb-8 rounded-lg">
                <h1 className="text-2xl font-bold text-white text-center">Edit Registration Details</h1>
            </div>

            <div className="w-full max-w-2xl space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-[#2b50f5]">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Full Name:</span>
                            <span>{registrationDetails.fullName}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Gender:</span>
                            <span>{registrationDetails.gender}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Date of Birth:</span>
                            <span>{registrationDetails.dateOfBirth}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Life Status:</span>
                            <span>{registrationDetails.lifeStatus}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">WhatsApp Number:</span>
                            <span>{registrationDetails.whatsappNumber}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Emergency Contact:</span>
                            <span>{registrationDetails.emergencyContact}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Email Address:</span>
                            <span>{registrationDetails.emailAddress}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Address:</span>
                            <span>{registrationDetails.address}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-[#2b50f5]">Additional Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Prayer Intention:</span>
                            <span className="text-justify mr-3">{registrationDetails.prayerIntention}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Payment Method:</span>
                            <span className={registrationDetails.paymentMethod == 'cash' ? 'text-red-600 font-semibold' : 'text-green-500 font-semibold'}>{registrationDetails.paymentMethod.toUpperCase()}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">Payment Proof:</span>
                            <span>{registrationDetails.paymentMethod == 'cash' ? 'Payment mode is cash' : registrationDetails.paymentProof == null ? 'No proof uploaded' : registrationDetails.paymentProof}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {message.text && (
                            <div className={`p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <div>
                            <label htmlFor="parishName" className="block text-sm font-medium text-gray-700 mb-1">
                                Parish Name
                            </label>
                            <input
                                type="text"
                                id="parishName"
                                name="parishName"
                                defaultValue={registrationDetails.parishName}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter parish name"
                            />
                        </div>

                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                                Comment
                            </label>
                            <textarea
                                id="comment"
                                name="comment"
                                defaultValue={registrationDetails.comment}
                                rows={4}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                placeholder="Add a comment or note"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#2b50f5] text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-[#2042d9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2b50f5] transition-all"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}