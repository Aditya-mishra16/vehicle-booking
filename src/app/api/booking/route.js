import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { formatTime } from "@/utils/formatTime";
import { sendEmail } from "@/utils/email/sendEmail";
import { emailTemplate } from "@/utils/email/template";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      vehicle,
      price,
      pickup,
      drop,
      startDate,
      startTime,
      endDate,
      endTime,
      tripType,
    } = body;

    const vehicleName = typeof vehicle === "string" ? vehicle : vehicle?.type;

    if (
      !name ||
      !email ||
      !phone ||
      !vehicleName ||
      !price ||
      !pickup ||
      !drop
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const bookingId = `CAB-${Math.floor(100000 + Math.random() * 900000)}`;

    const formattedDate = startDate
      ? new Date(startDate).toDateString()
      : "Not specified";

    const formattedTime = startTime ? formatTime(startTime) : "Not specified";

    const formattedReturnDate =
      tripType === "roundtrip" && endDate
        ? new Date(endDate).toDateString()
        : null;

    const formattedReturnTime =
      tripType === "roundtrip" ? (endTime ? formatTime(endTime) : "-") : null;

    const tripTypeLabel = tripType === "roundtrip" ? "Round Trip" : "One Way";

    await connectDB();

    await Booking.create({
      bookingId,
      name,
      email,
      phone,
      pickup,
      drop,
      startDate,
      startTime,
      endDate: tripType === "roundtrip" ? endDate : null,
      endTime: tripType === "roundtrip" ? endTime : null,
      tripType,
      vehicle: vehicleName,
      price,
    });

    // ================= ADMIN EMAIL =================

    await sendEmail({
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: `🚗 New Booking | ${vehicleName}`,
      replyTo: email,
      html: emailTemplate({
        title: "New Booking Request",
        content: `
          <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-bottom:20px">
            <h3 style="margin:0 0 8px;font-size:14px;color:#888;">Booking Details</h3>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
          </div>

          <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-bottom:15px">
            <h3 style="margin:0 0 8px;font-size:14px;color:#888;">Customer Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
          </div>

          <div style="background:#f6f7f9;padding:16px;border-radius:10px">
            <h3 style="margin:0 0 8px;font-size:14px;color:#888;">Trip Details</h3>

            <p><strong>Pickup:</strong> ${pickup}</p>
            <p><strong>Drop:</strong> ${drop}</p>

            <p><strong>Pickup:</strong> ${formattedDate} | ${formattedTime}</p>

            ${
              tripType === "roundtrip"
                ? `<p><strong>Return:</strong> ${formattedReturnDate} | ${formattedReturnTime}</p>`
                : ""
            }

            <p><strong>Trip Type:</strong> ${tripTypeLabel}</p>
            <p><strong>Vehicle:</strong> ${vehicleName}</p>
            <p><strong>Fare:</strong> ₹${price}</p>
          </div>
        `,
      }),
    });

    // ================= CUSTOMER EMAIL =================

    await sendEmail({
      to: email,
      subject: "Your booking request is received 🚗",
      html: emailTemplate({
        title: `Hi ${name},`,
        content: `
          <p>
            Your booking request has been received successfully.
            Our team will contact you shortly to confirm your ride.
          </p>

          <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
            <h3 style="margin:0 0 8px;font-size:14px;color:#888;">Booking Summary</h3>

            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>${pickup} → ${drop}</strong></p>

            <p><strong>Pickup:</strong> ${formattedDate} | ${formattedTime}</p>

            ${
              tripType === "roundtrip"
                ? `<p><strong>Return:</strong> ${formattedReturnDate} | ${formattedReturnTime}</p>`
                : ""
            }

            <p><strong>Trip Type:</strong> ${tripTypeLabel}</p>
            <p><strong>Vehicle:</strong> ${vehicleName}</p>

            <p style="margin-top:10px;font-size:15px;font-weight:600;">
              Estimated Fare: ₹${price}
            </p>
          </div>

          <p style="margin-top:18px;color:#666;font-size:13px;">
            Final fare will be confirmed by our team before the trip.
          </p>
        `,
      }),
    });

    return Response.json({
      success: true,
      bookingId,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
