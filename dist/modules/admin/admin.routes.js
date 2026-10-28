"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorize_admin_1 = require("../../middlewares/authorize.admin");
const admin_controller_1 = __importDefault(require("./admin.controller"));
const controller_1 = __importDefault(require("./store/controller"));
const routes_1 = __importDefault(require("./store/routes"));
const controller_2 = __importDefault(require("./users/controller"));
const routes_2 = __importDefault(require("./users/routes"));
// All admin routes require both authenticate AND authorizeAdmin
const admin = [auth_middleware_1.authenticate, authorize_admin_1.authorizeAdmin];
// ── Dashboard ────────────────────────────────────────────────
/**
 * @swagger
 * /admin/metrics/dashboard:
 *   get:
 *     summary: Get dashboard metrics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics retrieved successfully
 */
router.get("/metrics/dashboard", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.getDashboardMetrics));
// ── Users ────────────────────────────────────────────────────
/**
 * @swagger
 * /admin/users/pending:
 *   get:
 *     summary: Get pending users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending users retrieved successfully
 */
router.get("/users/pending", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.getPendingUsers));
/**
 * @swagger
 * /admin/users/all:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: All users retrieved successfully
 */
router.get("/users/all", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.getAllUsers));
/**
 * @swagger
 * /admin/users/single/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/users/single/:id", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.getUserDetail));
/**
 * @swagger
 * /admin/users/approve:
 *   post:
 *     summary: Approve a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User approved successfully
 */
router.post("/users/approve", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.approveUser));
/**
 * @swagger
 * /admin/users/reject:
 *   post:
 *     summary: Reject a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: User rejected successfully
 */
router.post("/users/reject", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.rejectUser));
// ── Orders ───────────────────────────────────────────────────
/**
 * @swagger
 * /admin/orders/recent:
 *   get:
 *     summary: Get recent orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent orders retrieved successfully
 */
router.get("/orders/recent", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.getRecentOrders));
/**
 * @swagger
 * /admin/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 */
router.get("/orders/:id", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.getOrderDetail));
/**
 * @swagger
 * /admin/orders-all:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [NEW, PROCESSING, COMPLETED, CANCELLED]
 *         description: Filter by order status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by customer name, email, or phone
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 */
router.get("/orders-all", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.getAllOrders));
// ── Payments ─────────────────────────────────────────────────
/**
 * @swagger
 * /admin/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 */
router.get("/payments", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.getTransactions));
/**
 * @swagger
 * /admin/payments/issues:
 *   get:
 *     summary: Get payment issues
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment issues retrieved successfully
 */
router.get("/payments/issues", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.getPaymentIssues));
/**
 * @swagger
 * /admin/payments/refund:
 *   post:
 *     summary: Refund a payment
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Payment refunded successfully
 */
router.post("/payments/refund", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.refundPayment));
// ── Revenue ─────────────────────────────────────────────────
/**
 * @swagger
 * /admin/revenue:
 *   get:
 *     summary: Get all revenue
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PAID, FAILED]
 *         description: Filter by payment status
 *     responses:
 *       200:
 *         description: Revenue data retrieved successfully
 */
router.get("/revenue", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.getAllRevenue));
/**
 * @swagger
 * /admin/revenue/{id}:
 *   get:
 *     summary: Get revenue detail by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Revenue detail retrieved successfully
 *       404:
 *         description: Revenue record not found
 */
router.get("/revenue/:id", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.getRevenueDetail));
// ── Support Tickets ──────────────────────────────────────────
/**
 * @swagger
 * /admin/support/tickets:
 *   get:
 *     summary: Get support tickets
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Support tickets retrieved successfully
 */
router.get("/support/tickets", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.getPlatformTickets));
/**
 * @swagger
 * /admin/support/tickets/resolve:
 *   post:
 *     summary: Resolve a support ticket
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket resolved successfully
 */
router.post("/support/tickets/resolve", ...admin, (0, asyncHandler_1.asyncHandler)(admin_controller_1.default.resolveTicket));
/**
 * @swagger
 * /admin/stores:
 *   get:
 *     summary: Get all stores
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Stores retrieved successfully
 */
router.get("/stores", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.getStores));
router.use("/store", routes_1.default);
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get("/users", ...admin, (0, asyncHandler_1.asyncHandler)(controller_2.default.getUsers));
router.use("/users", routes_2.default);
const adminRouter = router;
exports.default = adminRouter;
// UPDATE users SET role = 'ADMIN' WHERE email = 'admin@storely.app'; create new admin
