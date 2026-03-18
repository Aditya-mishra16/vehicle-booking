"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function DriverRegistrationModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    vehicle: "",
  });

  /* Lock page scroll when modal opens */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const loadingToast = toast.loading("Submitting registration...");

    try {
      setLoading(true);

      const res = await fetch("/api/driver/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Driver registration submitted successfully!");

        setFormData({
          fullName: "",
          phone: "",
          email: "",
          city: "",
          vehicle: "",
        });

        onClose();
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay (no close on click) */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-[650px] rounded-2xl shadow-2xl p-8 md:p-10 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 text-gray-400 hover:text-black transition"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">
            <span className="text-brandColor">Driver</span> Registration
          </h2>

          <p className="text-gray-500 mt-3 text-sm md:text-base">
            Fill in your details to register as a driver.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium">
              Full Name<span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-2 w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandColor disabled:bg-gray-100"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium">
              Phone Number<span className="text-red-500">*</span>
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-2 w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandColor disabled:bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="mt-2 w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandColor disabled:bg-gray-100"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-medium">
              City<span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-2 w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandColor disabled:bg-gray-100"
            />
          </div>

          {/* Vehicle */}
          <div>
            <label className="text-sm font-medium">
              Vehicle Name<span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="vehicle"
              placeholder="Enter your vehicle name"
              value={formData.vehicle}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-2 w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandColor disabled:bg-gray-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-black text-white h-12 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Details →"}
          </button>
        </form>
      </div>
    </div>
  );
}
