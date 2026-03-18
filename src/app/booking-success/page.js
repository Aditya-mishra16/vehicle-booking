"use client";

import { useTripStore } from "@/store/tripStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { formatTime } from "@/utils/formatTime";

export default function BookingSuccessPage() {
  const router = useRouter();
  const booking = useTripStore((state) => state.booking);

  const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  useEffect(() => {
    if (!booking) {
      router.push("/");
    }
  }, [booking, router]);

  if (!booking) return null;

  const formattedPickupDate = booking.startDate
    ? new Date(booking.startDate).toDateString()
    : "";

  const formattedReturnDate =
    booking.tripType === "roundtrip" && booking.endDate
      ? new Date(booking.endDate).toDateString()
      : null;

  const formattedPickupTime = formatTime(booking.startTime);
  const formattedReturnTime = formatTime(booking.endTime);

  const whatsappMessage = `
Hi, I have successfully submitted my booking request.

Booking ID: ${booking.bookingId}
Pickup: ${booking.pickup}
Drop: ${booking.drop}

Pickup Date: ${formattedPickupDate}
Pickup Time: ${formattedPickupTime || "-"}

${
  booking.tripType === "roundtrip"
    ? `Return Date: ${formattedReturnDate}
Return Time: ${formattedReturnTime || "-"}`
    : ""
}

Vehicle: ${booking.vehicle}
Estimated Fare: ₹${booking.price}

Please assist me further.
`;

  const whatsappLink = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        whatsappMessage,
      )}`
    : "#";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 pt-12 pb-16 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-brandColor text-white flex items-center justify-center text-3xl shadow-lg mb-6">
        ✓
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold max-w-xl leading-tight">
        Your Booking Has Been{" "}
        <span className="text-brandColor">Successfully Received!</span>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 mt-4 max-w-xl text-sm sm:text-base leading-relaxed">
        Our team has received your booking request and will contact you shortly
        to confirm the trip and finalize your ride details.
      </p>

      {/* Trip Details Card */}
      <div className="mt-10 w-full max-w-2xl bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 text-left shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-6">Trip Details</h2>

        <div className="space-y-5 text-sm sm:text-base">
          {/* Booking ID Row */}
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-500">Booking ID</span>
            <span className="font-semibold tracking-wide text-brandColor">
              {booking.bookingId}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Pickup</span>
            <span className="font-medium">{booking.pickup}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Drop</span>
            <span className="font-medium">{booking.drop}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Pickup Date</span>
            <span className="font-medium">{formattedPickupDate}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Pickup Time</span>
            <span className="font-medium">{formattedPickupTime || "-"}</span>
          </div>

          {booking.tripType === "roundtrip" && formattedReturnDate && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">Return Date</span>
                <span className="font-medium">{formattedReturnDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Return Time</span>
                <span className="font-medium">
                  {formattedReturnTime || "-"}
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between">
            <span className="text-gray-500">Vehicle</span>
            <span className="font-medium">{booking.vehicle}</span>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <span className="text-gray-500">Estimated Fare</span>
            <span className="font-semibold">₹{booking.price}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 w-full max-w-md flex flex-col gap-4">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-black text-white py-3 rounded-xl font-medium transition hover:bg-brandColor"
        >
          Chat on WhatsApp →
        </a>

        <a
          href={PHONE_NUMBER ? `tel:${PHONE_NUMBER}` : "#"}
          className="w-full border py-3 rounded-xl hover:bg-gray-100 transition"
        >
          Call us on {PHONE_NUMBER}
        </a>
      </div>
    </div>
  );
}
