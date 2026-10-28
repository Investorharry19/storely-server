import express from "express";
const router = express.Router();
import { asyncHandler } from "../../middlewares/asyncHandler";
import { authenticate } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload";
import { controller } from "./business.controller";

// ── Private routes (authenticated) ──────────────────────────

// POST /api/business — create business profile (onboarding)
/**
 * @swagger
 * tags:
 *   name: Business
 *   description: Business profile and storefront APIs
 */

/**
 * @swagger
 * /business:
 *   post:
 *     summary: Create business profile (onboarding)
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [PRODUCT, SERVICE, HYBRID]
 *                 example: PRODUCT
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               location:
 *                 type: string
 *
 *
 *     responses:
 *       201:
 *         description: Business created successfully
 */
router.post(
  "/",
  authenticate,
  upload.single("logo"),
  asyncHandler(controller.createBusiness),
);

// GET /api/business/me — get the logged-in user's business
/**
 * @swagger
 * /business/me:
 *   get:
 *     summary: Get the logged-in user's business
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Business details retrieved successfully
 */
router.get("/me", authenticate, asyncHandler(controller.getMyBusiness));

// PATCH /api/business/me — update business profile
/**
 * @swagger
 * /business/me:
 *   patch:
 *     summary: Update business profile
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Business updated successfully
 */
router.patch("/me", authenticate, asyncHandler(controller.updateBusiness));

// PATCH /api/business/me/logo — upload/replace logo
/**
 * @swagger
 * /business/me/logo:
 *   patch:
 *     summary: Upload/replace logo
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Logo updated successfully
 */
router.patch(
  "/me/logo",
  authenticate,
  upload.single("logo"),
  asyncHandler(controller.updateLogo),
);

// ── Public routes (no auth) ──────────────────────────────────

// GET /api/business/:slug — public storefront data
/**
 * @swagger
 * /business/{slug}:
 *   get:
 *     summary: Get public storefront data
 *     tags: [Business]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Business slug
 *     responses:
 *       200:
 *         description: Business details retrieved
 */
router.get("/:slug", asyncHandler(controller.getBusinessBySlug));

const businessRoutes = router;

export default businessRoutes;
