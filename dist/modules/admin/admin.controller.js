"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_service_1 = __importDefault(require("./admin.service"));
const admin_validation_1 = require("./admin.validation");
// ============================================================
// DASHBOARD METRICS
// ============================================================
const getDashboardMetrics = async (req, res) => {
    const data = await admin_service_1.default.getDashboardMetrics();
    return res.status(200).json({ success: true, data });
};
// ============================================================
// USERS
// ============================================================
const getPendingUsers = async (req, res) => {
    const parsed = admin_validation_1.paginationSchema.safeParse(req.query);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await admin_service_1.default.getPendingUsers(parsed.data);
    return res.status(200).json({ success: true, data });
};
const getAllUsers = async (req, res) => {
    const parsed = admin_validation_1.userQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await admin_service_1.default.getAllUsers(parsed.data);
    return res.status(200).json({ success: true, data });
};
const getUserDetail = async (req, res) => {
    const data = await admin_service_1.default.getUserDetail(req.params.id);
    return res.status(200).json({ success: true, data });
};
const approveUser = async (req, res) => {
    const parsed = admin_validation_1.userIdSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const user = await admin_service_1.default.approveUser(parsed.data.userId);
    return res
        .status(200)
        .json({ success: true, message: "User approved successfully", data: user });
};
const rejectUser = async (req, res) => {
    const parsed = admin_validation_1.userIdSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const user = await admin_service_1.default.rejectUser(parsed.data.userId);
    return res
        .status(200)
        .json({ success: true, message: "User rejected", data: user });
};
// ============================================================
// ORDERS
// ============================================================
const getRecentOrders = async (req, res) => {
    const parsed = admin_validation_1.paginationSchema.safeParse(req.query);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await admin_service_1.default.getRecentOrders(parsed.data);
    return res.status(200).json({ success: true, data });
};
const getOrderDetail = async (req, res) => {
    const data = await admin_service_1.default.getOrderDetail(req.params.id);
    return res.status(200).json({ success: true, data });
};
const getAllOrders = async (req, res) => {
    const parsed = admin_validation_1.orderQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await admin_service_1.default.getAllOrders(parsed.data);
    return res.status(200).json({ success: true, data });
};
// ============================================================
// PAYMENTS
// ============================================================
const getTransactions = async (req, res) => {
    const parsed = admin_validation_1.transactionQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await admin_service_1.default.getTransactions(parsed.data);
    return res.status(200).json({ success: true, data });
};
const refundPayment = async (req, res) => {
    const parsed = admin_validation_1.paymentIdSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await admin_service_1.default.refundPayment(parsed.data.paymentId);
    return res
        .status(200)
        .json({ success: true, message: "Payment refunded successfully", data });
};
const getAllRevenue = async (req, res) => {
    const parsed = admin_validation_1.revenueQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await admin_service_1.default.getAllRevenue(parsed.data);
    return res.status(200).json({ success: true, data });
};
const getRevenueDetail = async (req, res) => {
    const data = await admin_service_1.default.getRevenueDetail(req.params.id);
    return res.status(200).json({ success: true, data });
};
// ============================================================
// SUPPORT TICKETS
// ============================================================
const getPaymentIssues = async (req, res) => {
    const parsed = admin_validation_1.paginationSchema.safeParse(req.query);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await admin_service_1.default.getPaymentIssues(parsed.data);
    return res.status(200).json({ success: true, data });
};
const getPlatformTickets = async (req, res) => {
    const parsed = admin_validation_1.ticketQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await admin_service_1.default.getPlatformTickets(parsed.data);
    return res.status(200).json({ success: true, data });
};
const resolveTicket = async (req, res) => {
    const idParsed = admin_validation_1.ticketIdSchema.safeParse(req.body);
    if (!idParsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: idParsed.error.flatten().fieldErrors });
    }
    const bodyParsed = admin_validation_1.resolveTicketSchema.safeParse(req.body);
    if (!bodyParsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: bodyParsed.error.flatten().fieldErrors });
    }
    const data = await admin_service_1.default.resolveTicket(idParsed.data.ticketId, bodyParsed.data);
    return res
        .status(200)
        .json({ success: true, message: "Ticket updated successfully", data });
};
const controller = {
    getDashboardMetrics,
    getPendingUsers,
    getAllUsers,
    getUserDetail,
    approveUser,
    rejectUser,
    getRecentOrders,
    getOrderDetail,
    getAllOrders,
    getTransactions,
    refundPayment,
    getAllRevenue,
    getRevenueDetail,
    getPaymentIssues,
    getPlatformTickets,
    resolveTicket,
};
exports.default = controller;
