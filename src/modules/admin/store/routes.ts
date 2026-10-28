import { Router } from "express";
import { asyncHandler } from "../../../middlewares/asyncHandler";
import { authenticate } from "../../../middlewares/auth.middleware";
import { authorizeAdmin } from "../../../middlewares/authorize.admin";
import controller from "./controller";

const router = Router();
const admin = [authenticate, authorizeAdmin];

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
router.get("/single/:id", ...admin, asyncHandler(controller.getStoreDetail));

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
router.get(
  "/products/:storeId",
  ...admin,
  asyncHandler(controller.getStoreProducts),
);

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
router.get(
  "/orders/:storeId",
  ...admin,
  asyncHandler(controller.getStoreOrders),
);

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
router.post(
  "/suspend/:storeId",
  ...admin,
  asyncHandler(controller.suspendStore),
);

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
router.post("/verify/:storeId", ...admin, asyncHandler(controller.verifyStore));

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
router.post(
  "/send-message/:storeId",
  ...admin,
  asyncHandler(controller.sendMessage),
);

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
router.post(
  "/change-plan/:storeId",
  ...admin,
  asyncHandler(controller.changePlan),
);

export default router;
