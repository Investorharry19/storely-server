import z from "zod";

export const signupSchema = z.object({
  fullName: z
    .string({ error: "Full name is required" })
    .min(2, "Full name must be at least 2 characters")
    .max(100)
    .trim(),

  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must not exceed 72 characters") // bcrypt hard limit
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase()
    .trim(),

  password: z.string({ error: "Password is required" }),

  location: z
    .string()
    .max(255)
    .optional()
    .transform((value) => value?.trim()),
});

export const verifyOtpSchema = z.object({
  email: z.string({ error: "Email is required" }).email().toLowerCase().trim(),

  code: z
    .string({ error: "OTP code is required" })
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),

  purpose: z.enum(["SIGNUP", "PASSWORD_RESET"], {
    error:
      "Purpose is required and must be either SIGNUP or PASSWORD_RESET enum",
  }),
});

export const resendOtpSchema = z.object({
  email: z.string({ error: "Email is required" }).email().toLowerCase().trim(),

  purpose: z.enum(["SIGNUP", "PASSWORD_RESET"]),
});

export const forgotPasswordSchema = z.object({
  email: z.string({ error: "Email is required" }).email().toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  email: z.string({ error: "Email is required" }).email().toLowerCase().trim(),

  code: z
    .string({ error: "OTP code is required" })
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),

  newPassword: z
    .string({ error: "New password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string({ error: "Refresh token is required" }),
});
