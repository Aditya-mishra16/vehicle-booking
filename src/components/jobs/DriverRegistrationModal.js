"use client";

import { useState } from "react";

export default function DriverRegistrationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    vehicle: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Driver Registration:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-[95%] sm:w-[600px] md:w-[650px] rounded-2xl shadow-2xl p-8 md:p-10 z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold">
            <span className="text-brandColor">Registration</span> Form
          </h2>
          <p className="text-gray-500 mt-3 text-sm md:text-base">
            Fill in your details to register as a driver at Company Name
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
              className="mt-2 w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandColor"
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
              className="mt-2 w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandColor"
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
              className="mt-2 w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandColor"
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
              className="mt-2 w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandColor"
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
              className="mt-2 w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandColor"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 bg-black text-white h-12 rounded-lg hover:bg-gray-900 transition"
          >
            Submit Details →
          </button>
        </form>
      </div>
    </div>
  );
}
