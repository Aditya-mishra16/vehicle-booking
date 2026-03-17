import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import nodemailer from "nodemailer";
import { formatTime } from "@/utils/formatTime";

export async function PATCH(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    const booking = await Booking.findByIdAndUpdate(
      id,
      { driver: body.driverId },
      { returnDocument: "after" },
    ).populate("driver");

    if (!booking) {
      return Response.json({
        success: false,
        error: "Booking not found",
      });
    }

    const driver = booking.driver;

    /* ---------- DATE & TIME ---------- */

    const formattedPickupDate = booking.startDate
      ? new Date(booking.startDate).toDateString()
      : "Not specified";

    const formattedPickupTime = booking.startTime
      ? formatTime(booking.startTime)
      : "Not specified";

    const formattedReturnDate =
      booking.tripType === "roundtrip" && booking.endDate
        ? new Date(booking.endDate).toDateString()
        : null;

    const formattedReturnTime =
      booking.tripType === "roundtrip"
        ? booking.endTime
          ? formatTime(booking.endTime)
          : "-"
        : null;

    /* ---------- EMAIL TRANSPORTER ---------- */

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    /* ---------- SEND DRIVER EMAIL ---------- */

    if (driver?.email) {
      await transporter.sendMail({
        from: `"CabEazy Travel" <${process.env.EMAIL_USER}>`,
        to: driver.email,
        subject: "🚗 New Ride Assigned",
        html: `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:30px;">
<div style="max-width:640px;margin:auto;background:#ffffff;border-radius:14px;padding:28px;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

<h2>Hello ${driver.fullName},</h2>
<p>A new ride has been assigned to you.</p>

<div style="background:#f6f7f9;border-radius:10px;padding:16px;margin-top:15px">
<p><strong>Booking ID:</strong> ${booking.bookingId}</p>
<p><strong>Trip Type:</strong> ${
          booking.tripType === "roundtrip" ? "Round Trip" : "One Way"
        }</p>
<p><strong>Vehicle:</strong> ${booking.vehicle}</p>
<p><strong>Estimated Fare:</strong> ₹${booking.price}</p>
</div>

<div style="background:#f6f7f9;border-radius:10px;padding:16px;margin-top:15px">

<h3>Trip Details</h3>

<p><strong>Pickup:</strong> ${booking.pickup}</p>
<p><strong>Drop:</strong> ${booking.drop}</p>

<p><strong>Pickup Date:</strong> ${formattedPickupDate}</p>
<p><strong>Pickup Time:</strong> ${formattedPickupTime}</p>

${
  booking.tripType === "roundtrip"
    ? `
<p><strong>Return Date:</strong> ${formattedReturnDate}</p>
<p><strong>Return Time:</strong> ${formattedReturnTime}</p>
`
    : ""
}

</div>

<div style="background:#f6f7f9;border-radius:10px;padding:16px;margin-top:15px">

<h3>Customer Details</h3>

<p><strong>Name:</strong> ${booking.name}</p>
<p><strong>Phone:</strong> ${booking.phone}</p>

<a href="tel:${booking.phone}"
style="display:inline-block;background:#ea5b2a;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:10px">
📞 Call Customer
</a>

</div>

<hr style="margin:25px 0"/>

<p style="font-size:12px;color:#777;text-align:center">
CabEazy Travel • Driver Assignment Notification
</p>

</div>
</div>
`,
      });
    }

    /* ---------- SEND CUSTOMER EMAIL ---------- */

    if (booking.email) {
      await transporter.sendMail({
        from: `"CabEazy Travel" <${process.env.EMAIL_USER}>`,
        to: booking.email,
        subject: "🚗 Your Driver Has Been Assigned",
        html: `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:30px;">
<div style="max-width:640px;margin:auto;background:#ffffff;border-radius:14px;padding:28px;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

<h2>Hello ${booking.name},</h2>

<p>Your driver has been assigned for your upcoming trip.</p>

<div style="background:#f6f7f9;border-radius:10px;padding:16px;margin-top:15px">
<p><strong>Booking ID:</strong> ${booking.bookingId}</p>
<p><strong>Vehicle:</strong> ${booking.vehicle}</p>
<p><strong>Estimated Fare:</strong> ₹${booking.price}</p>
</div>

<div style="background:#f6f7f9;border-radius:10px;padding:16px;margin-top:15px">

<h3>Driver Details</h3>

<p><strong>Name:</strong> ${driver.fullName}</p>
<p><strong>Phone:</strong> ${driver.phone}</p>

<a href="tel:${driver.phone}"
style="display:inline-block;background:#ea5b2a;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:10px">
📞 Call Driver
</a>

</div>

<div style="background:#f6f7f9;border-radius:10px;padding:16px;margin-top:15px">

<h3>Trip Details</h3>

<p><strong>Pickup:</strong> ${booking.pickup}</p>
<p><strong>Drop:</strong> ${booking.drop}</p>

<p><strong>Pickup Date:</strong> ${formattedPickupDate}</p>
<p><strong>Pickup Time:</strong> ${formattedPickupTime}</p>

${
  booking.tripType === "roundtrip"
    ? `
<p><strong>Return Date:</strong> ${formattedReturnDate}</p>
<p><strong>Return Time:</strong> ${formattedReturnTime}</p>
`
    : ""
}

</div>

<hr style="margin:25px 0"/>

<p style="font-size:12px;color:#777;text-align:center">
CabEazy Travel • Your ride is ready
</p>

</div>
</div>
`,
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
