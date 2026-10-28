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
router.get("/single/:id", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.getUserDetail));
/**
 * @swagger
 * /admin/users/store/{userId}:
 *   get:
 *     summary: Get user's store details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Store details retrieved successfully
 */
router.get("/store/:userId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.getUserStore));
/**
 * @swagger
 * /admin/users/sessions/{userId}:
 *   get:
 *     summary: Get user's login sessions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User sessions retrieved successfully
 */
router.get("/sessions/:userId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.getUserSessions));
/**
 * @swagger
 * /admin/users/ban/{userId}:
 *   post:
 *     summary: Ban a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               noteToUser:
 *                 type: string
 *     responses:
 *       200:
 *         description: User banned successfully
 */
router.post("/ban/:userId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.banUser));
/**
 * @swagger
 * /admin/users/warn/{userId}:
 *   post:
 *     summary: Warn a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *               noteToUser:
 *                 type: string
 *     responses:
 *       200:
 *         description: User warned successfully
 */
router.post("/warn/:userId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.warnUser));
/**
 * @swagger
 * /admin/users/send-message/{userId}:
 *   post:
 *     summary: Send message to a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *         description: Message sent to user successfully
 */
router.post("/send-message/:userId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.sendMessage));
/**
 * @swagger
 * /admin/users/force-password-reset/{userId}:
 *   post:
 *     summary: Force password reset for a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Password reset forced successfully
 */
router.post("/force-password-reset/:userId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.forcePasswordReset));
/**
 * @swagger
 * /admin/users/change-plan/{userId}:
 *   post:
 *     summary: Change user's plan
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
router.post("/change-plan/:userId", ...admin, (0, asyncHandler_1.asyncHandler)(controller_1.default.changePlan));
exports.default = router;
