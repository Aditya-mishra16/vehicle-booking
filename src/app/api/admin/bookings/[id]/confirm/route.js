import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { formatTime } from "@/utils/formatTime";
import { sendEmail } from "@/utils/email/sendEmail";
import { emailTemplate } from "@/utils/email/template";

export async function PATCH(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return Response.json({
        success: false,
        error: "Booking not found",
      });
    }

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
      await sendEmail({
        to: booking.email,
        subject: "✅ Your Booking is Confirmed",
        html: emailTemplate({
          title: `Hello ${booking.name},`,
          content: `
            <p>
              Your booking has been successfully <strong>confirmed</strong>.
            </p>

            <!-- Booking Summary -->
            <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Trip Type:</strong> ${
                booking.tripType === "roundtrip" ? "Round Trip" : "One Way"
              }</p>
              <p><strong>Vehicle:</strong> ${booking.vehicle}</p>
              <p><strong>Estimated Fare:</strong> ₹${booking.price}</p>
            </div>

            <!-- Trip Details -->
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

            <!-- Highlight -->
            <div style="margin-top:20px;padding:16px;border-radius:10px;background:#fff4f0;border-left:4px solid #ea5b2a;">
              🚗 <strong>Driver will be assigned shortly.</strong><br/>
              You will receive details via email & WhatsApp.
            </div>
          `,
        }),
      });
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to confirm booking" },
      { status: 500 },
    );
  }
}
