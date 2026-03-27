import { transporter } from "@/lib/mail";
import { resend } from "@/lib/resend";

export const MailService = {
  sendOtpMail: async (email: string, otp: string) => {
    try {
      const response = await resend.emails.send({
        from: "Zynora <hello@ankitshukla.dev>",
        to: email,
        subject: "Your OTP Code",
        html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; padding: 30px;">
    <div style="
      max-width: 480px; 
      margin: auto; 
      background: #ffffff; 
      padding: 30px; 
      border-radius: 8px; 
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      border-top: 6px solid #450a0a; /* red-950 */
    ">
      
      <h2 style="text-align:center; color:#450a0a; margin-bottom: 10px; font-weight:700;">
        Zynora Verification Code
      </h2>

      <p style="text-align:center; color:#555; font-size:14px; margin-top:0;">
        Secure your shopping experience with Zynora.
      </p>

      <div style="text-align:center; margin: 25px 0;">
        <p style="color:#333; font-size:16px; margin-bottom:8px;">
          Your One-Time Password (OTP)
        </p>
        <h1 style="letter-spacing:6px; font-size:32px; color:#450a0a; margin:0; font-weight:700;">
          ${otp}
        </h1>
      </div>

      <p style="font-size:14px; color:#555; text-align:center;">
        This OTP is valid for the next <strong>5 minutes</strong>.  
        <br/>Please do not share it with anyone.
      </p>

      <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

      <p style="font-size:12px; color:#999; text-align:center;">
        If you didn’t request this code, you can safely ignore this email.
      </p>

      <p style="font-size:12px; color:#999; text-align:center; margin-top:20px;">
        © ${new Date().getFullYear()} Zynora • All rights reserved.
      </p>

    </div>
  </div>
        `,
      });

      console.log("Resend response:", response);
      return true;
    } catch (error: any) {
      console.error("Email sending failed:", error.message);
      return false;
    }
  },

  sendWelcomeMessage: async (email: string) => {
    try {
      await resend.emails.send({
        from: `"Your App" <${process.env.SMTP_MAIL}>`,
        to: email,
        subject: "Welcome from Zynora",
        html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background:#f7f7f7; padding: 30px;">
  <div style="
    max-width: 480px;
    margin: auto;
    background: #ffffff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    border-top: 6px solid #450a0a;
  ">

    <h2 style="text-align:center; color:#450a0a; margin-bottom: 10px; font-weight:700;">
      Welcome to Zynora!
    </h2>

    <p style="text-align:center; color:#555; font-size:14px; margin-top:0;">
      Your premium multivendor marketplace.
    </p>

    <div style="margin: 25px 0; text-align:center;">
      <p style="color:#333; font-size:16px; margin-bottom:10px;">
        Hi <strong>${email}</strong>,
      </p>

      <p style="color:#555; font-size:14px; line-height:1.6; margin:0 10px;">
        We’re excited to have you onboard!  
        Zynora brings together top vendors from across the country  
        so you can explore the latest products in fashion, electronics,  
        home essentials, beauty, accessories, and much more — all in one place.
      </p>
    </div>

    <div style="text-align:center; margin:30px 0;">
      <a href="https://zynora.com" style="
        background:#450a0a;
        color:#fff;
        padding:12px 22px;
        font-size:14px;
        text-decoration:none;
        border-radius:6px;
        font-weight:600;
        display:inline-block;
      ">
        Start Shopping
      </a>
    </div>

    <p style="font-size:14px; color:#555; text-align:center; line-height:1.6;">
      Your account is now active.  
      Discover new deals, track orders, and enjoy a seamless shopping journey.
    </p>

    <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

    <p style="font-size:12px; color:#999; text-align:center;">
      If you didn't create this account, please contact our support team.
    </p>

    <p style="font-size:12px; color:#999; text-align:center; margin-top:20px;">
      © ${new Date().getFullYear()} Zynora • All rights reserved.
    </p>

  </div>
</div>

        `,
      });

      return true;
    } catch (error: any) {
      console.error("Email sending failed:", error.message);
      return false;
    }
  },
};
