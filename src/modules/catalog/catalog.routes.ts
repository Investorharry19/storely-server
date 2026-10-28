import { Router } from "express";
const router = Router();
import { asyncHandler } from "../../middlewares/asyncHandler";
import { authenticate } from "../../middlewares/auth.middleware";
import controller from "./catalog.controller";
import { upload } from "../../middlewares/upload";

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
router.post(
  "/products",
  authenticate,
  upload.array("images", 5),
  asyncHandler(controller.createProduct),
);
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
router.get("/products", authenticate, asyncHandler(controller.getMyProducts));
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
router.get(
  "/products/:productId",
  authenticate,
  asyncHandler(controller.getProductById),
);
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
router.patch(
  "/products/:productId",
  authenticate,
  upload.array("images", 5),
  asyncHandler(controller.updateProduct),
);
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
router.delete(
  "/products/:productId",
  authenticate,
  asyncHandler(controller.deleteProduct),
);
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
router.patch(
  "/products/bulk/visibility",
  authenticate,
  asyncHandler(controller.bulkUpdateProducts),
);
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
router.delete(
  "/products/bulk",
  authenticate,
  asyncHandler(controller.bulkDeleteProducts),
);

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
router.post("/services", authenticate, asyncHandler(controller.createService));
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
router.get("/services", authenticate, asyncHandler(controller.getMyServices));
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
router.get(
  "/services/:serviceId",
  authenticate,
  asyncHandler(controller.getServiceById),
);
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
router.patch(
  "/services/:serviceId",
  authenticate,
  asyncHandler(controller.updateService),
);
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
router.delete(
  "/services/:serviceId",
  authenticate,
  asyncHandler(controller.deleteService),
);
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
router.patch(
  "/services/bulk/visibility",
  authenticate,
  asyncHandler(controller.bulkUpdateServices),
);
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
router.delete(
  "/services/bulk",
  authenticate,
  asyncHandler(controller.bulkDeleteServices),
);

const catalogRoutes = router;

export default catalogRoutes;
