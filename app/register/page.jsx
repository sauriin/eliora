"use client";

import { useState } from "react";
import HeaderImage from "./images/BannerBlue.png";
import paymentQR from "./images/PaymentQR.jpg";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ElioraRegistration() {
    const [paymentMethod, setPaymentMethod] = useState("online");
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
        paymentProof: null,
        comment: "",   // ✅ Added
    });
    const [errors, setErrors] = useState({});
    const [registering, setIsRegistering] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const nav = useRouter();

    const createRegistration = useMutation(api.registration.create);
    const generateUploadUrl = useMutation(api.registration.generateUploadUrl);

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
        else if (formData.whatsappNumber === formData.emergencyContact)
            newErrors.emergencyContact = "Emergency contact cannot be the same as WhatsApp number";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.emailAddress || !emailRegex.test(formData.emailAddress))
            newErrors.emailAddress = "Enter a valid email address.";
        if (!formData.parishName.trim()) newErrors.parishName = "Parish name is required.";
        if (!formData.paymentProof) newErrors.paymentProof = "Payment screenshot is required.";
        return newErrors;
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!["image/jpeg", "image/png"].includes(file.type)) {
                setErrors((prev) => ({ ...prev, paymentProof: "Only JPG/PNG allowed." }));
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, paymentProof: "File size must be under 2MB." }));
                return;
            }
            setErrors((prev) => ({ ...prev, paymentProof: null }));
            setFormData((prev) => ({ ...prev, paymentProof: file }));
        }
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
            let fileStorageId = null;
            if (formData.paymentProof) {
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": formData.paymentProof.type },
                    body: formData.paymentProof,
                });
                const json = await result.json();
                fileStorageId = json.storageId;
            }
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
                paymentProof: fileStorageId,
                comment: formData.comment || undefined,   // ✅ Added
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
            <div
                className="w-full"
                style={{
                    backgroundImage: `url(${HeaderImage.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    aspectRatio: "1700/400",
                }}
            />
            <div className="container max-w-3xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
                            ELIORA - God is my light!
                        </h1>
                        <div className="text-gray-600 mt-2 text-base leading-relaxed space-y-2">
                            <p>"Your word is a lamp to my feet and light to my path. - Psalm 119:105"</p>
                            <p>
                                Eliora 2025 - An Initial Retreat for the Diocese of Vadodara.
                                Return to where you belong, in God's love!
                            </p>
                            <div className="space-y-1">
                                <p><strong>Dates:</strong> 24 - 26 Oct, 2025</p>
                                <p><strong>Venue:</strong> Netrang</p>
                                <p><strong>Language:</strong> English</p>
                                <p><strong>Age group:</strong> 16-30 years</p>
                                <p><strong>Registration Fee:</strong> ₹1000/- (Includes food and accommodation)</p>
                            </div>
                        </div>
                        <div className="mt-4 text-gray-600">
                            <p>For any concern please reach out to us:</p>
                            <ul className="mt-2 space-y-1">
                                <li>Honey Chavda (General Coordinator): +91 63520 55646</li>
                                <li>Francis Tellis (Program Coordinator): +91 99980 71630</li>
                                <li>Sejal Macwan (Mobilization in charge): +91 93134 33681</li>
                            </ul>
                        </div>
                    </div>
                    <hr className="my-12 h-0.5 border-t-0 bg-blue-100" />
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-medium text-gray-900">
                                Full Name<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => handleInputChange("fullName", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="gender" className="text-sm font-medium text-gray-900">
                                Gender<span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                                id="gender"
                                required
                                value={formData.gender}
                                onChange={(e) => handleInputChange("gender", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select your gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lifeStatus" className="text-sm font-medium text-gray-900">
                                What are you currently doing?<span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                                id="lifeStatus"
                                required
                                value={formData.lifeStatus}
                                onChange={(e) => handleInputChange("lifeStatus", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select an option</option>
                                <option value="Study">Study</option>
                                <option value="Job">Job</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.lifeStatus && <p className="text-red-500 text-sm">{errors.lifeStatus}</p>}
                        </div>
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
                                className="flex h-12 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="whatsappNumber" className="text-sm font-medium text-gray-900">
                                Contact Number (WhatsApp)<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="whatsappNumber"
                                type="tel"
                                required
                                value={formData.whatsappNumber}
                                onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.whatsappNumber && <p className="text-red-500 text-sm">{errors.whatsappNumber}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="emergencyContact" className="text-sm font-medium text-gray-900">
                                Emergency Contact Name and Number<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="emergencyContact"
                                type="text"
                                required
                                value={formData.emergencyContact}
                                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.emergencyContact && <p className="text-red-500 text-sm">{errors.emergencyContact}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="emailAddress" className="text-sm font-medium text-gray-900">
                                Email Address<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="emailAddress"
                                type="email"
                                required
                                value={formData.emailAddress}
                                onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.emailAddress && <p className="text-red-500 text-sm">{errors.emailAddress}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-medium text-gray-900">
                                Address
                            </label>
                            <input
                                id="address"
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="parishName" className="text-sm font-medium text-gray-900">
                                Parish<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="parishName"
                                type="text"
                                required
                                value={formData.parishName}
                                onChange={(e) => handleInputChange("parishName", e.target.value)}
                                className="flex h-12 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.parishName && <p className="text-red-500 text-sm">{errors.parishName}</p>}
                        </div>
                        {paymentMethod === "online" && (
                            <div className="space-y-4 border-l-4 border-blue-500 pl-4 py-2">
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">
                                Upload Payment Screenshot<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.paymentProof && <p className="text-red-500 text-sm">{errors.paymentProof}</p>}
                            {formData.paymentProof && (
                                <img
                                    src={URL.createObjectURL(formData.paymentProof)}
                                    alt="Preview"
                                    className="mt-2 h-32 rounded-md border object-contain"
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="prayerIntention" className="text-sm font-medium text-gray-900">
                                Prayer Intention
                            </label>
                            <textarea
                                id="prayerIntention"
                                rows={3}
                                value={formData.prayerIntention || ""}
                                onChange={(e) => handleInputChange("prayerIntention", e.target.value)}
                                className="flex w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="comment" className="text-sm font-medium text-gray-900">
                                Additional Comment
                            </label>
                            <textarea
                                id="comment"
                                rows={3}
                                value={formData.comment}
                                onChange={(e) => handleInputChange("comment", e.target.value)}
                                className="flex w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {submitError && <div className="text-red-600 text-sm">{submitError}</div>}
                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={registering}
                                className={`inline-flex items-center justify-center h-12 px-8 rounded-full text-base font-medium text-white ${registering ? "bg-orange-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
                            >
                                {registering ? "Registering..." : "Register for Eliora!"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
