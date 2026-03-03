"use client";

import { useTripStore } from "@/store/tripStore";
import { useRouter } from "next/navigation";

export default function BookingSuccessPage() {
  const router = useRouter();
  const booking = useTripStore((state) => state.booking);

  if (!booking) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      {/* Check Icon */}
      <div className="w-20 h-20 rounded-full bg-brandColor text-white flex items-center justify-center text-3xl mb-6">
        ✓
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Your Booking Has Been{" "}
        <span className="text-brandColor">Successfully Received!</span>
      </h1>

      <p className="text-gray-600 mt-4 max-w-2xl">
        Our team has received your booking and will contact you shortly to
        confirm the details and finalize your ride.
      </p>

      {/* Summary Card */}
      <div className="mt-12 border rounded-2xl p-8 max-w-3xl w-full text-left">
        <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>

        <div className="grid md:grid-cols-2 gap-6 text-gray-700">
          <div>
            • Pickup: <span className="font-medium">{booking.pickup}</span>
          </div>

          <div>
            • Drop: <span className="font-medium">{booking.drop}</span>
          </div>

          <div>
            • Date:{" "}
            <span className="font-medium">
              {new Date(booking.startDate).toDateString()}
            </span>
          </div>

          <div>
            • Vehicle: <span className="font-medium">{booking.vehicle}</span>
          </div>

          <div>
            • Estimated Fare:{" "}
            <span className="font-medium">₹{booking.price}</span>
          </div>

          <div>
            • Booking ID:{" "}
            <span className="font-medium">{booking.bookingId}</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <button className="mt-10 bg-black text-white px-8 py-3 rounded-xl hover:bg-neutral-800">
        Chat on Whatsapp →
      </button>

      <button className="mt-4 border px-8 py-3 rounded-xl">
        Call us on +91 92929393929
      </button>
    </div>
  );
}
