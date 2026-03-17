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
            • Pickup Date:{" "}
            <span className="font-medium">{formattedPickupDate}</span>
          </div>

          <div>
            • Pickup Time:{" "}
            <span className="font-medium">{formattedPickupTime || "-"}</span>
          </div>

          {booking.tripType === "roundtrip" && formattedReturnDate && (
            <>
              <div>
                • Return Date:{" "}
                <span className="font-medium">{formattedReturnDate}</span>
              </div>

              <div>
                • Return Time:{" "}
                <span className="font-medium">
                  {formattedReturnTime || "-"}
                </span>
              </div>
            </>
          )}

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

      {/* WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="
        mt-10
        bg-black
        text-white
        px-8
        py-3
        rounded-xl
        transition-colors
        duration-300
        hover:bg-brandColor
        cursor-pointer
      "
      >
        Chat on WhatsApp →
      </a>

      {/* Call Button */}
      <a
        href={PHONE_NUMBER ? `tel:${PHONE_NUMBER}` : "#"}
        className="mt-4 border px-8 py-3 rounded-xl hover:bg-gray-100 transition cursor-pointer"
      >
        Call us on {PHONE_NUMBER}
      </a>
    </div>
  );
}
