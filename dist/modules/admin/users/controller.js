"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("./service"));
const validation_1 = require("./validation");
const getUsers = async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const data = await service_1.default.getUsers({ page, limit });
    return res.status(200).json({ success: true, data });
};
const getUserDetail = async (req, res) => {
    const data = await service_1.default.getUserById(req.params.id);
    if (!data) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data });
};
const getUserStore = async (req, res) => {
    const data = await service_1.default.getUserStore(req.params.userId);
    return res.status(200).json({ success: true, data });
};
const getUserSessions = async (req, res) => {
    const data = await service_1.default.getUserSessions(req.params.userId);
    return res.status(200).json({ success: true, data });
};
const banUser = async (req, res) => {
    const parsed = validation_1.banUserSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await service_1.default.banUser(req.user.id, req.params.userId, parsed.data);
    return res
        .status(200)
        .json({ success: true, message: "User banned successfully", data });
};
const warnUser = async (req, res) => {
    const parsed = validation_1.warnUserSchema.safeParse({
        reason: req.body.message ?? "message.",
        noteToUser: req.body.noteToUser ?? "not to user.",
    });
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await service_1.default.warnUser(req.user.id, req.params.userId, parsed.data);
    return res
        .status(200)
        .json({ success: true, message: "User warned successfully", data });
};
const sendMessage = async (req, res) => {
    const parsed = validation_1.sendMessageSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await service_1.default.sendMessage(req.user.id, req.params.userId, parsed.data);
    return res
        .status(200)
        .json({ success: true, message: "Message sent to user", data });
};
const forcePasswordReset = async (req, res) => {
    const data = await service_1.default.forcePasswordReset(req.user.id, req.params.userId);
    return res
        .status(200)
        .json({ success: true, message: "Password reset forced", data });
};
const changePlan = async (req, res) => {
    const parsed = validation_1.changePlanSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await service_1.default.changePlan(req.user.id, req.params.userId, parsed.data.plan);
    return res
        .status(200)
        .json({ success: true, message: "Plan change processed", data });
};
exports.default = {
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
