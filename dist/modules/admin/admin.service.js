"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ============================================================
// HELPERS
// ============================================================
const paginate = (page = 1, limit = 20) => ({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
});
// ============================================================
// DASHBOARD METRICS
// GET /api/admin/metrics/dashboard
// ============================================================
const getDashboardMetrics = async () => {
    const [totalStores, pendingUsers, totalOrders, totalCustomers, revenueResult, pendingPayments, completedPayments,] = await Promise.all([
        prisma.business.count({ where: { isActive: true } }),
        prisma.user.count({ where: { status: "PENDING", role: "USER" } }),
        prisma.order.count(),
        prisma.user.count({ where: { role: "USER" } }),
        prisma.payment.aggregate({
            where: { status: "PAID" },
            _sum: { amount: true },
        }),
        prisma.payment.count({ where: { status: "PENDING" } }),
        prisma.payment.count({ where: { status: "PAID" } }),
    ]);
    return {
        totalStores,
        pendingUsers,
        totalOrders,
        totalCustomers,
        totalRevenue: Number(revenueResult._sum.amount ?? 0),
        pendingPayments,
        completedPayments,
    };
};
// ============================================================
// USERS
// ============================================================
const getPendingUsers = async ({ page, limit, }) => {
    const where = { status: client_1.UserStatus.PENDING, role: client_1.UserRole.USER };
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy: { createdAt: "desc" },
            ...paginate(page, limit),
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                status: true,
                isVerified: true,
                createdAt: true,
                business: {
                    select: { name: true, category: true, type: true },
                },
            },
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
const getAllUsers = async ({ page, limit, status, search, }) => {
    const where = {
        role: client_1.UserRole.USER,
        ...(status && { status }),
        ...(search && {
            OR: [
                { fullName: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                { email: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
            ],
        }),
    };
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy: { createdAt: "desc" },
            ...paginate(page, limit),
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                status: true,
                role: true,
                isVerified: true,
                createdAt: true,
                business: {
                    select: {
                        name: true,
                        slug: true,
                        category: true,
                        type: true,
                        isActive: true,
                    },
                },
            },
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
const getUserDetail = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            status: true,
            role: true,
            isVerified: true,
            createdAt: true,
            business: {
                select: {
                    name: true,
                    slug: true,
                    category: true,
                    type: true,
                    isActive: true,
                    createdAt: true,
                },
            },
        },
    });
    return user;
};
const approveUser = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    if (user.status === "APPROVED") {
        const error = new Error("User is already approved");
        error.statusCode = 409;
        throw error;
    }
    return prisma.user.update({
        where: { id: userId },
        data: { status: "APPROVED" },
        select: { id: true, fullName: true, email: true, status: true },
    });
};
const rejectUser = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    if (user.status === "REJECTED") {
        const error = new Error("User is already rejected");
        error.statusCode = 409;
        throw error;
    }
    return prisma.user.update({
        where: { id: userId },
        data: { status: "REJECTED" },
        select: { id: true, fullName: true, email: true, status: true },
    });
};
// ============================================================
// ORDERS
// ============================================================
const getRecentOrders = async ({ page, limit, }) => {
    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            ...paginate(page, limit),
            include: {
                items: {
                    select: {
                        itemName: true,
                        quantity: true,
                        subtotal: true,
                        itemType: true,
                    },
                },
                business: { select: { name: true, slug: true } },
            },
        }),
        prisma.order.count(),
    ]);
    return {
        orders,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};
const getOrderDetail = async (orderId) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: true,
            business: {
                select: { name: true, slug: true, phone: true, email: true },
            },
            payment: true,
        },
    });
    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }
    return order;
};
// ============================================================
// ALL ORDERS
// ============================================================
const getAllOrders = async ({ page, limit, status, search, }) => {
    const where = {
        ...(status && { status }),
        ...(search && {
            OR: [
                { customerName: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                { customerEmail: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                { customerPhone: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
            ],
        }),
    };
    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            orderBy: { createdAt: "desc" },
            ...paginate(page, limit),
            include: {
                items: {
                    select: {
                        itemName: true,
                        quantity: true,
                        subtotal: true,
                        itemType: true,
                    },
                },
                business: { select: { name: true, slug: true } },
                payment: {
                    select: { id: true, amount: true, status: true, method: true },
                },
            },
        }),
        prisma.order.count({ where }),
    ]);
    return {
        orders,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};
// ============================================================
// PAYMENTS
// ============================================================
const getTransactions = async ({ page, limit, status, }) => {
    const where = { ...(status && { status }) };
    const [payments, total] = await Promise.all([
        prisma.payment.findMany({
            where,
            orderBy: { createdAt: "desc" },
            ...paginate(page, limit),
            include: {
                order: {
                    select: {
                        customerName: true,
                        customerPhone: true,
                        customerEmail: true,
                    },
                },
                business: { select: { name: true, slug: true } },
            },
        }),
        prisma.payment.count({ where }),
    ]);
    return {
        payments,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};
const refundPayment = async (paymentId) => {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { order: true },
    });
    if (!payment) {
        const error = new Error("Payment not found");
        error.statusCode = 404;
        throw error;
    }
    if (payment.status !== "PAID") {
        const error = new Error("Only successful payments can be refunded");
        error.statusCode = 400;
        throw error;
    }
    if (payment.refundedAt) {
        const error = new Error("Payment has already been refunded");
        error.statusCode = 409;
        throw error;
    }
    // Call Paystack refund API
    const axios = require("axios");
    await axios.post("https://api.paystack.co/refund", { transaction: payment.paystackRef }, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } });
    // Update payment and order status in a transaction
    const [updatedPayment] = await prisma.$transaction([
        prisma.payment.update({
            where: { id: paymentId },
            data: { status: "FAILED", refundedAt: new Date() },
        }),
        prisma.order.update({
            where: { id: payment.orderId },
            data: { status: "CANCELLED", paymentStatus: "FAILED" },
        }),
    ]);
    return updatedPayment;
};
// ============================================================
// REVENUE (PAYMENT DETAIL)
// ============================================================
const getAllRevenue = async ({ page, limit, status, }) => {
    const where = {
        ...(status && { status }),
    };
    const [payments, total, aggregation] = await Promise.all([
        prisma.payment.findMany({
            where,
            orderBy: { createdAt: "desc" },
            ...paginate(page, limit),
            include: {
                order: {
                    select: {
                        id: true,
                        customerName: true,
                        customerPhone: true,
                        customerEmail: true,
                        totalAmount: true,
                        status: true,
                    },
                },
                business: { select: { name: true, slug: true } },
            },
        }),
        prisma.payment.count({ where }),
        prisma.payment.aggregate({
            where,
            _sum: { amount: true },
        }),
    ]);
    return {
        payments,
        totalRevenue: Number(aggregation._sum.amount ?? 0),
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};
const getRevenueDetail = async (paymentId) => {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
            order: {
                include: {
                    items: true,
                },
            },
            business: {
                select: { name: true, slug: true, phone: true, email: true },
            },
            user: {
                select: { id: true, fullName: true, email: true, phone: true },
            },
        },
    });
    if (!payment) {
        const error = new Error("Revenue record not found");
        error.statusCode = 404;
        throw error;
    }
    return payment;
};
// ============================================================
// SUPPORT TICKETS
// ============================================================
const getPaymentIssues = async ({ page, limit, }) => {
    const where = { ticketType: client_1.TicketType };
    const [tickets, total] = await Promise.all([
        prisma.supportTicket.findMany({
            where,
            orderBy: { createdAt: "desc" },
            ...paginate(page, limit),
            include: {
                user: { select: { fullName: true, email: true, phone: true } },
                payment: {
                    select: {
                        amount: true,
                        status: true,
                        method: true,
                        paystackRef: true,
                        refundedAt: true,
                    },
                },
            },
        }),
        prisma.supportTicket.count({ where }),
    ]);
    return {
        tickets,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};
const getPlatformTickets = async ({ page, limit, status, }) => {
    const where = {
        ticketType: client_1.TicketType,
        ...(status && { status }),
    };
    const [tickets, total] = await Promise.all([
        prisma.supportTicket.findMany({
            where,
            orderBy: { createdAt: "desc" },
            ...paginate(page, limit),
            include: {
                user: { select: { fullName: true, email: true } },
            },
        }),
        prisma.supportTicket.count({ where }),
    ]);
    return {
        tickets,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};
const resolveTicket = async (ticketId, { status, assignedTo, }) => {
    const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
    });
    if (!ticket) {
        const error = new Error("Support ticket not found");
        error.statusCode = 404;
        throw error;
    }
    if (ticket.status === "RESOLVED") {
        const error = new Error("Ticket is already resolved");
        error.statusCode = 409;
        throw error;
    }
    return prisma.supportTicket.update({
        where: { id: ticketId },
        data: {
            status,
            ...(assignedTo && { assignedTo }),
            ...(status === "RESOLVED" && { resolvedAt: new Date() }),
        },
    });
};
const adminService = {
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
exports.default = adminService;
