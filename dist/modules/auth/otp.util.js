"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = exports.otpEmailTemplate = exports.getOtpExpiry = exports.safeCompareOtp = exports.generateOtp = void 0;
const crypto_1 = __importDefault(require("crypto"));
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM;
const OTP_EXPIRY_MINUTES = 10;
// ============================================================
// GENERATE OTP
// 6-digit numeric code, cryptographically random.
// ============================================================
const generateOtp = () => {
    // Use crypto to avoid Math.random() bias
    const buffer = crypto_1.default.randomBytes(4);
    const num = buffer.readUInt32BE(0) % 1000000;
    return num.toString().padStart(6, "0");
};
exports.generateOtp = generateOtp;
// ============================================================
// TIMING-SAFE OTP COMPARISON
// Prevents timing attacks that could leak valid OTP length/value.
// ============================================================
const safeCompareOtp = (provided, stored) => {
    if (provided.length !== stored.length)
        return false;
    return crypto_1.default.timingSafeEqual(Buffer.from(provided, "utf8"), Buffer.from(stored, "utf8"));
};
exports.safeCompareOtp = safeCompareOtp;
// ============================================================
// OTP EXPIRY
// ============================================================
const getOtpExpiry = () => {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + OTP_EXPIRY_MINUTES);
    return expiry;
};
exports.getOtpExpiry = getOtpExpiry;
// ============================================================
// EMAIL TEMPLATES
// ============================================================
const otpEmailTemplate = (code, purpose) => {
    const subjects = {
        SIGNUP: "Verify your Storely account",
        PASSWORD_RESET: "Reset your Storely password",
        LOGIN: "Your Storely login code",
    };
    const headlines = {
        SIGNUP: "Verify your email address",
        PASSWORD_RESET: "Reset your password",
        LOGIN: "Your login code",
    };
    const messages = {
        SIGNUP: "Enter this code to verify your email and activate your Storely account.",
        PASSWORD_RESET: "Enter this code to reset your password. If you did not request this, ignore this email.",
        LOGIN: "Enter this code to log in to your Storely account.",
    };
    return {
        subject: subjects[purpose] || "Your Storely code",
        html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #2E2E2E;">
        <div style="background: linear-gradient(135deg, #8A2BE2, #4B0082); padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Storely</h1>
        </div>

        <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #f0f0f0;">
          <h2 style="font-size: 18px; margin: 0 0 12px;">${headlines[purpose]}</h2>
          <p style="font-size: 15px; color: #555; margin: 0 0 24px;">${messages[purpose]}</p>

          <div style="background: #f5f5f5; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Your code</p>
            <p style="margin: 0; font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #4B0082;">${code}</p>
          </div>

          <p style="font-size: 13px; color: #888; margin: 0;">
            This code expires in <strong>${OTP_EXPIRY_MINUTES} minutes</strong> and can only be used once.
            Never share this code with anyone.
          </p>
        </div>

        <div style="background: #f5f5f5; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #aaa;">Powered by Storely &mdash; If you did not request this, you can safely ignore it.</p>
        </div>
      </div>
    `,
    };
};
exports.otpEmailTemplate = otpEmailTemplate;
// ============================================================
// SEND OTP EMAIL
// ============================================================
const sendOtpEmail = async (email, code, purpose) => {
    const { subject, html } = (0, exports.otpEmailTemplate)(code, purpose);
    try {
        await resend.emails.send({ from: FROM, to: email, subject, html });
        console.log("email sent to ", email);
    }
    catch (err) {
        console.error(`[OTP] Failed to send OTP email to ${email}:`, err.message);
        // Re-throw here — if OTP email fails, the operation must fail
        // (user cannot proceed without receiving their code)
        throw new Error("Failed to send verification email. Please try again.");
    }
};
exports.sendOtpEmail = sendOtpEmail;
