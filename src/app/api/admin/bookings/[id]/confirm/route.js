"use server";

import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { formatTime } from "@/utils/formatTime";
import { sendEmail } from "@/utils/email/sendEmail";
import { emailTemplate } from "@/utils/email/template";

export async function PATCH(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {}; // no body sent (confirm case)
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return Response.json({
        success: false,
        error: "Booking not found",
      });
    }

    // ✅ SAME FLOW (just dynamic status support)
    const newStatus = body?.status || "confirmed";
    booking.status = newStatus;
    await booking.save();

    /* ---------- FORMAT DATE/TIME ---------- */

    const pickupDate = booking.startDate
      ? new Date(booking.startDate).toDateString()
      : "Not specified";

    const pickupTime = booking.startTime
      ? formatTime(booking.startTime)
      : "Not specified";

    const returnDate =
      booking.tripType === "roundtrip" && booking.endDate
        ? new Date(booking.endDate).toDateString()
        : null;

    const returnTime =
      booking.tripType === "roundtrip"
        ? booking.endTime
          ? formatTime(booking.endTime)
          : "-"
        : null;

    /* ---------- SEND EMAIL ---------- */

    if (booking.email) {
      // ✅ CONFIRM EMAIL (EXISTING - UNTOUCHED)
      if (newStatus === "confirmed") {
        await sendEmail({
          to: booking.email,
          subject: "✅ Your Booking is Confirmed",
          html: emailTemplate({
            title: `Hello ${booking.name},`,
            content: `
              <p>
                Your booking status has been updated to <strong>confirmed</strong>.
              </p>

              <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
                <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                <p><strong>Trip Type:</strong> ${
                  booking.tripType === "roundtrip" ? "Round Trip" : "One Way"
                }</p>
                <p><strong>Vehicle:</strong> ${booking.vehicle}</p>
                <p><strong>Estimated Fare:</strong> ₹${booking.price}</p>
              </div>

              <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
                <h3 style="margin-bottom:10px;">Trip Details</h3>

                <p><strong>${booking.pickup} → ${booking.drop}</strong></p>

                <p><strong>Pickup:</strong> ${pickupDate} | ${pickupTime}</p>

                ${
                  booking.tripType === "roundtrip"
                    ? `
                      <p><strong>Return:</strong> ${returnDate} | ${returnTime}</p>
                    `
                    : ""
                }
              </div>

              <div style="margin-top:20px;padding:16px;border-radius:10px;background:#fff4f0;border-left:4px solid #ea5b2a;">
                🚗 <strong>Driver will be assigned shortly.</strong><br/>
                You will receive updates via email & WhatsApp.
              </div>
            `,
          }),
        });
      }

      // ✅ NEW: CANCEL EMAIL (same UI style)
      if (newStatus === "cancelled") {
        await sendEmail({
          to: booking.email,
          subject: "❌ Your Booking has been Cancelled",
          html: emailTemplate({
            title: `Hello ${booking.name},`,
            content: `
              <p>
                Your booking has been <strong>cancelled</strong>.
              </p>

              <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
                <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                <p><strong>Trip Type:</strong> ${
                  booking.tripType === "roundtrip" ? "Round Trip" : "One Way"
                }</p>
                <p><strong>Vehicle:</strong> ${booking.vehicle}</p>
              </div>

              <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
                <h3 style="margin-bottom:10px;">Trip Details</h3>

                <p><strong>${booking.pickup} → ${booking.drop}</strong></p>

                <p><strong>Pickup:</strong> ${pickupDate} | ${pickupTime}</p>

                ${
                  booking.tripType === "roundtrip"
                    ? `
                      <p><strong>Return:</strong> ${returnDate} | ${returnTime}</p>
                    `
                    : ""
                }
              </div>

              <div style="margin-top:20px;padding:16px;border-radius:10px;background:#fff4f0;border-left:4px solid #ea5b2a;">
                ❌ <strong>Your ride has been cancelled.</strong><br/>
                If this was unexpected, please contact support.
              </div>
            `,
          }),
        });
      }
    }

    return Response.json({
      success: true,
      booking,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to update booking status" },
      { status: 500 },
    );
  }
}
