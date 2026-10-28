import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (to: string, otp: string) => {
  try {
    await resend.emails.send({
      from: "Storely <no-reply@haven.thukool.online>",
      to,
      subject: "Your Storely OTP Code",
      html: `<p>Your verification code is: <strong>${otp}</strong></p>
             <p>This code expires in 5 minutes.</p>`,
    });
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    // throw new Error("Failed to send OTP email");
  }
};

export const sendForgotPasswordEmail = async (to: string, otp: string) => {
  try {
    await resend.emails.send({
      from: "Storely <no-reply@haven.thukool.online>",
      to,
      subject: "Reset Your Storely Password",
      html: `<p>Your password reset code is: <strong>${otp}</strong></p>
             <p>This code expires in 10 minutes.</p>`,
    });
    console.log(`Forgot password email sent to ${to}`);
  } catch (error) {
    console.error("Error sending forgot password email:", error);
  }
};
