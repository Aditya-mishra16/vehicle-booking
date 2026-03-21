"use server";

import { connectDB } from "@/lib/mongodb";
import Driver from "@/models/Driver";
import { sendEmail } from "@/utils/email/sendEmail";
import { emailTemplate } from "@/utils/email/template";

const vehicleTypeLabel = {
  "sedan-intercity": "Sedan Intercity",
  "mini-intercity": "Mini Intercity",
  "suv-intercity": "SUV Intercity",
};

export async function POST(req) {
  try {
    const body = await req.json();

    let { fullName, phone, email, city, vehicleName, vehicleType } = body;

    // ✅ Normalize
    fullName = fullName?.trim();
    phone = phone?.trim();
    email = email?.toLowerCase().trim();
    city = city?.trim();
    vehicleName = vehicleName?.trim();

    // ✅ Validation
    if (!fullName || !phone || !city || !vehicleName || !vehicleType) {
      return Response.json(
        { error: "Required fields missing" },
        { status: 400 },
      );
    }

    if (
      !["sedan-intercity", "mini-intercity", "suv-intercity"].includes(
        vehicleType,
      )
    ) {
      return Response.json({ error: "Invalid vehicle type" }, { status: 400 });
    }

    await connectDB();

    // ✅ Save driver
    const driver = await Driver.create({
      fullName,
      phone,
      email,
      city,
      vehicleName,
      vehicleType,
    });

    const adminContent = `
      <p>A new driver has registered on CabEazy.</p>

      <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Vehicle:</strong> ${vehicleName}</p>
        <p><strong>Type:</strong> ${vehicleTypeLabel[vehicleType]}</p>
      </div>

      <div style="margin-top:20px;padding:16px;border-radius:10px;background:#fff4f0;border-left:4px solid #ea5b2a;">
        🚗 <strong>Action Required:</strong> Review and approve the driver.
      </div>
    `;

    try {
      await sendEmail({
        to: process.env.CONTACT_RECEIVER_EMAIL,
        subject: "🚗 New Driver Registration",
        html: emailTemplate({
          title: "New Driver Registration",
          content: adminContent,
        }),
      });
    } catch (err) {
      console.error("Admin email failed:", err);
    }

    if (email) {
      const driverContent = `
        <p>Your driver registration has been successfully submitted.</p>

        <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Vehicle:</strong> ${vehicleName}</p>
          <p><strong>Type:</strong> ${vehicleTypeLabel[vehicleType]}</p>
        </div>

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

      try {
        await sendEmail({
          to: email,
          subject: "Driver Registration Received",
          html: emailTemplate({
            title: `Hello ${fullName},`,
            content: driverContent,
          }),
        });
      } catch (err) {
        console.error("Driver email failed:", err);
      }
    }

    return Response.json({
      success: true,
      message: "Driver registered successfully",
      driver,
    });
  } catch (error) {
    console.error("Driver registration error:", error);

    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
