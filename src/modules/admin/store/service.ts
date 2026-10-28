import { prisma } from "../../../prisma/client";
import actionService from "../action.service";
import {
  notifySellerAdminMessage,
  notifySellerAccountSuspended,
} from "../../../notifications/email.service";

const paginate = (page = 1, limit = 20) => ({
  skip: (Number(page) - 1) * Number(limit),
  take: Number(limit),
});

const getStores = async ({ page, limit }: { page: number; limit: number }) => {
  const where = {};
  const [stores, total] = await Promise.all([
    prisma.business.findMany({
      where,
      orderBy: { createdAt: "desc" },
      ...paginate(page, limit),
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
      },
    }),
    prisma.business.count({ where }),
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

const getStoreById = async (storeId: string) => {
  return prisma.business.findUnique({
    where: { id: storeId },
    include: {
      user: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
    },
  });
};

const getStoreProducts = async (storeId: string) => {
  return prisma.product.findMany({
    where: { businessId: storeId },
    orderBy: { createdAt: "desc" },
  });
};

const getStoreOrders = async (storeId: string) => {
  return prisma.order.findMany({
    where: { businessId: storeId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
};

const suspendStore = async (
  adminId: string,
  storeId: string,
  payload: { reason: string; noteToSeller: string },
) => {
  const business = await prisma.business.findUnique({
    where: { id: storeId },
    include: { user: true },
  });

  if (!business) throw new Error("Business not found");

  await prisma.business.update({
    where: { id: storeId },
    data: { isActive: false },
  });

  await actionService.logAdminAction({
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
  await notifySellerAccountSuspended({
    sellerEmail: business.user.email,
    businessName: business.name,
    reason: payload.reason,
    noteToSeller: payload.noteToSeller,
  });

  return business;
};

const verifyStore = async (adminId: string, storeId: string) => {
  const business = await prisma.business.update({
    where: { id: storeId },
    data: { isActive: true },
  });

  await actionService.logAdminAction({
    adminId,
    action: "VERIFY_STORE",
    entityType: "STORE",
    entityId: storeId,
    details: {},
  });

  return business;
};

const sendMessage = async (
  adminId: string,
  storeId: string,
  payload: { subject: string; message: string },
) => {
  const business = await prisma.business.findUnique({
    where: { id: storeId },
    select: {
      id: true,
      name: true,
      email: true,
      user: { select: { id: true, email: true, fullName: true } },
    },
  });

  if (!business) throw new Error("Business not found");

  await actionService.logAdminAction({
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
  await notifySellerAdminMessage({
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

const changePlan = async (adminId: string, storeId: string, plan: string) => {
  const business = await prisma.business.findUnique({
    where: { id: storeId },
    select: { id: true, name: true, email: true },
  });

  await actionService.logAdminAction({
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

export default {
  getStores,
  getStoreById,
  getStoreProducts,
  getStoreOrders,
  suspendStore,
  verifyStore,
  sendMessage,
  changePlan,
};
