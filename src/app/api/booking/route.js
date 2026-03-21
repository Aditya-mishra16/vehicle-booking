import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { formatTime } from "@/utils/formatTime";
import { sendEmail } from "@/utils/email/sendEmail";
import { emailTemplate } from "@/utils/email/template";

export async function POST(req) {
  try {
    const body = await req.json();

    let {
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

    // ✅ Normalize
    name = name?.trim();
    email = email?.toLowerCase().trim();
    pickup = pickup?.trim();
    drop = drop?.trim();

    const vehicleName = typeof vehicle === "string" ? vehicle : vehicle?.type;

    // ✅ Validate required
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

    // ✅ Validate trip type
    if (!["oneway", "roundtrip"].includes(tripType)) {
      return Response.json({ error: "Invalid trip type" }, { status: 400 });
    }

    const bookingId = `CabEazy-${Date.now().toString().slice(-6)}`;

    // ✅ Format helpers
    const formattedDate = startDate
      ? new Date(startDate).toDateString()
      : "Not specified";

    const formattedTime = startTime ? formatTime(startTime) : "Not specified";

    const isRoundTrip = tripType === "roundtrip";

    const formattedReturnDate =
      isRoundTrip && endDate ? new Date(endDate).toDateString() : null;

    const formattedReturnTime = isRoundTrip
      ? endTime
        ? formatTime(endTime)
        : "-"
      : null;

    const tripTypeLabel = isRoundTrip ? "Round Trip" : "One Way";

    await connectDB();

    // ✅ Create booking
    try {
      await Booking.create({
        bookingId,
        name,
        email,
        phone,
        pickup,
        drop,
        startDate,
        startTime,
        endDate: isRoundTrip ? endDate : null,
        endTime: isRoundTrip ? endTime : null,
        tripType,
        vehicle: vehicleName,
        price,
        status: "pending",
        driverAssigned: false,
      });
    } catch (dbError) {
      console.error("DB Error:", dbError);
      return Response.json(
        { error: "Failed to create booking" },
        { status: 500 },
      );
    }

    // ================= ADMIN EMAIL =================
    try {
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
                isRoundTrip
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
    } catch (err) {
      console.error("Admin email failed:", err);
    }

    // ================= CUSTOMER EMAIL =================
    try {
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
                isRoundTrip
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
    } catch (err) {
      console.error("Customer email failed:", err);
    }

    return Response.json({
      success: true,
      bookingId,
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
