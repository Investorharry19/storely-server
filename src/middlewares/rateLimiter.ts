import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

// ============================================================
// HELPERS
// ============================================================

/**
 * Standard rate limit response format — consistent with the rest of the API.
 */
const rateLimitHandler = (req: Request | any, res: Response) => {
  return res.status(429).json({
    success: false,
    message: "Too many requests. Please slow down and try again later.",
    retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
  });
};

// ============================================================
// GLOBAL LIMIT
// Loose safety net across all routes.
// 300 requests per 15 minutes per IP.
// ============================================================
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// ============================================================
// AUTH LIMIT
// Covers: login, signup, OTP verify, OTP resend.
// Strict — prevents brute force and OTP spam.
// 10 requests per 15 minutes per IP.
// ============================================================
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request | any, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many attempts. Please wait 15 minutes before trying again.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// ============================================================
// OTP LIMIT
// Extra strict specifically for OTP resend to prevent SMS cost abuse.
// 3 requests per 10 minutes per IP.
// ============================================================
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request | any, res) => {
    return res.status(429).json({
      success: false,
      message:
        "Too many OTP requests. Please wait 10 minutes before requesting another code.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// ============================================================
// AI LIMIT
// Covers: business description, product description, improve.
// Prevents runaway Anthropic API costs.
// 20 requests per hour per IP.
// ============================================================
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request | any, res) => {
    return res.status(429).json({
      success: false,
      message:
        "AI generation limit reached. You can make 20 requests per hour.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// ============================================================
// CHECKOUT LIMIT
// Covers: order initialization.
// Prevents order/payment spam from a single IP.
// 30 requests per hour per IP.
// ============================================================
export const checkoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request | any, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many checkout attempts. Please try again later.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// ============================================================
// EXPORT LIMIT
// Covers: CSV and PDF export endpoints.
// These are heavy DB operations — limit per user to be safe.
// 10 requests per hour per IP.
// ============================================================
export const exportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request | any, res) => {
    return res.status(429).json({
      success: false,
      message: "Export limit reached. You can export up to 10 times per hour.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});
