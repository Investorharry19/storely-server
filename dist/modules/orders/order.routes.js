"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const rateLimiter_1 = require("../../middlewares/rateLimiter");
const order_controller_1 = __importDefault(require("./order.controller"));
// All order routes are private (seller only)
// GET    /api/orders                  — list orders (filter, search, paginate)
// GET    /api/orders/export/csv       — export orders as CSV (rate limited)
// GET    /api/orders/export/pdf       — export orders as PDF (rate limited)
// GET    /api/orders/:orderId         — get single order detail
// PATCH  /api/orders/:orderId/status  — update order status
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List orders (filter, search, paginate)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get("/", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(order_controller_1.default.getOrders));
/**
 * @swagger
 * /orders/export/csv:
 *   get:
 *     summary: Export orders as CSV
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file generated successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/export/csv", auth_middleware_1.authenticate, rateLimiter_1.exportLimiter, (0, asyncHandler_1.asyncHandler)(order_controller_1.default.exportCsv));
/**
 * @swagger
 * /orders/export/pdf:
 *   get:
 *     summary: Export orders as PDF
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF file generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/export/pdf", auth_middleware_1.authenticate, rateLimiter_1.exportLimiter, (0, asyncHandler_1.asyncHandler)(order_controller_1.default.exportPdf));
/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get single order detail
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 */
router.get("/:orderId", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(order_controller_1.default.getOrderById));
/**
 * @swagger
 * /orders/{orderId}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.patch("/:orderId/status", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(order_controller_1.default.updateOrderStatus));
const orderRoutes = router;
exports.default = orderRoutes;
