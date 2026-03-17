import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { formatTime } from "@/utils/formatTime";

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

    // Generate booking ID
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

    // Connect to MongoDB
    await connectDB();

    // Save booking
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

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    // ================= ADMIN EMAIL =================

    await transporter.sendMail({
      from: `"CabEazy Booking" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      replyTo: email,
      subject: `🚗 New Booking | ${vehicleName}`,
      html: `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:30px;">
  <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

    <div style="background:#ea5b2a;color:#fff;padding:18px 24px">
      <h2 style="margin:0">🚗 New Booking Request</h2>
    </div>

    <div style="padding:28px">

      <div style="background:#f6f7f9;border-radius:10px;padding:16px;margin-bottom:20px">
        <strong>Booking ID:</strong> ${bookingId}
      </div>

      <table width="100%" style="font-size:14px;border-collapse:collapse">
        <tr>
          <td style="padding:8px 0;color:#666"><strong>Name</strong></td>
          <td style="padding:8px 0">${name}</td>
        </tr>

        <tr>
          <td style="padding:8px 0;color:#666"><strong>Email</strong></td>
          <td style="padding:8px 0">${email}</td>
        </tr>

        <tr>
          <td style="padding:8px 0;color:#666"><strong>Phone</strong></td>
          <td style="padding:8px 0">${phone}</td>
        </tr>
      </table>

      <hr style="margin:25px 0;border:none;border-top:1px solid #eee"/>

      <table width="100%" style="font-size:14px;border-collapse:collapse">

        <tr>
          <td style="padding:8px 0;color:#666"><strong>Pickup</strong></td>
          <td style="padding:8px 0">${pickup}</td>
        </tr>

        <tr>
          <td style="padding:8px 0;color:#666"><strong>Drop</strong></td>
          <td style="padding:8px 0">${drop}</td>
        </tr>

        <tr>
          <td style="padding:8px 0;color:#666"><strong>Pickup Date</strong></td>
          <td style="padding:8px 0">${formattedDate}</td>
        </tr>

        <tr>
          <td style="padding:8px 0;color:#666"><strong>Pickup Time</strong></td>
          <td style="padding:8px 0">${formattedTime}</td>
        </tr>

        ${
          tripType === "roundtrip"
            ? `
        <tr>
          <td style="padding:8px 0;color:#666"><strong>Return Date</strong></td>
          <td style="padding:8px 0">${formattedReturnDate}</td>
        </tr>

        <tr>
          <td style="padding:8px 0;color:#666"><strong>Return Time</strong></td>
          <td style="padding:8px 0">${formattedReturnTime}</td>
        </tr>
        `
            : ""
        }

        <tr>
          <td style="padding:8px 0;color:#666"><strong>Vehicle</strong></td>
          <td style="padding:8px 0">${vehicleName}</td>
        </tr>

        <tr>
          <td style="padding:8px 0;color:#666"><strong>Estimated Fare</strong></td>
          <td style="padding:8px 0;font-weight:bold">₹${price}</td>
        </tr>

      </table>

    </div>
  </div>
</div>
`,
    });

    // ================= CUSTOMER EMAIL =================

    await transporter.sendMail({
      from: `"CabEazy Travel" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your booking request is received 🚗",
      html: `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:30px;">
  <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

    <div style="background:#111827;color:#fff;padding:20px 24px">
      <h2 style="margin:0">CabEazy Travel</h2>
    </div>

    <div style="padding:28px">

      <h3 style="margin-top:0">Hi ${name},</h3>

      <p style="line-height:1.6;color:#444">
        Your booking request has been received successfully.  
        Our team will contact you shortly to confirm your ride.
      </p>

      <div style="background:#f6f7f9;border-radius:10px;padding:16px;margin-top:20px">

        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Pickup:</strong> ${pickup}</p>
        <p><strong>Drop:</strong> ${drop}</p>
        <p><strong>Pickup Date:</strong> ${formattedDate}</p>
        <p><strong>Pickup Time:</strong> ${formattedTime}</p>

        ${
          tripType === "roundtrip"
            ? `<p><strong>Return Date:</strong> ${formattedReturnDate}</p>
               <p><strong>Return Time:</strong> ${formattedReturnTime}</p>`
            : ""
        }

        <p><strong>Vehicle:</strong> ${vehicleName}</p>

        <p style="margin-top:10px;font-size:16px;font-weight:bold">
          Estimated Fare: ₹${price}
        </p>

      </div>

      <p style="margin-top:22px;font-size:13px;color:#666">
        Final fare will be confirmed by our team before the trip.
      </p>

      <hr style="margin:30px 0;border:none;border-top:1px solid #eee"/>

      <p style="font-size:12px;color:#999;text-align:center">
        CabEazy Travel • Safe & Reliable Outstation Cab Service
      </p>

    </div>
  </div>
</div>
`,
    });

    return Response.json({
      success: true,
      bookingId,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
