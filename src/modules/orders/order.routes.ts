import { Router } from "express";
const router = Router();
import { asyncHandler } from "../../middlewares/asyncHandler";
import { authenticate } from "../../middlewares/auth.middleware";
import { exportLimiter } from "../../middlewares/rateLimiter";

import controller from "./order.controller";
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
router.get("/", authenticate, asyncHandler(controller.getOrders));
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
router.get(
  "/export/csv",
  authenticate,
  exportLimiter,
  asyncHandler(controller.exportCsv),
);
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
router.get(
  "/export/pdf",
  authenticate,
  exportLimiter,
  asyncHandler(controller.exportPdf),
);
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
router.get("/:orderId", authenticate, asyncHandler(controller.getOrderById));
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
router.patch(
  "/:orderId/status",
  authenticate,
  asyncHandler(controller.updateOrderStatus),
);

const orderRoutes = router;
export default orderRoutes;
