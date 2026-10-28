import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/client";
import { responseFailure, responseSuccess } from "../../utils/response";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { PaymentStatus } from "@prisma/client";

export const getBusinessAnalyticsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const businessId = req.params.id; // Correctly typed as string usually, but let's ensure

    // Check ownership
    const business = await prisma.business.findFirst({
      where: {
        id: businessId as string,
        user: { id: req.user.id },
      },
    });

    if (!business) {
      return responseFailure(res, " Business not found or access denied", 404);
    }

    // 1. Total Orders
    const totalOrders = await prisma.order.count({
      where: { businessId: businessId as string },
    });

    // 2. Total Revenue (sum of PAID orders)
    const revenueAggregate = await prisma.order.aggregate({
      where: {
        businessId: businessId as string,
        paymentStatus: PaymentStatus.PAID,
      },
      _sum: {
        totalAmount: true,
      },
    });
    const totalRevenue = revenueAggregate._sum?.totalAmount || 0; // Use optional chaining

    // 3. Recent Transactions (Orders)
    const recentTransactions = await prisma.order.findMany({
      where: { businessId: businessId as string },
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

    return responseSuccess(
      res,
      "Analytics fetched successfully",
      {
        totalOrders,
        totalRevenue,
        recentTransactions,
      },
      200,
    );
  } catch (error) {
    next(error);
  }
};
