import { prisma } from "../../../prisma/client";
import actionService from "../action.service";
import {
  notifyUserAdminMessage,
  notifyUserBanned,
  notifyUserWarned,
} from "../../../notifications/email.service";
import { UserStatus } from "@prisma/client";

const paginate = (page = 1, limit = 20) => ({
  skip: (Number(page) - 1) * Number(limit),
  take: Number(limit),
});

const getUsers = async ({ page, limit }: { page: number; limit: number }) => {
  const where = {};
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      ...paginate(page, limit),
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

const getUserStore = async (userId: string) => {
  return prisma.business.findUnique({
    where: { userId },
  });
};

const getUserSessions = async (userId: string) => {
  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      device: true,
      ip: true,
      location: true,
      createdAt: true,
    },
  });

  return { sessions, total: sessions.length };
};

const banUser = async (
  adminId: string,
  userId: string,
  payload: { reason: string; noteToUser: string },
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  await prisma.user.update({
    where: { id: userId },
    data: { status: UserStatus.BANNED },
  });

  await actionService.logAdminAction({
    adminId,
    action: "BAN_USER",
    entityType: "USER",
    entityId: userId,
    details: {
      reason: payload.reason,
      noteToUser: payload.noteToUser,
    },
  });

  // Send ban email
  await notifyUserBanned({
    userEmail: user.email,
    userName: user.fullName,
    reason: payload.reason,
    noteToUser: payload.noteToUser,
  });

  return user;
};

const warnUser = async (
  adminId: string,
  userId: string,
  payload: { reason: string; noteToUser: string },
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  await actionService.logAdminAction({
    adminId,
    action: "WARN_USER",
    entityType: "USER",
    entityId: userId,
    details: {
      reason: payload.reason,
      noteToUser: payload.noteToUser,
    },
  });

  // Send warn email
  await notifyUserWarned({
    userEmail: user.email,
    userName: user.fullName,
    reason: payload.reason,
    noteToUser: payload.noteToUser,
  });

  return user;
};

const sendMessage = async (
  adminId: string,
  userId: string,
  payload: { subject: string; message: string },
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  await actionService.logAdminAction({
    adminId,
    action: "SEND_MESSAGE_USER",
    entityType: "USER",
    entityId: userId,
    details: {
      subject: payload.subject,
      message: payload.message,
    },
  });

  // Send admin message email
  await notifyUserAdminMessage({
    userEmail: user.email,
    userName: user.fullName,
    subject: payload.subject,
    message: payload.message,
  });

  return { target: user, subject: payload.subject, message: payload.message };
};

const forcePasswordReset = async (adminId: string, userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  await actionService.logAdminAction({
    adminId,
    action: "FORCE_PASSWORD_RESET",
    entityType: "USER",
    entityId: userId,
    details: {},
  });

  // For now, just return, implement reset logic if needed
  return {
    user,
    note: "Password reset forced; implement token generation if needed",
  };
};

const changePlan = async (adminId: string, userId: string, plan: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  await actionService.logAdminAction({
    adminId,
    action: "CHANGE_PLAN_USER",
    entityType: "USER",
    entityId: userId,
    details: { plan },
  });

  return {
    target: user,
    plan,
    note: "Plan change request recorded; update schema to persist plan selection.",
  };
};

export default {
  getUsers,
  getUserById,
  getUserStore,
  getUserSessions,
  banUser,
  warnUser,
  sendMessage,
  forcePasswordReset,
  changePlan,
};
