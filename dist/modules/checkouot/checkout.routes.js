"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const rateLimiter_1 = require("../../middlewares/rateLimiter");
const checkout_controller_1 = __importDefault(require("./checkout.controller"));
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
router.post("/", rateLimiter_1.checkoutLimiter, (0, asyncHandler_1.asyncHandler)(checkout_controller_1.default.initializeCheckout));
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
router.get("/verify", (0, asyncHandler_1.asyncHandler)(checkout_controller_1.default.verifyPayment));
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
router.post("/webhook", (0, asyncHandler_1.asyncHandler)(checkout_controller_1.default.handleWebhook));
const checkoutRoutes = router;
exports.default = checkoutRoutes;
