import { connectDB } from "@/lib/mongodb";
import Driver from "@/models/Driver";
import nodemailer from "nodemailer";

export async function PATCH(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    const driver = await Driver.findByIdAndUpdate(
      id,
      { status: body.status },
      { returnDocument: "after" },
    );

    if (!driver) {
      return Response.json({
        success: false,
        error: "Driver not found",
      });
    }

    if (body.status === "approved" && driver.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"CabEazy Travel" <${process.env.EMAIL_USER}>`,
        to: driver.email,
        subject: "Driver Registration Approved 🚗",
        html: `
        <div style="font-family:Arial;padding:20px;background:#f5f5f5">
          <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:10px">

          <h2>Hello ${driver.fullName},</h2>

          <p>Congratulations! Your driver registration has been <b>approved</b>.</p>

          <p>You are now part of the <b>CabEazy driver network</b>.</p>

          <p>Our team will contact you whenever a ride is available in your area.</p>

          <br/>

          <p>Thank you for partnering with us.</p>

          <br/>

          <p>
          Regards<br/>
          <b>CabEazy Team</b>
          </p>

          </div>
        </div>
        `,
      });
    }

    return Response.json({
      success: true,
      driver,
    });
  } catch {
    return Response.json(
      { success: false, error: "Failed to update driver" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const driver = await Driver.findByIdAndDelete(id);

    if (!driver) {
      return Response.json({
        success: false,
        error: "Driver not found",
      });
    }

    return Response.json({
      success: true,
    });
  } catch {
    return Response.json(
      { success: false, error: "Failed to delete driver" },
      { status: 500 },
    );
  }
}
