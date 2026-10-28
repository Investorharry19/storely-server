"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.resendOtpSchema = exports.verifyOtpSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = zod_1.default.object({
    fullName: zod_1.default
        .string({ error: "Full name is required" })
        .min(2, "Full name must be at least 2 characters")
        .max(100)
        .trim(),
    email: zod_1.default
        .string({ error: "Email is required" })
        .email("Invalid email address")
        .toLowerCase()
        .trim(),
    password: zod_1.default
        .string({ error: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password must not exceed 72 characters") // bcrypt hard limit
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default
        .string({ error: "Email is required" })
        .email("Invalid email address")
        .toLowerCase()
        .trim(),
    password: zod_1.default.string({ error: "Password is required" }),
    location: zod_1.default
        .string()
        .max(255)
        .optional()
        .transform((value) => value?.trim()),
});
exports.verifyOtpSchema = zod_1.default.object({
    email: zod_1.default.string({ error: "Email is required" }).email().toLowerCase().trim(),
    code: zod_1.default
        .string({ error: "OTP code is required" })
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d{6}$/, "OTP must contain only digits"),
    purpose: zod_1.default.enum(["SIGNUP", "PASSWORD_RESET"], {
        error: "Purpose is required and must be either SIGNUP or PASSWORD_RESET enum",
    }),
});
exports.resendOtpSchema = zod_1.default.object({
    email: zod_1.default.string({ error: "Email is required" }).email().toLowerCase().trim(),
    purpose: zod_1.default.enum(["SIGNUP", "PASSWORD_RESET"]),
});
exports.forgotPasswordSchema = zod_1.default.object({
    email: zod_1.default.string({ error: "Email is required" }).email().toLowerCase().trim(),
});
exports.resetPasswordSchema = zod_1.default.object({
    email: zod_1.default.string({ error: "Email is required" }).email().toLowerCase().trim(),
    code: zod_1.default
        .string({ error: "OTP code is required" })
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d{6}$/, "OTP must contain only digits"),
    newPassword: zod_1.default
        .string({ error: "New password is required" })
        .min(8, "Password must be at least 8 characters")
        .max(72)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});
exports.refreshTokenSchema = zod_1.default.object({
    refreshToken: zod_1.default.string({ error: "Refresh token is required" }),
});
