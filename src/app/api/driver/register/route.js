"use server";

import { connectDB } from "@/lib/mongodb";
import Driver from "@/models/Driver";
import { sendEmail } from "@/utils/email/sendEmail";
import { emailTemplate } from "@/utils/email/template";

export async function POST(req) {
  try {
    const body = await req.json();

    const { fullName, phone, email, city, vehicle } = body;

    if (!fullName || !phone || !city || !vehicle) {
      return Response.json(
        { error: "Required fields missing" },
        { status: 400 },
      );
    }

    await connectDB();

    // ✅ Save driver
    const driver = await Driver.create({
      fullName,
      phone,
      email,
      city,
      vehicle,
    });

    /* ---------- ADMIN EMAIL (BOOKING STYLE) ---------- */

    const adminContent = `
      <p>A new driver has registered on CabEazy.</p>

      <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Vehicle:</strong> ${vehicle}</p>
      </div>

      <div style="margin-top:20px;padding:16px;border-radius:10px;background:#fff4f0;border-left:4px solid #ea5b2a;">
        🚗 <strong>Action Required:</strong> Review and approve the driver.
      </div>
    `;

    await sendEmail({
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: "🚗 New Driver Registration",
      html: emailTemplate({
        title: "New Driver Registration",
        content: adminContent,
      }),
    });

    /* ---------- DRIVER EMAIL (BOOKING STYLE) ---------- */

    if (email) {
      const driverContent = `
        <p>Your driver registration has been successfully submitted.</p>

        <!-- Driver Details -->
        <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Vehicle:</strong> ${vehicle}</p>
        </div>

        <!-- Status -->
        <div style="margin-top:20px;padding:16px;border-radius:10px;background:#fff4f0;border-left:4px solid #ea5b2a;">
          🚗 <strong>Status:</strong> Your application is under review.
        </div>

        <p style="margin-top:16px;">
          Our team will verify your details and contact you once approved.
        </p>

        <p style="margin-top:10px;">
          Ride opportunities will be shared based on availability in your area.
        </p>

        <p style="margin-top:16px;font-size:13px;color:#666;">
          Thank you for joining CabEazy.
        </p>
      `;

      await sendEmail({
        to: email,
        subject: "Driver Registration Received",
        html: emailTemplate({
          title: `Hello ${fullName},`,
          content: driverContent,
        }),
      });
    }

    return Response.json({
      success: true,
      message: "Driver registered successfully",
    });
  } catch (error) {
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
