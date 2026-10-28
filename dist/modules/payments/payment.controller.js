"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payment_service_1 = __importDefault(require("./payment.service"));
const getPayments = async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const status = req.query.status;
    const result = await payment_service_1.default.getPayments(req.user.id, {
        page,
        limit,
        status,
    });
    return res.status(200).json({ success: true, data: result });
};
const getSummary = async (req, res) => {
    const summary = await payment_service_1.default.getSummary(req.user.id);
    return res.status(200).json({ success: true, data: summary });
};
exports.default = { getPayments, getSummary };
