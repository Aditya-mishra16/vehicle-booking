import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongodb";
import Driver from "@/models/Driver";

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

    // Save driver
    const driver = await Driver.create({
      fullName,
      phone,
      email,
      city,
      vehicle,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    // Admin notification
    await transporter.sendMail({
      from: `"Motorium Driver Registration" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: "🚗 New Driver Registration",
      html: `
      <h2>New Driver Registration</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email || "Not provided"}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Vehicle:</strong> ${vehicle}</p>
      `,
    });

    // Confirmation to driver
    if (email) {
      await transporter.sendMail({
        from: `"Motorium Travel" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Driver Registration Received",
        html: `
        <h2>Hello ${fullName},</h2>

        <p>
        Thank you for registering as a driver with <strong>Motorium</strong>.
        </p>

        <p>
        Our team has received your details and will review your application.
        </p>

        <p>
        Once there is a suitable booking available in your area,
        our agency will contact you.
        </p>

        <br/>

        <p>
        Regards,<br/>
        Motorium Team
        </p>
        `,
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
