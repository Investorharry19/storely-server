"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getBusiness = async (userId) => {
    const business = await prisma.business.findUnique({ where: { userId } });
    if (!business) {
        const error = new Error("Business profile not found");
        error.statusCode = 404;
        throw error;
    }
    return business;
};
const getPayments = async (userId, query) => {
    const business = await getBusiness(userId);
    const parsedStatus = query.status &&
        Object.values(client_1.PaymentStatus).includes(query.status)
        ? query.status
        : undefined;
    const where = {
        businessId: business.id,
        ...(parsedStatus ? { status: parsedStatus } : {}),
    };
    const [payments, total] = await Promise.all([
        prisma.payment.findMany({
            where,
            include: { order: true },
            orderBy: { createdAt: "desc" },
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        }),
        prisma.payment.count({ where }),
    ]);
    return {
        payments,
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.ceil(total / query.limit),
        },
    };
};
const getSummary = async (userId) => {
    const business = await getBusiness(userId);
    const [paid, pending, failed] = await Promise.all([
        prisma.payment.aggregate({
            where: { businessId: business.id, status: "PAID" },
            _sum: { amount: true },
            _count: { _all: true },
        }),
        prisma.payment.count({
            where: { businessId: business.id, status: "PENDING" },
        }),
        prisma.payment.count({
            where: { businessId: business.id, status: "FAILED" },
        }),
    ]);
    return {
        paidAmount: Number(paid._sum.amount ?? 0),
        paidCount: paid._count._all,
        pendingCount: pending,
        failedCount: failed,
    };
};
exports.default = { getPayments, getSummary };
