"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("./auth.service"));
const auth_validation_1 = require("./auth.validation");
const signup = async (req, res) => {
    const parsed = auth_validation_1.signupSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await auth_service_1.default.signup(parsed.data);
    return res.status(201).json({ success: true, ...result });
};
const verifyOtp = async (req, res) => {
    const parsed = auth_validation_1.verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await auth_service_1.default.verifyOtp(parsed.data);
    return res.status(200).json({ success: true, ...result });
};
const login = async (req, res) => {
    const parsed = auth_validation_1.loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const ipHeader = req.headers["x-forwarded-for"]?.toString();
    const ip = ipHeader?.split(",")[0].trim() || req.ip;
    const device = req.headers["user-agent"]?.toString() || "unknown";
    const result = await auth_service_1.default.login({
        ...parsed.data,
        device,
        ip,
    });
    return res.status(200).json({ success: true, ...result });
};
const refresh = async (req, res) => {
    const parsed = auth_validation_1.refreshTokenSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await auth_service_1.default.refreshTokens(parsed.data.refreshToken);
    return res.status(200).json({ success: true, ...result });
};
const resendOtp = async (req, res) => {
    const parsed = auth_validation_1.resendOtpSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await auth_service_1.default.resendOtp(parsed.data);
    return res.status(200).json({ success: true, ...result });
};
const forgotPassword = async (req, res) => {
    const parsed = auth_validation_1.forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await auth_service_1.default.forgotPassword(parsed.data);
    return res.status(200).json({ success: true, ...result });
};
const resetPassword = async (req, res) => {
    const parsed = auth_validation_1.resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await auth_service_1.default.resetPassword(parsed.data);
    return res.status(200).json({ success: true, ...result });
};
const logout = async (req, res) => {
    const { refreshToken } = req.body;
    await auth_service_1.default.logout(refreshToken);
    return res
        .status(200)
        .json({ success: true, message: "Logged out successfully." });
};
const controller = {
    signup,
    verifyOtp,
    login,
    refresh,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
};
exports.default = controller;
