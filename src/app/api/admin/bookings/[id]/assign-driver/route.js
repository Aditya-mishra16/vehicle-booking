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
    const body = await req.json();

    // ✅ FETCH BOOKING
    const booking = await Booking.findById(id);

    if (!booking) {
      return Response.json({
        success: false,
        error: "Booking not found",
      });
    }

    // ✅ ALLOW REASSIGN (NO RESTRICTION)
    booking.driver = body.driverId;
    booking.driverAssigned = true;
    booking.status = "assigned"; // ✅ optional but recommended

    await booking.save();
    await booking.populate("driver");

    const driver = booking.driver;

    /* ---------- DATE & TIME ---------- */

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

    const tripTypeLabel =
      booking.tripType === "roundtrip" ? "Round Trip" : "One Way";

    /* ---------- DRIVER EMAIL ---------- */

    if (driver?.email) {
      await sendEmail({
        to: driver.email,
        subject: "🚗 Ride Assignment Update",
        html: emailTemplate({
          title: `Hello ${driver.fullName},`,
          content: `
            <p>A ride has been assigned to you.</p>

            <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Trip Type:</strong> ${tripTypeLabel}</p>
              <p><strong>Vehicle:</strong> ${booking.vehicle}</p>
              <p><strong>Estimated Fare:</strong> ₹${booking.price}</p>
            </div>

            <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
              <h3>Trip Details</h3>

              <p><strong>${booking.pickup} → ${booking.drop}</strong></p>
              <p><strong>Pickup:</strong> ${pickupDate} | ${pickupTime}</p>

              ${
                booking.tripType === "roundtrip"
                  ? `<p><strong>Return:</strong> ${returnDate} | ${returnTime}</p>`
                  : ""
              }
            </div>

            <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
              <h3>Customer Details</h3>

              <p><strong>${booking.name}</strong></p>
              <p>${booking.phone}</p>

              <a href="tel:${booking.phone}"
                style="display:inline-block;background:#ea5b2a;color:#fff;padding:10px 18px;border-radius:6px;margin-top:10px;text-decoration:none;">
                📞 Call Customer
              </a>
            </div>
          `,
        }),
      });
    }

    /* ---------- CUSTOMER EMAIL ---------- */

    if (booking.email) {
      await sendEmail({
        to: booking.email,
        subject: "🚗 Driver Assignment Updated",
        html: emailTemplate({
          title: `Hello ${booking.name},`,
          content: `
            <p>Your driver has been assigned/updated for your trip.</p>

            <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Trip Type:</strong> ${tripTypeLabel}</p>
              <p><strong>Vehicle:</strong> ${booking.vehicle}</p>
              <p><strong>Estimated Fare:</strong> ₹${booking.price}</p>
            </div>

            <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
              <h3>Driver Details</h3>

              <p><strong>${driver.fullName}</strong></p>
              <p>${driver.phone}</p>

              <a href="tel:${driver.phone}"
                style="display:inline-block;background:#ea5b2a;color:#fff;padding:10px 18px;border-radius:6px;margin-top:10px;text-decoration:none;">
                📞 Call Driver
              </a>
            </div>

            <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
              <h3>Trip Details</h3>

              <p><strong>${booking.pickup} → ${booking.drop}</strong></p>
              <p><strong>Pickup:</strong> ${pickupDate} | ${pickupTime}</p>

              ${
                booking.tripType === "roundtrip"
                  ? `<p><strong>Return:</strong> ${returnDate} | ${returnTime}</p>`
                  : ""
              }
            </div>
          `,
        }),
      });
    }

    return Response.json({
      success: true,
      booking,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to assign driver" },
      { status: 500 },
    );
  }
}
