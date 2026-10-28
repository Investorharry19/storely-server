import { PaymentStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getBusiness = async (userId: string) => {
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) {
    const error: Error & { statusCode?: number } = new Error(
      "Business profile not found",
    );
    error.statusCode = 404;
    throw error;
  }
  return business;
};

const getPayments = async (
  userId: string,
  query: { page: number; limit: number; status?: string },
) => {
  const business = await getBusiness(userId);
  const parsedStatus =
    query.status &&
    Object.values(PaymentStatus).includes(query.status as PaymentStatus)
      ? (query.status as PaymentStatus)
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

const getSummary = async (userId: string) => {
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

export default { getPayments, getSummary };
