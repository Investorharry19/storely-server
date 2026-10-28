import checkoutService from "./checkout.service";
import { initializeCheckoutSchema } from "./checkout.validation";
import { Request, Response } from "express";
/**
 * POST /api/checkout
 * Customer initiates a purchase — creates the order and returns a Paystack URL.
 */
const initializeCheckout = async (req: Request | any, res: Response) => {
  const parsed = initializeCheckoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await checkoutService.initializeCheckout(parsed.data);

  return res.status(201).json({
    success: true,
    message: "Order created. Proceed to payment.",
    data: {
      orderId: result.order.id,
      totalAmount: result.order.totalAmount,
      paymentUrl: result.payment.authorizationUrl,
      reference: result.payment.reference,
    },
  });
};

/**
 * GET /api/checkout/verify?orderId=xxx
 * Called after customer returns from Paystack payment page.
 */
const verifyPayment = async (req: Request | any, res: Response) => {
  const reference =
    (req.query.reference as string) || (req.query.orderId as string);

  if (!reference) {
    return res
      .status(400)
      .json({ success: false, message: "Reference or orderId is required" });
  }

  const result = await checkoutService.verifyPayment(reference);

  if (result.success) {
    return res.status(200).json({
      success: true,
      message: "Payment confirmed. Your order has been received.",
      data: { orderId: result.order.id, status: result.order.status },
    });
  }

  if (result.status === "PENDING") {
    return res.status(202).json({
      success: false,
      message: "Payment is still being processed.",
      data: { orderId: result.order.id, status: "PENDING" },
    });
  }

  return res.status(402).json({
    success: false,
    message: "Payment was not successful. Please try again.",
    data: { orderId: result.order.id, status: result.order.paymentStatus },
  });
};

/**
 * POST /api/checkout/webhook
 * Paystack webhook — must use raw body for signature verification.
 */
const handleWebhook = async (req: Request | any, res: Response) => {
  const signature = req.headers["x-paystack-signature"];

  if (!signature) {
    return res
      .status(400)
      .json({ success: false, message: "Missing signature" });
  }

  await checkoutService.handleWebhook(req.rawBody, signature);

  // Always return 200 to Paystack immediately
  return res.status(200).json({ received: true });
};

const controller = { initializeCheckout, verifyPayment, handleWebhook };

export default controller;
