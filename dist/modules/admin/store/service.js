"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../../prisma/client");
const action_service_1 = __importDefault(require("../action.service"));
const email_service_1 = require("../../../notifications/email.service");
const paginate = (page = 1, limit = 20) => ({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
});
const getStores = async ({ page, limit }) => {
    const where = {};
    const [stores, total] = await Promise.all([
        client_1.prisma.business.findMany({
            where,
            orderBy: { createdAt: "desc" },
            ...paginate(page, limit),
            include: {
                user: {
                    select: { id: true, fullName: true, email: true, phone: true },
                },
            },
        }),
        client_1.prisma.business.count({ where }),
    ]);
    return {
        stores,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        },
    };
};
const getStoreById = async (storeId) => {
    return client_1.prisma.business.findUnique({
        where: { id: storeId },
        include: {
            user: {
                select: { id: true, fullName: true, email: true, phone: true },
            },
        },
    });
};
const getStoreProducts = async (storeId) => {
    return client_1.prisma.product.findMany({
        where: { businessId: storeId },
        orderBy: { createdAt: "desc" },
    });
};
const getStoreOrders = async (storeId) => {
    return client_1.prisma.order.findMany({
        where: { businessId: storeId },
        orderBy: { createdAt: "desc" },
        include: { items: true },
    });
};
const suspendStore = async (adminId, storeId, payload) => {
    const business = await client_1.prisma.business.findUnique({
        where: { id: storeId },
        include: { user: true },
    });
    if (!business)
        throw new Error("Business not found");
    await client_1.prisma.business.update({
        where: { id: storeId },
        data: { isActive: false },
    });
    await action_service_1.default.logAdminAction({
        adminId,
        action: "SUSPEND_STORE",
        entityType: "STORE",
        entityId: storeId,
        details: {
            reason: payload.reason,
            noteToSeller: payload.noteToSeller,
        },
    });
    // Send suspension email
    await (0, email_service_1.notifySellerAccountSuspended)({
        sellerEmail: business.user.email,
        businessName: business.name,
        reason: payload.reason,
        noteToSeller: payload.noteToSeller,
    });
    return business;
};
const verifyStore = async (adminId, storeId) => {
    const business = await client_1.prisma.business.update({
        where: { id: storeId },
        data: { isActive: true },
    });
    await action_service_1.default.logAdminAction({
        adminId,
        action: "VERIFY_STORE",
        entityType: "STORE",
        entityId: storeId,
        details: {},
    });
    return business;
};
const sendMessage = async (adminId, storeId, payload) => {
    const business = await client_1.prisma.business.findUnique({
        where: { id: storeId },
        select: {
            id: true,
            name: true,
            email: true,
            user: { select: { id: true, email: true, fullName: true } },
        },
    });
    if (!business)
        throw new Error("Business not found");
    await action_service_1.default.logAdminAction({
        adminId,
        action: "SEND_MESSAGE_STORE",
        entityType: "STORE",
        entityId: storeId,
        details: {
            subject: payload.subject,
            message: payload.message,
        },
    });
    // Send admin message email
    await (0, email_service_1.notifySellerAdminMessage)({
        sellerEmail: business.user.email,
        businessName: business.name,
        subject: payload.subject,
        message: payload.message,
    });
    return {
        target: business,
        subject: payload.subject,
        message: payload.message,
    };
};
const changePlan = async (adminId, storeId, plan) => {
    const business = await client_1.prisma.business.findUnique({
        where: { id: storeId },
        select: { id: true, name: true, email: true },
    });
    await action_service_1.default.logAdminAction({
        adminId,
        action: "CHANGE_PLAN_STORE",
        entityType: "STORE",
        entityId: storeId,
        details: { plan },
    });
    return {
        target: business,
        plan,
        note: "Plan change request recorded; update schema to persist plan selection.",
    };
};
exports.default = {
    getStores,
    getStoreById,
    getStoreProducts,
    getStoreOrders,
    suspendStore,
    verifyStore,
    sendMessage,
    changePlan,
};
