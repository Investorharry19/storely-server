import { Router } from "express";
const router = Router();
import { asyncHandler } from "../../middlewares/asyncHandler";
import { checkoutLimiter } from "../../middlewares/rateLimiter";
import controller from "./checkout.controller";

// POST /api/checkout         — customer initiates order + payment (rate limited)
// GET  /api/checkout/verify  — verify payment after redirect
// POST /api/checkout/webhook — Paystack webhook (no auth, raw body needed)

/**
 * @swagger
 * tags:
 *   name: Checkout
 *   description: Checkout and payment APIs
 */

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Initialize order and payment checkout
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *               email:
 *                 type: string
 *               businessSlug:
 *                 type: string
 *               customerName:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *               items:
 *                 type: []
 *     responses:
 *       200:
 *         description: Checkout initialized successfully
 */
router.post("/", checkoutLimiter, asyncHandler(controller.initializeCheckout));
/**
 * @swagger
 * /checkout/verify:
 *   get:
 *     summary: Verify payment after redirect
 *     tags: [Checkout]
 *     parameters:
 *       - in: query
 *         name: reference
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment reference
 *     responses:
 *       200:
 *         description: Payment verified successfully
 */
router.get("/verify", asyncHandler(controller.verifyPayment));
/**
 * @swagger
 * /checkout/webhook:
 *   post:
 *     summary: Payment gateway webhook
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 */
router.post("/webhook", asyncHandler(controller.handleWebhook));

const checkoutRoutes = router;

export default checkoutRoutes;
