"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTripStore } from "@/store/tripStore";
import { ChevronLeft } from "lucide-react";
import { formatTime } from "@/utils/formatTime";

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

  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
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
    if (!acceptedTerms || loading) {
      toast.error("Please accept the terms before confirming.");
      return;
    }

    if (!pickup || !drop || !startDate) {
      toast.error("Trip details missing. Please restart booking.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Submitting booking...");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      toast.success("Booking request submitted successfully!");

      onClose();
      router.push("/booking-success");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Server error. Please try again.");
    }

    setLoading(false);
  };

  const handleClose = () => {
    setStep(1);
    setAcceptedTerms(false);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
        <button
          className="absolute top-5 right-5 text-gray-400 hover:text-black transition"
          onClick={handleClose}
        >
          ✕
        </button>

        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              <span className="text-black">Enter</span>{" "}
              <span className="text-brandColor">Your Details</span>
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name *"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brandColor focus:border-brandColor"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}

              <input
                type="email"
                placeholder="Email Address *"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brandColor focus:border-brandColor"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}

              <input
                type="tel"
                placeholder="Phone Number *"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brandColor focus:border-brandColor"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            <button
              className="mt-6 w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-brandColor transition shadow-md hover:shadow-lg"
              onClick={() => {
                if (validate()) setStep(2);
              }}
            >
              Continue →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <button
              className="flex items-center gap-2 text-sm mb-4 text-gray-600"
              onClick={() => setStep(1)}
            >
              <ChevronLeft size={16} />
              Back
            </button>

            <h2 className="text-2xl font-semibold mb-4">
              <span className="text-black">Review</span>{" "}
              <span className="text-brandColor">& Confirm</span>
            </h2>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-5">
              <p className="font-medium text-gray-900">
                {pickup} → {drop}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Vehicle:</span> {vehicle?.type}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Pickup:</span>{" "}
                {startDate
                  ? `${new Date(startDate).toDateString()} ${
                      startTime ? "• " + formatTime(startTime) : ""
                    }`
                  : "Date not available"}
              </p>

              {tripType === "roundtrip" && endDate && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Return:</span>{" "}
                  {new Date(endDate).toDateString()}{" "}
                  {endTime ? "• " + formatTime(endTime) : ""}
                </p>
              )}

              <div className="flex justify-between items-center mt-4">
                <span className="text-xs bg-brandColor/10 text-brandColor px-3 py-1 rounded-full">
                  Estimated Fare
                </span>

                <span className="text-xl font-semibold">₹{price}</span>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Final fare will be confirmed by our agent.
              </p>
            </div>

            <label className="flex gap-3 text-sm mb-6">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={() => setAcceptedTerms(!acceptedTerms)}
                className="mt-1 accent-brandColor"
              />

              <span>
                I understand that this is a <strong>booking request</strong>.
                The company will review the details and contact me to confirm
                the trip and final fare.
              </span>
            </label>

            <button
              className={`w-full py-3 rounded-xl font-semibold transition ${
                loading || !acceptedTerms
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-black text-white hover:bg-brandColor shadow-md hover:shadow-lg"
              }`}
              disabled={loading || !acceptedTerms}
              onClick={handleConfirmBooking}
            >
              {loading ? "Submitting..." : "Confirm Booking →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
