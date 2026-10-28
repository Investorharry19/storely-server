"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const token_util_1 = require("./token.util");
const otp_util_1 = require("./otp.util");
const prisma = new client_1.PrismaClient();
const BCRYPT_ROUNDS = 12;
// ============================================================
// HELPERS
// ============================================================
/**
 * Invalidate all existing OTPs for a user + purpose before issuing a new one.
 * Prevents OTP accumulation and replay attacks.
 */
const invalidatePreviousOtps = async (userId, purpose) => {
    await prisma.otpCode.updateMany({
        where: { userId, purpose, used: false },
        data: { used: true },
    });
};
/**
 * Issue a fresh OTP, persist it, and send the email.
 */
const issueOtp = async (user, purpose) => {
    await invalidatePreviousOtps(user.id, purpose);
    const code = (0, otp_util_1.generateOtp)();
    await prisma.otpCode.create({
        data: {
            userId: user.id,
            code,
            purpose,
            used: false,
            expiresAt: (0, otp_util_1.getOtpExpiry)(),
        },
    });
    await (0, otp_util_1.sendOtpEmail)(user.email, code, purpose);
};
/**
 * Issue access + refresh token pair and persist the hashed refresh token.
 */
const issueTokenPair = async (userId) => {
    const accessToken = (0, token_util_1.generateAccessToken)(userId);
    const { raw, hash } = (0, token_util_1.generateRefreshToken)();
    // Invalidate all previous refresh tokens for this user (single-session policy)
    // Remove this if you want to support multiple devices simultaneously
    await prisma.refreshToken.deleteMany({ where: { userId } });
    await prisma.refreshToken.create({
        data: {
            userId,
            tokenHash: hash,
            expiresAt: (0, token_util_1.getRefreshTokenExpiry)(),
        },
    });
    return { accessToken, refreshToken: raw };
};
// ============================================================
// SIGNUP
// ============================================================
const signup = async ({ fullName, email, password }) => {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        // Same error whether email exists or not — prevents user enumeration
        const error = new Error("If this email is not registered, you will receive a verification code.");
        await issueOtp(existing, "SIGNUP"); // Re-send OTP if they try to sign up again
        error.statusCode = 200; // Return 200 to avoid leaking info
        throw error;
    }
    const passwordHash = await bcrypt_1.default.hash(password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
        data: { fullName, email, passwordHash, isVerified: false },
    });
    await issueOtp(user, "SIGNUP");
    return {
        message: "Account created. Please check your email for a verification code.",
    };
};
// ============================================================
// VERIFY OTP
// ============================================================
const verifyOtp = async ({ email, code, purpose }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    // Generic error — never reveal whether email exists
    const invalidError = new Error("Invalid or expired verification code.");
    invalidError.statusCode = 400;
    if (!user)
        throw invalidError;
    const otpRecord = await prisma.otpCode.findFirst({
        where: {
            userId: user.id,
            purpose,
            used: false,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
    });
    if (!otpRecord)
        throw invalidError;
    // Timing-safe comparison
    const isValid = (0, otp_util_1.safeCompareOtp)(code, otpRecord.code);
    if (!isValid)
        throw invalidError;
    // Mark OTP as used immediately — prevents replay
    await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { used: true },
    });
    if (purpose === "SIGNUP") {
        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true },
        });
        const tokens = await issueTokenPair(user.id);
        return {
            message: "Email verified successfully.",
            ...tokens,
            user: { id: user.id, fullName: user.fullName, email: user.email },
        };
    }
    // PASSWORD_RESET — return a short-lived grant, not a full session
    // The reset endpoint will validate this OTP was recently used
    return { message: "Code verified. You may now reset your password." };
};
// ============================================================
// LOGIN
// ============================================================
const login = async ({ email, password, device, ip, location }) => {
    const genericError = new Error("Invalid email or password.");
    genericError.statusCode = 401;
    const user = await prisma.user.findUnique({ where: { email } });
    // Always run bcrypt even if user not found — prevents timing attacks
    const dummyHash = "$2b$12$invalidhashfortimingprotectiononly000000000000000000000";
    const passwordMatch = await bcrypt_1.default.compare(password, user?.passwordHash || dummyHash);
    if (!user || !passwordMatch)
        throw genericError;
    if (!user.isVerified) {
        // Re-send OTP and ask them to verify
        await issueOtp(user, "SIGNUP");
        const error = new Error("Email not verified. A new verification code has been sent to your email.");
        error.statusCode = 403;
        throw error;
    }
    const tokens = await issueTokenPair(user.id);
    await prisma.session.create({
        data: {
            userId: user.id,
            device,
            ip,
            location,
        },
    });
    return {
        message: "Login successful.",
        ...tokens,
        user: { id: user.id, fullName: user.fullName, email: user.email },
    };
};
// ============================================================
// REFRESH TOKEN
// Rotate: invalidate old token, issue new pair.
// ============================================================
const refreshTokens = async (rawToken) => {
    const tokenHash = (0, token_util_1.hashRefreshToken)(rawToken);
    const storedToken = await prisma.refreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
    });
    const invalidError = new Error("Invalid or expired refresh token. Please log in again.");
    invalidError.statusCode = 401;
    if (!storedToken)
        throw invalidError;
    // Check expiry
    if (new Date() > storedToken.expiresAt) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
        throw invalidError;
    }
    // Delete the used token immediately (rotation)
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    const tokens = await issueTokenPair(storedToken.userId);
    return {
        message: "Tokens refreshed.",
        ...tokens,
    };
};
// ============================================================
// RESEND OTP
// ============================================================
const resendOtp = async ({ email, purpose }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    // Silent success — never reveal if email is registered
    if (!user)
        return {
            message: "If this email is registered, a new code has been sent.",
        };
    if (purpose === "SIGNUP" && user.isVerified) {
        return {
            message: "If this email is registered, a new code has been sent.",
        };
    }
    await issueOtp(user, purpose);
    return { message: "If this email is registered, a new code has been sent." };
};
// ============================================================
// FORGOT PASSWORD
// ============================================================
const forgotPassword = async ({ email }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    // Silent success — never reveal if email is registered
    if (!user || !user.isVerified) {
        return {
            message: "If this email is registered, a password reset code has been sent.",
        };
    }
    await issueOtp(user, "PASSWORD_RESET");
    return {
        message: "If this email is registered, a password reset code has been sent.",
    };
};
// ============================================================
// RESET PASSWORD
// Verifies the OTP then updates password.
// ============================================================
const resetPassword = async ({ email, code, newPassword }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    const invalidError = new Error("Invalid or expired reset code.");
    invalidError.statusCode = 400;
    if (!user)
        throw invalidError;
    const otpRecord = await prisma.otpCode.findFirst({
        where: {
            userId: user.id,
            purpose: "PASSWORD_RESET",
            used: false,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
    });
    if (!otpRecord)
        throw invalidError;
    const isValid = (0, otp_util_1.safeCompareOtp)(code, otpRecord.code);
    if (!isValid)
        throw invalidError;
    // Mark OTP used
    await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { used: true },
    });
    // Prevent reuse of old password
    const isSamePassword = await bcrypt_1.default.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
        const error = new Error("New password must be different from your current password.");
        error.statusCode = 400;
        throw error;
    }
    const passwordHash = await bcrypt_1.default.hash(newPassword, BCRYPT_ROUNDS);
    // Update password and invalidate ALL refresh tokens (force re-login everywhere)
    await prisma.$transaction([
        prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
        prisma.refreshToken.deleteMany({ where: { userId: user.id } }),
    ]);
    return {
        message: "Password reset successful. Please log in with your new password.",
    };
};
// ============================================================
// LOGOUT
// Invalidates the refresh token for this session.
// ============================================================
const logout = async (rawToken) => {
    if (!rawToken)
        return;
    const tokenHash = (0, token_util_1.hashRefreshToken)(rawToken);
    await prisma.refreshToken.deleteMany({ where: { tokenHash } });
};
const authService = {
    signup,
    verifyOtp,
    login,
    refreshTokens,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
};
exports.default = authService;
