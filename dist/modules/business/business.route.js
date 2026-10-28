"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const upload_1 = require("../../middlewares/upload");
const business_controller_1 = require("./business.controller");
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
router.post("/", auth_middleware_1.authenticate, upload_1.upload.single("logo"), (0, asyncHandler_1.asyncHandler)(business_controller_1.controller.createBusiness));
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
router.get("/me", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(business_controller_1.controller.getMyBusiness));
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
router.patch("/me", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(business_controller_1.controller.updateBusiness));
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
router.patch("/me/logo", auth_middleware_1.authenticate, upload_1.upload.single("logo"), (0, asyncHandler_1.asyncHandler)(business_controller_1.controller.updateLogo));
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
router.get("/:slug", (0, asyncHandler_1.asyncHandler)(business_controller_1.controller.getBusinessBySlug));
const businessRoutes = router;
exports.default = businessRoutes;
