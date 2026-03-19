"use server";

import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { sendEmail } from "@/utils/email/sendEmail";
import { emailTemplate } from "@/utils/email/template";

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

    const formattedDate = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    /* ---------- ADMIN EMAIL (BOOKING STYLE) ---------- */

    const adminContent = `
      <p>A new customer inquiry has been received.</p>

      <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
      </div>

      <div style="background:#f6f7f9;border-radius:10px;padding:16px;margin-top:15px">
        <p style="margin:0 0 6px;font-weight:600;">Message</p>
        <p style="margin:0;line-height:1.6;">
          ${message.replace(/\n/g, "<br/>")}
        </p>
      </div>

      <div style="margin-top:20px;padding:16px;border-radius:10px;background:#fff4f0;border-left:4px solid #ea5b2a;">
        📩 <strong>Action Required:</strong> Respond to the customer inquiry.
      </div>
    `;

    await sendEmail({
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: `📩 New Contact Inquiry | ${name}`,
      html: emailTemplate({
        title: "New Contact Inquiry",
        content: adminContent,
      }),
    });

    /* ---------- CUSTOMER EMAIL (BOOKING STYLE) ---------- */

    const customerContent = `
      <p>Your message has been successfully received.</p>

      <div style="background:#f6f7f9;border-radius:10px;padding:16px;margin-top:15px">
        <p style="margin:0 0 6px;font-weight:600;">Your Message</p>
        <p style="margin:0;line-height:1.6;">
          ${message.replace(/\n/g, "<br/>")}
        </p>
      </div>

      <div style="margin-top:20px;padding:16px;border-radius:10px;background:#fff4f0;border-left:4px solid #ea5b2a;">
        🚗 <strong>Status:</strong> Our team will get back to you shortly.
      </div>

      <p style="margin-top:16px;">
        If your request is urgent, feel free to contact us directly.
      </p>

      <p style="margin-top:16px;font-size:13px;color:#666;">
        Thank you for choosing CabEazy.
      </p>
    `;

    await sendEmail({
      to: email,
      subject: "We have received your message 🚗",
      html: emailTemplate({
        title: `Hello ${name},`,
        content: customerContent,
      }),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Unable to send message. Please try again later." },
      { status: 500 },
    );
  }
}
