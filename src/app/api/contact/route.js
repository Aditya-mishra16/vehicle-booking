import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return Response.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    // ✅ Connect DB
    await connectDB();

    // ✅ Save contact message
    await Contact.create({
      name,
      email,
      message,
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

    const formattedDate = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Admin email
    await transporter.sendMail({
      from: `"Motorium Website" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      replyTo: email,
      subject: `📩 New Contact Inquiry | ${name}`,
      html: `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:30px;">
  <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

    <div style="background:#ea5b2a;color:#fff;padding:18px 24px">
      <h2 style="margin:0">📩 New Contact Inquiry</h2>
    </div>

    <div style="padding:28px">

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
          <td style="padding:8px 0;color:#666"><strong>Date</strong></td>
          <td style="padding:8px 0">${formattedDate}</td>
        </tr>
      </table>

      <hr style="margin:25px 0;border:none;border-top:1px solid #eee"/>

      <div style="background:#f6f7f9;border-radius:10px;padding:16px">
        <p style="margin:0 0 8px;font-weight:bold;">Message</p>
        <p style="margin:0;color:#444;line-height:1.6">
          ${message.replace(/\n/g, "<br/>")}
        </p>
      </div>

    </div>

    <div style="background:#fafafa;padding:16px;text-align:center;font-size:12px;color:#888">
      Sent from Motorium Website Contact Form
    </div>

  </div>
</div>
`,
    });
    // Customer confirmation
    await transporter.sendMail({
      from: `"Motorium Travel" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We have received your message 🚗",
      html: `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:30px;">
  <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

    <div style="background:#111827;color:#fff;padding:20px 24px">
      <h2 style="margin:0">Motorium Travel</h2>
    </div>

    <div style="padding:28px">

      <h3 style="margin-top:0">Hi ${name},</h3>

      <p style="line-height:1.6;color:#444">
        Thank you for contacting <strong>Motorium</strong>.
        We have successfully received your message and our team will respond shortly.
      </p>

      <div style="background:#f6f7f9;border-radius:10px;padding:16px;margin-top:20px">

        <p style="margin:0 0 8px;font-weight:bold">Your Message</p>

        <p style="margin:0;color:#444;line-height:1.6">
          ${message.replace(/\n/g, "<br/>")}
        </p>

      </div>

      <p style="margin-top:22px;font-size:13px;color:#666">
        If your inquiry is urgent, feel free to reply to this email.
      </p>

      <hr style="margin:30px 0;border:none;border-top:1px solid #eee"/>

      <p style="font-size:12px;color:#999;text-align:center">
        Motorium Travel • Safe & Reliable Outstation Cab Service
      </p>

    </div>

  </div>
</div>
`,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Unable to send message. Please try again later." },
      { status: 500 },
    );
  }
}
