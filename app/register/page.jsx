"use client";

import { useState } from "react";
import HeaderImage from "./images/BannerBlue.png";
import paymentQR from "./images/PaymentQR.jpg";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ElioraRegistration() {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        gender: "",
        lifeStatus: "",
        dateOfBirth: "",
        whatsappNumber: "",
        emergencyContact: "",
        emailAddress: "",
        address: "",
        parishName: "",
        prayerIntention: "",
    });
    const [errors, setErrors] = useState({});
    const [registering, setIsRegistering] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const nav = useRouter();

    const createRegistration = useMutation(api.registration.create);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
        if (!formData.gender) newErrors.gender = "Please select your gender.";
        if (!formData.lifeStatus) newErrors.lifeStatus = "Please select your current status.";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.whatsappNumber || !phoneRegex.test(formData.whatsappNumber))
            newErrors.whatsappNumber = "Enter a valid 10-digit WhatsApp number.";
        if (!formData.emergencyContact.trim())
            newErrors.emergencyContact = "Emergency contact is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.emailAddress || !emailRegex.test(formData.emailAddress))
            newErrors.emailAddress = "Enter a valid email address.";
        if (!formData.parishName.trim()) newErrors.parishName = "Parish name is required.";
        return newErrors;
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
        setIsRegistering(true);

        try {
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                setIsRegistering(false);
                return;
            }
            setErrors({});

            await createRegistration({
                fullName: formData.fullName,
                gender: formData.gender,
                lifeStatus: formData.lifeStatus,
                dateOfBirth: formData.dateOfBirth,
                whatsappNumber: formData.whatsappNumber,
                emergencyContact: formData.emergencyContact,
                emailAddress: formData.emailAddress,
                address: formData.address || undefined,
                parishName: formData.parishName,
                paymentMethod,
                prayerIntention: formData.prayerIntention || undefined,
            });

            nav.push(
                `/register-success?fullName=${encodeURIComponent(
                    formData.fullName
                )}&gender=${formData.gender}&lifeStatus=${formData.lifeStatus}`
            );
        } catch (err) {
            console.error(err);
            setSubmitError("Something went wrong while submitting the form.");
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-poppins">
            {/* Hero Banner */}
            <div className="w-full overflow-hidden">
                <div
                    className="hidden md:block w-full"
                    style={{
                        backgroundImage: `url(${HeaderImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        aspectRatio: "1700 / 400",
                    }}
                />
                <div
                    className="block md:hidden w-full"
                    style={{
                        backgroundImage: `url(${HeaderImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        aspectRatio: "1720 / 440",
                    }}
                />
            </div>

            <div className="container max-w-3xl mx-auto px-4 py-8">
                <div className="space-y-8 animate-in fade-in duration-800">
                    {/* Event Information */}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
                            ELIORA - God is my light!
                        </h1>
                        <div className="text-gray-600 mt-2 text-base leading-relaxed space-y-2">
                            <p>
                                {"\"Your word is a lamp to my feet and light to my path. - Psalm 119:105\""}
                            </p>
                            <p>
                                Eliora 2025 - An Initial Retreat for the Diocese of Vadodara.
                                Return to where you belong, in God&apos;s love!
                            </p>
                            <div className="space-y-1">
                                <p><strong>Dates:</strong> 24 - 26 Oct, 2025</p>
                                <p><strong>Venue:</strong> Netrang</p>
                                <p><strong>Language:</strong> English</p>
                                <p><strong>Age group:</strong> 16-30 years</p>
                                <p>
                                    <strong>Registration Fee:</strong> ₹1000/- (Includes food and accommodation)
                                </p>
                            </div>
                        </div>

                        {/* Coordinators */}
                        <div className="mt-4 text-gray-600">
                            <p>For any concern please reach out to us:</p>
                            <ul className="mt-2 space-y-1">
                                <li>
                                    Honey Chavda (General Coordinator): <br />
                                    +91 63520 55646
                                </li>
                                <li>
                                    Francis Tellis (Program Coordinator): <br />
                                    +91 99980 71630
                                </li>
                                <li>
                                    Sejal Macwan (Mobilization in charge): <br />
                                    +91 93134 33681
                                </li>
                            </ul>
                        </div>
                    </div>

                    <hr className="my-12 h-0.5 border-t-0 bg-blue-100" />

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-medium text-gray-900">
                                Full Name<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                required
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange("fullName", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <label htmlFor="gender" className="text-sm font-medium text-gray-900">
                                Gender<span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                                id="gender"
                                required
                                value={formData.gender}
                                onChange={(e) => handleInputChange("gender", e.target.value)}
                                className="flex h-12 w-full items-center justify-between whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="" disabled>Select your gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                        </div>

                        {/* Life Status */}
                        <div className="space-y-2">
                            <label htmlFor="lifeStatus" className="text-sm font-medium text-gray-900">
                                What are you currently doing?<span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                                id="lifeStatus"
                                required
                                value={formData.lifeStatus}
                                onChange={(e) => handleInputChange("lifeStatus", e.target.value)}
                                className="flex h-12 w-full items-center justify-between whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="" disabled>Select an option</option>
                                <option value="Study">Study</option>
                                <option value="Job">Job</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.lifeStatus && <p className="text-red-500 text-sm">{errors.lifeStatus}</p>}
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-900">
                                Date of Birth<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="dateOfBirth"
                                type="date"
                                required
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
                        </div>

                        {/* WhatsApp Number */}
                        <div className="space-y-2">
                            <label htmlFor="whatsappNumber" className="text-sm font-medium text-gray-900">
                                Contact Number (WhatsApp)<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="whatsappNumber"
                                type="tel"
                                required
                                placeholder="e.g. 9876543210"
                                value={formData.whatsappNumber}
                                onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.whatsappNumber && <p className="text-red-500 text-sm">{errors.whatsappNumber}</p>}
                        </div>

                        {/* Emergency Contact */}
                        <div className="space-y-2">
                            <label htmlFor="emergencyContact" className="text-sm font-medium text-gray-900">
                                Emergency Contact Name and Number<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="emergencyContact"
                                type="text"
                                required
                                placeholder="e.g. ABCDE, 9876543210"
                                value={formData.emergencyContact}
                                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.emergencyContact && <p className="text-red-500 text-sm">{errors.emergencyContact}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="emailAddress" className="text-sm font-medium text-gray-900">
                                Email Address<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="emailAddress"
                                type="email"
                                required
                                placeholder="Enter your email address"
                                value={formData.emailAddress}
                                onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.emailAddress && <p className="text-red-500 text-sm">{errors.emailAddress}</p>}
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-medium text-gray-900">
                                Address
                            </label>
                            <input
                                id="address"
                                type="text"
                                placeholder="e.g. 12, Area, Vadodara"
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Parish */}
                        <div className="space-y-2">
                            <label htmlFor="parishName" className="text-sm font-medium text-gray-900">
                                Parish<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="parishName"
                                type="text"
                                required
                                placeholder="Enter your parish name"
                                value={formData.parishName}
                                onChange={(e) => handleInputChange("parishName", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.parishName && <p className="text-red-500 text-sm">{errors.parishName}</p>}
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-4 pt-4">
                            <label className="text-sm font-medium text-gray-900">
                                Payment Method<span className="text-red-500 ml-1">*</span>
                            </label>
                            <p className="text-sm text-gray-600">Please select your preferred payment method.</p>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        id="cash"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={paymentMethod === "cash"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="cash" className="cursor-pointer text-sm font-medium text-gray-900">
                                        Cash payment at venue
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 rounded-md hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        id="online"
                                        name="paymentMethod"
                                        value="online"
                                        checked={paymentMethod === "online"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="online" className="cursor-pointer text-sm font-medium text-gray-900">
                                        Online payment (UPI)
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Online Payment QR */}
                        {paymentMethod === "online" && (
                            <div className="space-y-4 border-l-4 border-blue-500 pl-4 py-2 animate-in slide-in-from-left duration-300">
                                <p className="text-sm font-medium text-gray-900 mb-2">
                                    Please scan the QR code to pay the registration fee of ₹1000/-.
                                </p>
                                <img
                                    src={paymentQR.src}
                                    alt="UPI QR Code"
                                    className="rounded-lg max-w-xs mx-auto md:mx-0"
                                />
                            </div>
                        )}

                        {submitError && <div className="text-red-600 text-sm">{submitError}</div>}

                        {/* Prayer Intention */}
                        <div className="space-y-2">
                            <label htmlFor="prayerIntention" className="text-sm font-medium text-gray-900">
                                Prayer Intention
                            </label>
                            <textarea
                                id="prayerIntention"
                                rows={3}
                                placeholder="Share your prayer intentions"
                                value={formData.prayerIntention || ""}
                                onChange={(e) => handleInputChange("prayerIntention", e.target.value)}
                                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={registering}
                                className={`inline-flex items-center justify-center h-12 px-8 rounded-full text-base font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${registering ? "bg-orange-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
                                    }`}
                            >
                                {registering ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        Register for Eliora!
                                        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
