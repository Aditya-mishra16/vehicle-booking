import { connectDB } from "@/lib/mongodb";
import Driver from "@/models/Driver";
import { sendEmail } from "@/utils/email/sendEmail";
import { emailTemplate } from "@/utils/email/template";

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

    /* ---------- SEND APPROVAL EMAIL ---------- */

    if (body.status === "approved" && driver.email) {
      await sendEmail({
        to: driver.email,
        subject: "🚗 Driver Registration Approved",
        html: emailTemplate({
          title: `Hello ${driver.fullName},`,
          content: `
            <p>
              Congratulations! Your driver registration has been 
              <strong>approved</strong>.
            </p>

            <div style="background:#f6f7f9;padding:16px;border-radius:10px;margin-top:15px">
              <p>
                You are now part of the 
                <strong>CabEazy driver network</strong>.
              </p>

              <p style="margin-top:8px;">
                Our team will contact you whenever a ride is available 
                in your area.
              </p>
            </div>

            <div style="margin-top:20px;padding:16px;border-radius:10px;background:#fff4f0;border-left:4px solid #ea5b2a;">
              🚗 Stay ready — ride opportunities will be shared with you soon.
            </div>

            <p style="margin-top:20px;">
              Thank you for partnering with us.
            </p>
          `,
        }),
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
