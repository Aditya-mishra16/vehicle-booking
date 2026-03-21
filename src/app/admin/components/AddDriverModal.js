"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";

import { useState } from "react";
import { toast } from "sonner";

const VEHICLE_TYPES = [
  { value: "sedan-intercity", label: "Sedan Intercity" },
  { value: "mini-intercity", label: "Mini Intercity" },
  { value: "suv-intercity", label: "SUV Intercity" },
];

export default function AddDriverModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    vehicleName: "",
    vehicleType: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () =>
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      city: "",
      vehicleName: "",
      vehicleType: "",
    });

  const handleSubmit = async () => {
    if (loading) return;
    const toastId = toast.loading("Adding driver...");
    try {
      setLoading(true);
      const res = await fetch("/api/admin/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      toast.dismiss(toastId);
      if (data.success) {
        toast.success("Driver added successfully");
        onClose();
        resetForm();
        onSuccess?.();
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.dismiss(toastId);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/30 backdrop-blur-md" />

      <DialogContent
        className="
          z-[9999]
          p-0
          max-w-[580px]
          w-[95%]
          rounded-3xl
          overflow-hidden
          bg-white
          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        "
      >
        {/* HEADER */}
        <DialogHeader className="px-6 pt-6 pb-5 border-b bg-gradient-to-b from-gray-50 to-white">
          <DialogTitle className="text-center text-xl font-semibold">
            Add Driver
          </DialogTitle>
          <p className="text-center text-sm text-gray-500 mt-1">
            Add a new driver to CabEazy 🚗
          </p>
        </DialogHeader>

        {/* BODY */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FloatingInput
              label="Full Name"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
            <FloatingInput
              label="Phone Number"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
            />
            <FloatingInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FloatingInput
              label="City"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
            />
            <FloatingInput
              label="Vehicle Name"
              name="vehicleName"
              required
              value={formData.vehicleName}
              onChange={handleChange}
            />
            <FloatingSelect
              label="Vehicle Type"
              name="vehicleType"
              required
              value={formData.vehicleType}
              onChange={handleChange}
              options={VEHICLE_TYPES}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t bg-white">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              w-full h-12 rounded-xl
              bg-black text-white font-medium
              hover:bg-gray-900
              active:scale-[0.97]
              transition-all duration-150
              disabled:opacity-50
              shadow-md
            "
          >
            {loading ? "Adding..." : "Add Driver →"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── FLOATING INPUT ──────────────────────────────────────────────────────── */
function FloatingInput({
  label,
  name,
  type = "text",
  required,
  value,
  onChange,
}) {
  return (
    <div className="relative group">
      <span
        className="
          absolute -top-2 left-4
          bg-white px-1 text-xs text-gray-500 z-10
          group-focus-within:text-brandColor transition
        "
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=""
        className="
          w-full h-14 px-4
          rounded-xl border border-gray-300
          bg-white
          focus:outline-none
          focus:ring-2 focus:ring-brandColor/40
          focus:border-brandColor
          hover:border-gray-400
          transition-all duration-150
        "
      />
    </div>
  );
}

/* ── FLOATING SELECT ─────────────────────────────────────────────────────── */
function FloatingSelect({ label, name, required, value, onChange, options }) {
  return (
    <div className="relative group">
      <span
        className="
          absolute -top-2 left-4
          bg-white px-1 text-xs text-gray-500 z-10
          group-focus-within:text-brandColor transition
        "
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full h-14 px-4
          rounded-xl border border-gray-300
          bg-white appearance-none
          text-gray-800
          focus:outline-none
          focus:ring-2 focus:ring-brandColor/40
          focus:border-brandColor
          hover:border-gray-400
          transition-all duration-150
          cursor-pointer
        "
      >
        <option value="" disabled hidden />
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
