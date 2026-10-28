"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../../prisma/client");
const action_service_1 = __importDefault(require("../action.service"));
const email_service_1 = require("../../../notifications/email.service");
const client_2 = require("@prisma/client");
const paginate = (page = 1, limit = 20) => ({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
});
const getUsers = async ({ page, limit }) => {
    const where = {};
    const [users, total] = await Promise.all([
        client_1.prisma.user.findMany({
            where,
            orderBy: { createdAt: "desc" },
            ...paginate(page, limit),
        }),
        client_1.prisma.user.count({ where }),
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
const getUserById = async (userId) => {
    return client_1.prisma.user.findUnique({
        where: { id: userId },
    });
};
const getUserStore = async (userId) => {
    return client_1.prisma.business.findUnique({
        where: { userId },
    });
};
const getUserSessions = async (userId) => {
    const sessions = await client_1.prisma.session.findMany({
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
const banUser = async (adminId, userId, payload) => {
    const user = await client_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user)
        throw new Error("User not found");
    await client_1.prisma.user.update({
        where: { id: userId },
        data: { status: client_2.UserStatus.BANNED },
    });
    await action_service_1.default.logAdminAction({
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
    await (0, email_service_1.notifyUserBanned)({
        userEmail: user.email,
        userName: user.fullName,
        reason: payload.reason,
        noteToUser: payload.noteToUser,
    });
    return user;
};
const warnUser = async (adminId, userId, payload) => {
    const user = await client_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user)
        throw new Error("User not found");
    await action_service_1.default.logAdminAction({
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
    await (0, email_service_1.notifyUserWarned)({
        userEmail: user.email,
        userName: user.fullName,
        reason: payload.reason,
        noteToUser: payload.noteToUser,
    });
    return user;
};
const sendMessage = async (adminId, userId, payload) => {
    const user = await client_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user)
        throw new Error("User not found");
    await action_service_1.default.logAdminAction({
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
    await (0, email_service_1.notifyUserAdminMessage)({
        userEmail: user.email,
        userName: user.fullName,
        subject: payload.subject,
        message: payload.message,
    });
    return { target: user, subject: payload.subject, message: payload.message };
};
const forcePasswordReset = async (adminId, userId) => {
    const user = await client_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user)
        throw new Error("User not found");
    await action_service_1.default.logAdminAction({
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
const changePlan = async (adminId, userId, plan) => {
    const user = await client_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user)
        throw new Error("User not found");
    await action_service_1.default.logAdminAction({
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
exports.default = {
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
