"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgotPasswordEmail = exports.sendOtpEmail = void 0;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendOtpEmail = async (to, otp) => {
    try {
        await resend.emails.send({
            from: "Storely <no-reply@haven.thukool.online>",
            to,
            subject: "Your Storely OTP Code",
            html: `<p>Your verification code is: <strong>${otp}</strong></p>
             <p>This code expires in 5 minutes.</p>`,
        });
        console.log(`OTP email sent to ${to}`);
    }
    catch (error) {
        console.error("Error sending OTP email:", error);
        // throw new Error("Failed to send OTP email");
    }
};
exports.sendOtpEmail = sendOtpEmail;
const sendForgotPasswordEmail = async (to, otp) => {
    try {
        await resend.emails.send({
            from: "Storely <no-reply@haven.thukool.online>",
            to,
            subject: "Reset Your Storely Password",
            html: `<p>Your password reset code is: <strong>${otp}</strong></p>
             <p>This code expires in 10 minutes.</p>`,
        });
        console.log(`Forgot password email sent to ${to}`);
    }
    catch (error) {
        console.error("Error sending forgot password email:", error);
    }
};
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
