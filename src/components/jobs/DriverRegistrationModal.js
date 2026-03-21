"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";

const VEHICLE_TYPES = [
  { value: "sedan-intercity", label: "Sedan Intercity" },
  { value: "mini-intercity", label: "Mini Intercity" },
  { value: "suv-intercity", label: "SUV Intercity" },
];

// ── Zod Schema ────────────────────────────────────────────────────────────
const driverSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Full name is too long"),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),

  email: z.union([
    z.literal(""),
    z.string().email("Enter a valid email address"),
  ]),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City name is too long"),

  vehicleName: z
    .string()
    .min(2, "Vehicle name must be at least 2 characters")
    .max(60, "Vehicle name is too long"),

  vehicleType: z.enum(["sedan-intercity", "mini-intercity", "suv-intercity"], {
    errorMap: () => ({ message: "Please select a vehicle type" }),
  }),
});

export default function DriverRegistrationModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    vehicleName: "",
    vehicleType: "",
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

    // ── Zod validation ────────────────────────────────────────────────
    const result = driverSchema.safeParse(formData);

    if (!result.success) {
      const issues = result.error?.issues ?? result.error?.errors ?? [];
      const firstMessage =
        issues[0]?.message ?? "Please fill in all required fields";
      toast.error(firstMessage);
      return;
    }

    const toastId = toast.loading("Submitting...");
    try {
      setLoading(true);
      const res = await fetch("/api/driver/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data = await res.json();
      toast.dismiss(toastId);
      if (data.success) {
        toast.success("Submitted successfully!");
        onClose();
        resetForm();
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

  const formBody = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
  );

  if (isMobile) {
    return (
      <MobileBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        loading={loading}
        onSubmit={handleSubmit}
        formBody={formBody}
      />
    );
  }

  // ── DESKTOP ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div
        className={`
          fixed inset-0 z-[9998]
          bg-white/10 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />

      <DialogContent
        className="
          z-[9999]
          p-0
          max-w-[640px]
          w-[95%]
          rounded-3xl
          overflow-hidden
          bg-white
          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        "
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6 pb-5 border-b relative bg-gradient-to-b from-gray-50 to-white">
          <DialogTitle className="text-center text-xl sm:text-2xl font-semibold">
            <span className="text-brandColor">Driver</span> Registration
          </DialogTitle>
          <p className="text-center text-sm text-gray-500 mt-1">
            Start earning with CabEazy 🚗
          </p>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-6">{formBody}</div>

        <div className="px-6 py-4 border-t bg-white sticky bottom-0">
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
            {loading ? "Submitting..." : "Submit Details →"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── MOBILE BOTTOM SHEET ────────────────────────────────────────────────────
function MobileBottomSheet({ isOpen, onClose, loading, onSubmit, formBody }) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setDragY(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const onTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) setDragY(delta);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 120) onClose();
    else setDragY(0);
    startY.current = null;
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: isOpen ? `translateY(${dragY}px)` : "translateY(100%)",
          transition: isDragging
            ? "none"
            : "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        className="
          fixed bottom-0 left-0 right-0 z-[9999]
          bg-white rounded-t-3xl
          shadow-[0_-8px_40px_rgba(0,0,0,0.15)]
          flex flex-col max-h-[92dvh]
        "
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>
        <div className="px-5 pt-2 pb-4 border-b bg-gradient-to-b from-gray-50 to-white flex-shrink-0">
          <h2 className="text-center text-xl font-semibold">
            <span className="text-brandColor">Driver</span> Registration
          </h2>
          <p className="text-center text-sm text-gray-500 mt-1">
            Start earning with CabEazy 🚗
          </p>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-5">{formBody}</div>
        <div
          className="px-5 py-4 border-t bg-white flex-shrink-0"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <button
            onClick={onSubmit}
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
            {loading ? "Submitting..." : "Submit Details →"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── FLOATING INPUT ────────────────────────────────────────────────────────
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
      <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500 z-10 group-focus-within:text-brandColor transition">
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

// ── FLOATING SELECT ───────────────────────────────────────────────────────
function FloatingSelect({ label, name, required, value, onChange, options }) {
  return (
    <div className="relative group">
      <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500 z-10 group-focus-within:text-brandColor transition">
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
