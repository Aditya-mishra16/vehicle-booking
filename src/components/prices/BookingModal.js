"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTripStore } from "@/store/tripStore";

export default function BookingModal({ open, onClose, vehicle, price, trip }) {
  const router = useRouter();
  const setBooking = useTripStore((state) => state.setBooking);

  const pickup = trip?.pickup;
  const drop = trip?.drop;
  const startDate = trip?.startDate;
  const startTime = trip?.startTime;
  const endDate = trip?.endDate;
  const endTime = trip?.endTime;
  const tripType = trip?.tripType;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* Lock page scroll when modal opens */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10 digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmBooking = async () => {
    if (!validate()) return;

    if (!pickup || !drop || !startDate) {
      toast.error("Trip details missing. Please restart booking.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Submitting booking...");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          vehicle: vehicle?.type,
          price,
          pickup,
          drop,
          startDate,
          startTime,
          endDate,
          endTime,
          tripType,
        }),
      });

      const data = await response.json();

      toast.dismiss(loadingToast);

      if (!response.ok) {
        toast.error(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setBooking({
        ...form,
        vehicle: vehicle?.type,
        price,
        pickup,
        drop,
        startDate,
        startTime,
        endDate,
        endTime,
        tripType,
        bookingId: data.bookingId,
      });

      toast.success("Booking request submitted!");

      onClose();
      router.push("/booking-success");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Server error. Please try again.");
    }

    setLoading(false);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!loading ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
        {/* Close */}
        <button
          className="absolute top-5 right-5 text-gray-400 hover:text-black"
          onClick={handleClose}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-3xl font-semibold text-center mb-2">
          <span className="text-brandColor">Book</span> Your Ride
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your details to confirm booking
        </p>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name *"
            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brandColor"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

          <input
            type="email"
            placeholder="Email Address *"
            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brandColor"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}

          <input
            type="tel"
            placeholder="Phone Number *"
            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brandColor"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone}</p>
          )}
        </div>

        {/* Confirm Button */}
        <button
          className={`mt-6 w-full py-3 rounded-xl font-semibold transition ${
            loading
              ? "bg-gray-400 text-white"
              : "bg-black text-white hover:bg-brandColor"
          }`}
          onClick={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Confirm Booking →"}
        </button>
      </div>
    </div>
  );
}
