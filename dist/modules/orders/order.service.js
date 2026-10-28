"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// const { Parser } = require("json2csv");
const pdfkit_1 = __importDefault(require("pdfkit"));
const plainjs_1 = require("@json2csv/plainjs");
const email_service_1 = require("../../notifications/email.service");
const prisma = new client_1.PrismaClient();
// ============================================================
// HELPERS
// ============================================================
const getBusinessOrThrow = async (userId) => {
    const business = await prisma.business.findUnique({ where: { userId } });
    if (!business) {
        const error = new Error("Business profile not found");
        error.statusCode = 404;
        throw error;
    }
    return business;
};
const getOrderOrThrow = async (orderId, businessId) => {
    const order = await prisma.order.findFirst({
        where: { id: orderId, businessId },
        include: { items: true },
    });
    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }
    return order;
};
// ============================================================
// GET ORDERS (with filter, search, pagination)
// ============================================================
const getOrders = async (userId, query) => {
    const business = await getBusinessOrThrow(userId);
    const { status, paymentStatus, customerName, from, to, page, limit } = query;
    const where = {
        businessId: business.id,
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(customerName && {
            customerName: { contains: customerName, mode: "insensitive" },
        }),
        ...(from || to
            ? {
                createdAt: {
                    ...(from && { gte: new Date(from) }),
                    ...(to && {
                        lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
                    }),
                },
            }
            : {}),
    };
    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            include: { items: true },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.order.count({ where }),
    ]);
    return {
        orders,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
// ============================================================
// GET SINGLE ORDER
// ============================================================
const getOrderById = async (userId, orderId) => {
    const business = await getBusinessOrThrow(userId);
    return getOrderOrThrow(orderId, business.id);
};
// ============================================================
// UPDATE ORDER STATUS
// PRD: manual status updates by seller
// ============================================================
const updateOrderStatus = async (userId, orderId, status) => {
    const business = await getBusinessOrThrow(userId);
    await getOrderOrThrow(orderId, business.id);
    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: { items: true },
    });
    // Notify the customer if they provided an email and the status is meaningful
    if (["PROCESSING", "COMPLETED", "CANCELLED"].includes(status)) {
        const business = await prisma.business.findUnique({
            where: { id: updatedOrder.businessId },
        });
        await (0, email_service_1.notifyCustomerOrderStatusUpdated)({
            customerEmail: updatedOrder.customerEmail,
            businessName: business.name,
            order: updatedOrder,
        });
    }
    return updatedOrder;
};
// ============================================================
// EXPORT ORDERS AS CSV
// PRD: customer data exportable as CSV
// ============================================================
const exportOrdersAsCsv = async (userId, query) => {
    const business = await getBusinessOrThrow(userId);
    const { status, paymentStatus, customerName, from, to } = query;
    const orders = await prisma.order.findMany({
        where: {
            businessId: business.id,
            ...(status && { status }),
            ...(paymentStatus && { paymentStatus }),
            ...(customerName && {
                customerName: { contains: customerName, mode: "insensitive" },
            }),
            ...(from || to
                ? {
                    createdAt: {
                        ...(from && { gte: new Date(from) }),
                        ...(to && {
                            lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
                        }),
                    },
                }
                : {}),
        },
        include: { items: true },
        orderBy: { createdAt: "desc" },
    });
    const rows = orders.flatMap((order) => order.items.map((item) => ({
        "Order ID": order.id,
        "Customer Name": order.customerName,
        "Customer Phone": order.customerPhone,
        "Customer Email": order.customerEmail || "",
        "Delivery Address": order.deliveryAddress || "",
        "Item Name": item.itemName,
        "Item Type": item.itemType,
        Quantity: item.quantity,
        "Unit Price (₦)": Number(item.unitPrice).toFixed(2),
        "Subtotal (₦)": Number(item.subtotal).toFixed(2),
        "Order Total (₦)": Number(order.totalAmount).toFixed(2),
        "Order Status": order.status,
        "Payment Status": order.paymentStatus,
        Date: new Date(order.createdAt).toLocaleString("en-NG", {
            timeZone: "Africa/Lagos",
        }),
    })));
    const parser = new plainjs_1.Parser();
    const csv = parser.parse(rows);
    return csv;
};
// ============================================================
// EXPORT ORDERS AS PDF
// PRD: customer data exportable as PDF
// ============================================================
const exportOrdersAsPdf = async (userId, query) => {
    const business = await getBusinessOrThrow(userId);
    const { status, paymentStatus, customerName, from, to } = query;
    const orders = await prisma.order.findMany({
        where: {
            businessId: business.id,
            ...(status && { status }),
            ...(paymentStatus && { paymentStatus }),
            ...(customerName && {
                customerName: { contains: customerName, mode: "insensitive" },
            }),
            ...(from || to
                ? {
                    createdAt: {
                        ...(from && { gte: new Date(from) }),
                        ...(to && {
                            lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
                        }),
                    },
                }
                : {}),
        },
        include: { items: true },
        orderBy: { createdAt: "desc" },
    });
    return new Promise((resolve, reject) => {
        const doc = new pdfkit_1.default({ margin: 40, size: "A4" });
        const buffers = [];
        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", reject);
        // Header
        doc
            .fontSize(18)
            .font("Helvetica-Bold")
            .text(`${business.name} — Orders Export`, { align: "center" });
        doc
            .fontSize(10)
            .font("Helvetica")
            .text(`Generated: ${new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}`, {
            align: "center",
        });
        doc.moveDown(1.5);
        if (orders.length === 0) {
            doc
                .fontSize(12)
                .text("No orders found for the selected filters.", { align: "center" });
            doc.end();
            return;
        }
        // Orders
        orders.forEach((order, index) => {
            // Order header
            doc
                .fontSize(11)
                .font("Helvetica-Bold")
                .text(`Order #${index + 1}`);
            doc.fontSize(9).font("Helvetica");
            doc.text(`ID: ${order.id}`);
            doc.text(`Customer: ${order.customerName}  |  Phone: ${order.customerPhone}`);
            if (order.customerEmail)
                doc.text(`Email: ${order.customerEmail}`);
            if (order.deliveryAddress)
                doc.text(`Delivery: ${order.deliveryAddress}`);
            doc.text(`Status: ${order.status}  |  Payment: ${order.paymentStatus}  |  Date: ${new Date(order.createdAt).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}`);
            doc.moveDown(0.5);
            // Items table header
            doc.font("Helvetica-Bold").fontSize(9);
            doc.text("Item", 40, doc.y, { width: 200, continued: true });
            doc.text("Type", { width: 70, continued: true });
            doc.text("Qty", { width: 40, continued: true });
            doc.text("Unit Price", { width: 80, continued: true });
            doc.text("Subtotal", { width: 80 });
            doc
                .moveTo(40, doc.y)
                .lineTo(555, doc.y)
                .strokeColor("#cccccc")
                .lineWidth(0.5)
                .stroke();
            // Items rows
            doc.font("Helvetica").fontSize(9);
            order.items.forEach((item) => {
                const y = doc.y + 2;
                doc.text(item.itemName, 40, y, { width: 200, continued: true });
                doc.text(item.itemType, { width: 70, continued: true });
                doc.text(String(item.quantity), { width: 40, continued: true });
                doc.text(`₦${Number(item.unitPrice).toFixed(2)}`, {
                    width: 80,
                    continued: true,
                });
                doc.text(`₦${Number(item.subtotal).toFixed(2)}`, { width: 80 });
            });
            // Order total
            doc.moveDown(0.3);
            doc
                .font("Helvetica-Bold")
                .fontSize(9)
                .text(`Total: ₦${Number(order.totalAmount).toFixed(2)}`, {
                align: "right",
            });
            // Divider between orders
            if (index < orders.length - 1) {
                doc.moveDown(0.5);
                doc
                    .moveTo(40, doc.y)
                    .lineTo(555, doc.y)
                    .strokeColor("#999999")
                    .lineWidth(1)
                    .stroke();
                doc.moveDown(0.8);
            }
            // Page break if near bottom
            if (doc.y > 700 && index < orders.length - 1) {
                doc.addPage();
            }
        });
        doc.end();
    });
};
const orderService = {
    getOrders,
    getOrderById,
    updateOrderStatus,
    exportOrdersAsCsv,
    exportOrdersAsPdf,
};
exports.default = orderService;
