"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../../middlewares/asyncHandler");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_admin_1 = require("../../../middlewares/authorize.admin");
const controller_1 = __importDefault(require("./controller"));
const router = (0, express_1.Router)();
const admin = [auth_middleware_1.authenticate, authorize_admin_1.authorizeAdmin];
/**
 * @swagger
 * /admin/store/single/{id}:
 *   get:
 *     summary: Get store details by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store details retrieved successfully
 *       404:
 *         description: Store not found
 */
router.get("/single/:id", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.getStoreDetail));
/**
 * @swagger
 * /admin/store/products/{storeId}:
 *   get:
 *     summary: Get store products
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store products retrieved successfully
 */
router.get("/products/:storeId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.getStoreProducts));
/**
 * @swagger
 * /admin/store/orders/{storeId}:
 *   get:
 *     summary: Get store orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store orders retrieved successfully
 */
router.get("/orders/:storeId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.getStoreOrders));
/**
 * @swagger
 * /admin/store/suspend/{storeId}:
 *   post:
 *     summary: Suspend a store
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               noteToStore:
 *                 type: string
 *     responses:
 *       200:
 *         description: Store suspended successfully
 */
router.post("/suspend/:storeId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.suspendStore));
/**
 * @swagger
 * /admin/store/verify/{storeId}:
 *   post:
 *     summary: Verify a store
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store verified successfully
 */
router.post("/verify/:storeId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.verifyStore));
/**
 * @swagger
 * /admin/store/send-message/{storeId}:
 *   post:
 *     summary: Send message to a store
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent to store successfully
 */
router.post("/send-message/:storeId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.sendMessage));
/**
 * @swagger
 * /admin/store/change-plan/{storeId}:
 *   post:
 *     summary: Change store's plan
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plan changed successfully
 */
router.post("/change-plan/:storeId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.changePlan));
exports.default = router;
