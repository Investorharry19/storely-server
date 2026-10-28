import { Router } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler";
import { authenticate } from "../../../middlewares/auth.middleware";
import { authorizeAdmin } from "../../../middlewares/authorize.admin";
import controller from "./controller";

const router = Router();
const admin = [authenticate, authorizeAdmin];

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
router.get("/single/:id", ...admin, asyncHandler(controller.getUserDetail));

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
router.get("/store/:userId", ...admin, asyncHandler(controller.getUserStore));

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
router.get(
  "/sessions/:userId",
  ...admin,
  asyncHandler(controller.getUserSessions),
);

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
router.post("/ban/:userId", ...admin, asyncHandler(controller.banUser));

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
router.post("/warn/:userId", ...admin, asyncHandler(controller.warnUser));

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
router.post(
  "/send-message/:userId",
  ...admin,
  asyncHandler(controller.sendMessage),
);

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
router.post(
  "/force-password-reset/:userId",
  ...admin,
  asyncHandler(controller.forcePasswordReset),
);

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
router.post(
  "/change-plan/:userId",
  ...admin,
  asyncHandler(controller.changePlan),
);

export default router;
