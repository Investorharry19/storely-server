"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const rateLimiter_1 = require("../../middlewares/rateLimiter");
const auth_controller_1 = __importDefault(require("./auth.controller"));
// POST /api/auth/signup           — create account
// POST /api/auth/verify-otp       — verify email OTP
// POST /api/auth/login            — login
// POST /api/auth/refresh          — rotate refresh token
// POST /api/auth/resend-otp       — resend OTP (strict rate limit)
// POST /api/auth/forgot-password  — request password reset OTP
// POST /api/auth/reset-password   — reset password with OTP
// POST /api/auth/logout           — invalidate refresh token
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post("/signup", rateLimiter_1.authLimiter, (0, asyncHandler_1.asyncHandler)(auth_controller_1.default.signup));
/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify email OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OtpRequest'
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post("/verify-otp", rateLimiter_1.authLimiter, (0, asyncHandler_1.asyncHandler)(auth_controller_1.default.verifyOtp));
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post("/login", rateLimiter_1.authLimiter, (0, asyncHandler_1.asyncHandler)(auth_controller_1.default.login));
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Rotate refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post("/refresh", (0, asyncHandler_1.asyncHandler)(auth_controller_1.default.refresh));
/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend verification OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post("/resend-otp", rateLimiter_1.otpLimiter, (0, asyncHandler_1.asyncHandler)(auth_controller_1.default.resendOtp));
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post("/forgot-password", rateLimiter_1.authLimiter, (0, asyncHandler_1.asyncHandler)(auth_controller_1.default.forgotPassword));
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post("/reset-password", rateLimiter_1.authLimiter, (0, asyncHandler_1.asyncHandler)(auth_controller_1.default.resetPassword));
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Invalidate refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post("/logout", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(auth_controller_1.default.logout));
const authRoutes = router;
exports.default = authRoutes;
/**
 *
 * // On every request — attach the access token
axios.interceptors.request.use((config) => {
  const token = getAccessToken(); // read from storage
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On every response — handle 401 silently
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !original._retry // prevent infinite loop
    ) {
      original._retry = true;

      try {
        const refreshToken = getRefreshToken(); // read from secure storage
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });

        // Store the new tokens
        saveAccessToken(data.accessToken);
        saveRefreshToken(data.refreshToken);

        // Retry the original request with the new access token
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(original);
      } catch {
        // Refresh failed — force logout
        clearTokens();
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);
 */ 
