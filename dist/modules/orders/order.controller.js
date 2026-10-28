"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_service_1 = __importDefault(require("./order.service"));
const order_validations_1 = require("./order.validations");
// ============================================================
// GET ORDERS (filtered, paginated)
// ============================================================
const getOrders = async (req, res) => {
    const parsed = order_validations_1.orderQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await order_service_1.default.getOrders(req.user.id, parsed.data);
    return res.status(200).json({ success: true, data: result });
};
// ============================================================
// GET SINGLE ORDER
// ============================================================
const getOrderById = async (req, res) => {
    const order = await order_service_1.default.getOrderById(req.user.id, req.params.orderId);
    return res.status(200).json({ success: true, data: order });
};
// ============================================================
// UPDATE ORDER STATUS
// ============================================================
const updateOrderStatus = async (req, res) => {
    const parsed = order_validations_1.updateOrderStatusSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const order = await order_service_1.default.updateOrderStatus(req.user.id, req.params.orderId, parsed.data.status);
    return res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: order,
    });
};
// ============================================================
// EXPORT AS CSV
// ============================================================
const exportCsv = async (req, res) => {
    const parsed = order_validations_1.orderQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const csv = await order_service_1.default.exportOrdersAsCsv(req.user.id, parsed.data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="storely-orders.csv"');
    return res.status(200).send(csv);
};
// ============================================================
// EXPORT AS PDF
// ============================================================
const exportPdf = async (req, res) => {
    const parsed = order_validations_1.orderQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const pdfBuffer = await order_service_1.default.exportOrdersAsPdf(req.user.id, parsed.data);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="storely-orders.pdf"');
    return res.status(200).send(pdfBuffer);
};
const controller = {
    getOrders,
    getOrderById,
    updateOrderStatus,
    exportCsv,
    exportPdf,
};
exports.default = controller;
