"use client";

import { useState } from "react";

export default function BookingModal({
  open,
  onClose,
  onSubmit,
  vehicle,
  price,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  if (!open) return null;

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative animate-fadeIn">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2">
          <span className="text-brandColor">Enter</span> Your Details
        </h2>

        {/* Estimated Price Info */}
        <p className="text-sm text-gray-500 mb-6">
          Booking for <span className="font-medium">{vehicle?.type}</span> —
          <span className="font-semibold"> ₹{price}</span>
          <br />
          <span className="text-xs text-gray-400">
            *This is an estimated fare. Final amount will be confirmed after our
            agent contacts you.
          </span>
        </p>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name *"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brandColor"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email Address *"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brandColor"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="tel"
              placeholder="Phone Number *"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brandColor"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="mt-6 w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition"
          onClick={handleSubmit}
        >
          Submit →
        </button>
      </div>
    </div>
  );
}
