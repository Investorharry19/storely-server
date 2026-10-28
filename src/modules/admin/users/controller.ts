import { Request, Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import userService from "./service";
import {
  sendMessageSchema,
  banUserSchema,
  warnUserSchema,
  changePlanSchema,
} from "./validation";

const getUsers = async (req: Request<any>, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const data = await userService.getUsers({ page, limit });

  return res.status(200).json({ success: true, data });
};

const getUserDetail = async (req: Request<{ id: string }>, res: Response) => {
  const data = await userService.getUserById(req.params.id);
  if (!data) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({ success: true, data });
};

const getUserStore = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  const data = await userService.getUserStore(req.params.userId);
  return res.status(200).json({ success: true, data });
};

const getUserSessions = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  const data = await userService.getUserSessions(req.params.userId);
  return res.status(200).json({ success: true, data });
};

const banUser = async (req: AuthRequest<{ userId: string }>, res: Response) => {
  const parsed = banUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await userService.banUser(
    req.user.id,
    req.params.userId,
    parsed.data,
  );
  return res
    .status(200)
    .json({ success: true, message: "User banned successfully", data });
};

const warnUser = async (
  req: AuthRequest<{ userId: string }>,
  res: Response,
) => {
  const parsed = warnUserSchema.safeParse({
    reason: req.body.message ?? "message.",
    noteToUser: req.body.noteToUser ?? "not to user.",
  });
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await userService.warnUser(
    req.user.id,
    req.params.userId,
    parsed.data,
  );
  return res
    .status(200)
    .json({ success: true, message: "User warned successfully", data });
};

const sendMessage = async (
  req: AuthRequest<{ userId: string }>,
  res: Response,
) => {
  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await userService.sendMessage(
    req.user.id,
    req.params.userId,
    parsed.data,
  );
  return res
    .status(200)
    .json({ success: true, message: "Message sent to user", data });
};

const forcePasswordReset = async (
  req: AuthRequest<{ userId: string }>,
  res: Response,
) => {
  const data = await userService.forcePasswordReset(
    req.user.id,
    req.params.userId,
  );
  return res
    .status(200)
    .json({ success: true, message: "Password reset forced", data });
};

const changePlan = async (
  req: AuthRequest<{ userId: string }>,
  res: Response,
) => {
  const parsed = changePlanSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await userService.changePlan(
    req.user.id,
    req.params.userId,
    parsed.data.plan,
  );
  return res
    .status(200)
    .json({ success: true, message: "Plan change processed", data });
};

export default {
  getUsers,
  getUserDetail,
  getUserStore,
  getUserSessions,
  banUser,
  warnUser,
  sendMessage,
  forcePasswordReset,
  changePlan,
};
