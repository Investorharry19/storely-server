import { Prisma, PrismaClient, ItemType } from "@prisma/client";
import crypto from "crypto";
import axios from "axios";
import {
  notifySellerNewOrder,
  notifySellerPaymentConfirmed,
  notifySellerPaymentFailed,
} from "../../notifications/email.service";
import { orderQuerySchema } from "../orders/order.validations";
import { initializeCheckoutSchema } from "./checkout.validation";
import { z } from "zod";

const prisma = new PrismaClient();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ============================================================
// HELPERS
// ============================================================

/**
 * Fetch and validate all items (products/services) from the DB.
 * Returns enriched item list with name, price, and availability.
 */
type DatabaseClient = PrismaClient | Prisma.TransactionClient;

const resolveOrderItems = async (
  db: DatabaseClient,
  items: any[],
  businessId: string,
) => {
  const resolved = [];

  for (const item of items) {
    if (item.itemType === "product") {
      const product = await db.product.findFirst({
        where: { id: item.itemId, businessId, isAvailable: true },
      });

      if (!product || product.stockQuantity < item.quantity) {
        const error: Error | any = new Error(
          !product
            ? `Product not found or unavailable: ${item.itemId}`
            : `Insufficient stock for product: ${product.name}`,
        );
        error.statusCode = 400;
        throw error;
      }

      // Reserve stock atomically with the order. The quantity predicate prevents
      // two concurrent checkouts from decrementing the same inventory below zero.
      const stockUpdate = await db.product.updateMany({
        where: {
          id: product.id,
          businessId,
          isAvailable: true,
          stockQuantity: { gte: item.quantity },
        },
        data: { stockQuantity: { decrement: item.quantity } },
      });

      if (stockUpdate.count !== 1) {
        const error: Error | any = new Error(
          `Insufficient stock for product: ${product.name}`,
        );
        error.statusCode = 400;
        throw error;
      }

      resolved.push({
        productId: product.id,
        serviceId: null,
        itemType: ItemType.PRODUCT,
        itemName: product.name,
        unitPrice: Number(product.price),
        quantity: item.quantity,
        subtotal: Number(product.price) * item.quantity,
      });
    } else {
      const service = await db.service.findFirst({
        where: { id: item.itemId, businessId, isAvailable: true },
      });

      if (!service) {
        const error: Error | any = new Error(
          `Service not found or unavailable: ${item.itemId}`,
        );
        error.statusCode = 400;
        throw error;
      }

      resolved.push({
        productId: null,
        serviceId: service.id,
        itemType: ItemType.SERVICE,
        itemName: service.name,
        unitPrice: Number(service.price),
        quantity: item.quantity,
        subtotal: Number(service.price) * item.quantity,
      });
    }
  }

  return resolved;
};

// ============================================================
// INITIALIZE CHECKOUT
// Creates the order (status: pending) then initializes Paystack.
// PRD: order is created before payment is confirmed.
// ============================================================
const initializeCheckout = async (
  data: z.infer<typeof initializeCheckoutSchema>,
) => {
  const business = await prisma.business.findUnique({
    where: { slug: data.businessSlug },
  });

  if (!business || !business.isActive) {
    const error: Error | any = new Error("Store not found");
    error.statusCode = 404;
    throw error;
  }

  // Create order + payment + items in a single transaction so the payment table is populated immediately.
  const order = await prisma.$transaction(async (tx) => {
    const resolvedItems = await resolveOrderItems(tx, data.items, business.id);
    const totalAmount = resolvedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    const newOrder = await tx.order.create({
      data: {
        businessId: business.id,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail ?? null,
        deliveryAddress: data.deliveryAddress ?? null,
        totalAmount,
        status: "NEW",
        paymentStatus: "PENDING",
        items: {
          create: resolvedItems.map((item) => ({
            productId: item.productId,
            serviceId: item.serviceId,
            itemType: item.itemType,
            itemName: item.itemName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })) as any,
        },
      },
      include: { items: true },
    });

    await tx.payment.create({
      data: {
        orderId: newOrder.id,
        businessId: business.id,
        amount: new Prisma.Decimal(totalAmount),
        status: "PENDING",
        method: null,
        paystackRef: newOrder.id,
      },
    });

    return newOrder;
  });

  // Initialize Paystack transaction
  const paystackResponse = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email: data.customerEmail || `${order.id}@storely.app`,
      amount: Math.round(Number(order.totalAmount) * 100), // Paystack expects kobo
      reference: order.id, // Use order ID as reference
      callback_url: `${FRONTEND_URL}/checkout/complete?reference=${order.id}`,
      metadata: {
        orderId: order.id,
        businessId: business.id,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    },
  );

  const { authorization_url, access_code, reference } =
    paystackResponse.data.data;

  // Notify the seller of the new order
  const sellerUser = await prisma.user.findUnique({
    where: { id: business.userId },
  });
  if (sellerUser?.email) {
    await notifySellerNewOrder({
      sellerEmail: sellerUser.email,
      businessName: business.name,
      order,
    });
  }

  return {
    order,
    payment: {
      authorizationUrl: authorization_url,
      accessCode: access_code,
      reference,
    },
  };
};

// ============================================================
// VERIFY PAYMENT
// Called after redirect from Paystack to confirm payment status.
// ============================================================
const verifyPayment = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    const error: Error | any = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  const paystackResponse = await axios.get(
    `https://api.paystack.co/transaction/verify/${orderId}`,
    {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    },
  );

  const { status, amount, channel } = paystackResponse.data.data;

  if (status === "success") {
    const paidAmount = Number(amount) / 100;
    if (paidAmount !== Number(order.totalAmount)) {
      const error: Error | any = new Error(
        "Payment amount does not match the order",
      );
      error.statusCode = 400;
      throw error;
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const orderUpdate = await tx.order.update({
        where: { id: orderId },
        data: { paymentStatus: "PAID", status: "PROCESSING" },
        include: { items: true },
      });

      await tx.payment.upsert({
        where: { orderId: orderId },
        update: {
          status: "PAID",
          amount: new Prisma.Decimal(paidAmount),
          method: channel || null,
          paystackRef: orderId,
        },
        create: {
          orderId: orderId,
          businessId: order.businessId,
          amount: new Prisma.Decimal(paidAmount),
          status: "PAID",
          method: channel || null,
          paystackRef: orderId,
        },
      });

      return orderUpdate;
    });

    return { success: true, order: updatedOrder };
  }

  if (status === "failed" || status === "abandoned" || status === "reversed") {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "FAILED" },
    });

    return { success: false, status: "FAILED", order };
  }

  return { success: false, status: "PENDING", order };
};

// ============================================================
// PAYSTACK WEBHOOK
// Listens for Paystack events and updates order status.
// PRD: no lost orders, retry failed payments.
// ============================================================
const handleWebhook = async (rawBody: any, signature: any) => {
  // Verify the webhook signature
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET as string)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    const error: Error | any = new Error("Invalid webhook signature");
    error.statusCode = 401;
    throw error;
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const { reference } = event.data;

    const order = await prisma.order.findUnique({
      where: { id: reference },
      include: { items: true },
    });
    if (!order) return;

    await prisma.$transaction(async (tx) => {
      if (order.paymentStatus !== "PAID") {
        await tx.order.update({
          where: { id: reference },
          data: { paymentStatus: "PAID", status: "PROCESSING" },
        });
      }

      await tx.payment.upsert({
        where: { orderId: reference },
        update: {
          status: "PAID",
          amount: new Prisma.Decimal(Number(event.data.amount) / 100),
          method: event.data.channel || null,
          paystackRef: event.data.reference,
        },
        create: {
          orderId: reference,
          businessId: order.businessId,
          amount: new Prisma.Decimal(Number(event.data.amount) / 100),
          status: "PAID",
          method: event.data.channel || null,
          paystackRef: event.data.reference,
        },
      });
    });

    // Notify seller — payment confirmed
    const business: any = await prisma.business.findUnique({
      where: { id: order.businessId },
    });
    const sellerUser = await prisma.user.findUnique({
      where: { id: business?.userId },
    });
    if (sellerUser?.email) {
      await notifySellerPaymentConfirmed({
        sellerEmail: sellerUser.email,
        businessName: business.name,
        order,
      });
    }
  }

  if (event.event === "charge.failed") {
    const { reference } = event.data;

    const order = await prisma.order.findUnique({
      where: { id: reference },
      include: { items: true },
    });
    if (!order) return;

    if (order.paymentStatus === "PENDING") {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: reference },
          data: { paymentStatus: "FAILED" },
        });

        await tx.payment.upsert({
          where: { orderId: reference },
          update: {
            status: "FAILED",
            amount: new Prisma.Decimal(Number(event.data.amount) / 100),
            method: event.data.channel || null,
            paystackRef: event.data.reference,
          },
          create: {
            orderId: reference,
            businessId: order.businessId,
            amount: new Prisma.Decimal(Number(event.data.amount) / 100),
            status: "FAILED",
            method: event.data.channel || null,
            paystackRef: event.data.reference,
          },
        });
      });

      // Notify seller — payment failed
      const business = await prisma.business.findUnique({
        where: { id: order.businessId },
      });
      const sellerUser = await prisma.user.findUnique({
        where: { id: business?.userId },
      });
      if (sellerUser?.email) {
        await notifySellerPaymentFailed({
          sellerEmail: sellerUser.email,
          businessName: business?.name,
          order,
        });
      }
    }
  }
};

const checkoutService = {
  initializeCheckout,
  verifyPayment,
  handleWebhook,
};

export default checkoutService;
