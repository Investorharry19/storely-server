"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBusinessAnalyticsController = void 0;
const client_1 = require("../../prisma/client");
const response_1 = require("../../utils/response");
const client_2 = require("@prisma/client");
const getBusinessAnalyticsController = async (req, res, next) => {
    try {
        const businessId = req.params.id; // Correctly typed as string usually, but let's ensure
        // Check ownership
        const business = await client_1.prisma.business.findFirst({
            where: {
                id: businessId,
                user: { id: req.user.id },
            },
        });
        if (!business) {
            return (0, response_1.responseFailure)(res, " Business not found or access denied", 404);
        }
        // 1. Total Orders
        const totalOrders = await client_1.prisma.order.count({
            where: { businessId: businessId },
        });
        // 2. Total Revenue (sum of PAID orders)
        const revenueAggregate = await client_1.prisma.order.aggregate({
            where: {
                businessId: businessId,
                paymentStatus: client_2.PaymentStatus.PAID,
            },
            _sum: {
                totalAmount: true,
            },
        });
        const totalRevenue = revenueAggregate._sum?.totalAmount || 0; // Use optional chaining
        // 3. Recent Transactions (Orders)
        const recentTransactions = await client_1.prisma.order.findMany({
            where: { businessId: businessId },
            orderBy: { createdAt: "desc" },
            take: 10,
            include: {
                items: {
                    include: {
                        product: true,
                        service: true,
                    },
                },
            },
        });
        return (0, response_1.responseSuccess)(res, "Analytics fetched successfully", {
            totalOrders,
            totalRevenue,
            recentTransactions,
        }, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.getBusinessAnalyticsController = getBusinessAnalyticsController;
