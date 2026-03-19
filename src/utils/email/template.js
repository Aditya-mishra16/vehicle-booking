export const emailTemplate = ({ title, content }) => {
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+91XXXXXXXXXX";

  return `
  <div style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    
    <div style="max-width:640px;margin:40px auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">

      <!-- HEADER (SLIMMED) -->
      <div style="padding:14px 20px;border-bottom:1px solid #f1f1f1;text-align:center;background:#fff7f3;">
        
        <!-- Brand Name -->
        <div style="font-size:17px;font-weight:600;color:#ea5b2a;">
          CabEazy
        </div>

        <!-- Tagline -->
        <div style="font-size:11px;color:#888;margin-top:1px;">
          Reliable Intercity Travel
        </div>
      </div>

      <!-- BODY -->
      <div style="padding:24px 20px;">

        <h2 style="margin:0 0 12px;font-size:18px;font-weight:600;color:#111;">
          ${title}
        </h2>

        <div style="font-size:14px;color:#444;line-height:1.6;">
          ${content}
        </div>

        <div style="margin-top:24px;">
          <a href="tel:${phone}"
            style="display:inline-block;background:#ea5b2a;color:#fff;padding:11px 18px;border-radius:6px;font-size:14px;font-weight:500;text-decoration:none;">
            Contact Support
          </a>
        </div>

      </div>

      <!-- FOOTER -->
      <div style="padding:16px 20px;border-top:1px solid #f1f1f1;text-align:center;background:#fff7f3;">
        <p style="margin:0;font-size:12px;color:#a65a3a;">
          CabEazy Travel • Mumbai, India
        </p>
        <p style="margin:4px 0 0;font-size:11px;color:#c48a73;">
          This is an automated email. Please do not reply.
        </p>
      </div>

    </div>

  </div>
  `;
};
