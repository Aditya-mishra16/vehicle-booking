import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import nodemailer from "nodemailer";

export async function PATCH(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    // update booking with driver
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

    // send email to driver
    if (driver?.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const formattedDate = new Date(booking.startDate).toDateString();

      await transporter.sendMail({
        from: `"CabEazy Travel" <${process.env.EMAIL_USER}>`,
        to: driver.email,
        subject: "🚗 New Ride Assigned",
        html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:30px;">
          <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:14px;padding:28px;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

            <h2 style="margin-top:0">Hello ${driver.fullName},</h2>

            <p>
              A new ride has been assigned to you.
            </p>

            <div style="background:#f6f7f9;border-radius:10px;padding:16px;margin-top:15px">

              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Pickup:</strong> ${booking.pickup}</p>
              <p><strong>Drop:</strong> ${booking.drop}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Vehicle:</strong> ${booking.vehicle}</p>
              <p><strong>Estimated Fare:</strong> ₹${booking.price}</p>

            </div>

            <p style="margin-top:20px">
              Please be ready for the ride. Contact the admin team if you need assistance.
            </p>

            <hr style="margin:25px 0"/>

            <p style="font-size:12px;color:#777">
              CabEazy Travel • Driver Notification
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
