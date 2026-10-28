"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkout_service_1 = __importDefault(require("./checkout.service"));
const checkout_validation_1 = require("./checkout.validation");
/**
 * POST /api/checkout
 * Customer initiates a purchase — creates the order and returns a Paystack URL.
 */
const initializeCheckout = async (req, res) => {
    const parsed = checkout_validation_1.initializeCheckoutSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await checkout_service_1.default.initializeCheckout(parsed.data);
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
const verifyPayment = async (req, res) => {
    const reference = req.query.reference || req.query.orderId;
    if (!reference) {
        return res
            .status(400)
            .json({ success: false, message: "Reference or orderId is required" });
    }
    const result = await checkout_service_1.default.verifyPayment(reference);
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
const handleWebhook = async (req, res) => {
    const signature = req.headers["x-paystack-signature"];
    if (!signature) {
        return res
            .status(400)
            .json({ success: false, message: "Missing signature" });
    }
    await checkout_service_1.default.handleWebhook(req.rawBody, signature);
    // Always return 200 to Paystack immediately
    return res.status(200).json({ received: true });
};
const controller = { initializeCheckout, verifyPayment, handleWebhook };
exports.default = controller;
