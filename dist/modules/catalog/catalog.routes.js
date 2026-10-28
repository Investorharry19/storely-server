"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const catalog_controller_1 = __importDefault(require("./catalog.controller"));
const upload_1 = require("../../middlewares/upload");
// ============================================================
// PRODUCT ROUTES
// ============================================================
// POST   /api/catalog/products             — create a product
// GET    /api/catalog/products             — get all my products
// GET    /api/catalog/products/:productId  — get single product
// PATCH  /api/catalog/products/:productId  — update product
// DELETE /api/catalog/products/:productId  — delete product
// PATCH  /api/catalog/products/bulk/visibility — bulk show/hide
// DELETE /api/catalog/products/bulk        — bulk delete
/**
 * @swagger
 * tags:
 *   name: Catalog
 *   description: Product and service catalog APIs
 */
/**
 * @swagger
 * /catalog/products:
 *   post:
 *     summary: Create a product
 *     tags: [Catalog]
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
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               stockQuantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/products", auth_middleware_1.authenticate, upload_1.upload.array("images", 5), (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.createProduct));
/**
 * @swagger
 * /catalog/products:
 *   get:
 *     summary: Get all my products
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get("/products", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.getMyProducts));
/**
 * @swagger
 * /catalog/products/{productId}:
 *   get:
 *     summary: Get single product
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 */
router.get("/products/:productId", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.getProductById));
/**
 * @swagger
 * /catalog/products/{productId}:
 *   patch:
 *     summary: Update product
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.patch("/products/:productId", auth_middleware_1.authenticate, upload_1.upload.array("images", 5), (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.updateProduct));
/**
 * @swagger
 * /catalog/products/{productId}:
 *   delete:
 *     summary: Delete product
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete("/products/:productId", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.deleteProduct));
/**
 * @swagger
 * /catalog/products/bulk/visibility:
 *   patch:
 *     summary: Bulk show/hide products
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Visibility updated successfully
 */
router.patch("/products/bulk/visibility", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.bulkUpdateProducts));
/**
 * @swagger
 * /catalog/products/bulk:
 *   delete:
 *     summary: Bulk delete products
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Products deleted successfully
 */
router.delete("/products/bulk", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.bulkDeleteProducts));
// ============================================================
// SERVICE ROUTES
// ============================================================
// POST   /api/catalog/services             — create a service
// GET    /api/catalog/services             — get all my services
// GET    /api/catalog/services/:serviceId  — get single service
// PATCH  /api/catalog/services/:serviceId  — update service
// DELETE /api/catalog/services/:serviceId  — delete service
// PATCH  /api/catalog/services/bulk/visibility — bulk show/hide
// DELETE /api/catalog/services/bulk        — bulk delete
/**
 * @swagger
 * /catalog/services:
 *   post:
 *     summary: Create a service
 *     tags: [Catalog]
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
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Service created successfully
 */
router.post("/services", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.createService));
/**
 * @swagger
 * /catalog/services:
 *   get:
 *     summary: Get all my services
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 */
router.get("/services", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.getMyServices));
/**
 * @swagger
 * /catalog/services/{serviceId}:
 *   get:
 *     summary: Get single service
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 */
router.get("/services/:serviceId", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.getServiceById));
/**
 * @swagger
 * /catalog/services/{serviceId}:
 *   patch:
 *     summary: Update service
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Service updated successfully
 */
router.patch("/services/:serviceId", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.updateService));
/**
 * @swagger
 * /catalog/services/{serviceId}:
 *   delete:
 *     summary: Delete service
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 */
router.delete("/services/:serviceId", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.deleteService));
/**
 * @swagger
 * /catalog/services/bulk/visibility:
 *   patch:
 *     summary: Bulk show/hide services
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Visibility updated successfully
 */
router.patch("/services/bulk/visibility", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.bulkUpdateServices));
/**
 * @swagger
 * /catalog/services/bulk:
 *   delete:
 *     summary: Bulk delete services
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Services deleted successfully
 */
router.delete("/services/bulk", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(catalog_controller_1.default.bulkDeleteServices));
const catalogRoutes = router;
exports.default = catalogRoutes;
