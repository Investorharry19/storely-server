import { Response, Request } from "express";
import authService from "./auth.service";
import {
  signupSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "./auth.validation";

const signup = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await authService.signup(parsed.data);

  return res.status(201).json({ success: true, ...result });
};

const verifyOtp = async (req: Request, res: Response) => {
  const parsed = verifyOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await authService.verifyOtp(parsed.data);

  return res.status(200).json({ success: true, ...result });
};

const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const ipHeader = req.headers["x-forwarded-for"]?.toString();
  const ip = ipHeader?.split(",")[0].trim() || req.ip;
  const device = req.headers["user-agent"]?.toString() || "unknown";

  const result = await authService.login({
    ...parsed.data,
    device,
    ip,
  });

  return res.status(200).json({ success: true, ...result });
};

const refresh = async (req: Request, res: Response) => {
  const parsed = refreshTokenSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await authService.refreshTokens(parsed.data.refreshToken);

  return res.status(200).json({ success: true, ...result });
};

const resendOtp = async (req: Request, res: Response) => {
  const parsed = resendOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await authService.resendOtp(parsed.data);

  return res.status(200).json({ success: true, ...result });
};

const forgotPassword = async (req: Request, res: Response) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await authService.forgotPassword(parsed.data);

  return res.status(200).json({ success: true, ...result });
};

const resetPassword = async (req: Request, res: Response) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await authService.resetPassword(parsed.data);

  return res.status(200).json({ success: true, ...result });
};

const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);

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

export default controller;
