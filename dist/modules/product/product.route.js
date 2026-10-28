"use strict";
// import { Router } from "express";
// import {
//   createItemController,
//   updateItemController,
//   deleteItemController,
//   getItemsByBusinessController,
//   getSingleItemController,
// } from "./product.controller";
// import { authenticate } from "../../middlewares/auth.middleware";
// import { upload } from "../../middlewares/upload";
// export const productRoutes = Router();
// /**
//  * @swagger
//  * /api/v1/items:
//  *   post:
//  *     summary: Create a new item/product
//  *     tags: [Items]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - businessId
//  *               - name
//  *               - description
//  *               - price
//  *               - type
//  *             properties:
//  *               businessId:
//  *                 type: string
//  *                 description: Business ID
//  *               name:
//  *                 type: string
//  *                 description: Item name
//  *               description:
//  *                 type: string
//  *                 description: Item description
//  *               price:
//  *                 type: number
//  *                 description: Item price
//  *               type:
//  *                 type: string
//  *                 enum: [product, service]
//  *                 description: Item type
//  *               images:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                   format: binary
//  *                 description: Item images (max 5)
//  *     responses:
//  *       201:
//  *         description: Item created successfully
//  *       400:
//  *         description: Invalid request
//  *       401:
//  *         description: Unauthorized
//  */
// productRoutes.post(
//   "/",
//   authenticate,
//   upload.array("images", 5),
//   createItemController,
// );
// /**
//  * @swagger
//  * /api/v1/items/business:
//  *   get:
//  *     summary: Get all items for a business
//  *     tags: [Items]
//  *     parameters:
//  *       - in: query
//  *         name: businessId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Business ID
//  *     responses:
//  *       200:
//  *         description: Items fetched successfully
//  *       400:
//  *         description: Business ID required
//  */
// productRoutes.get("/business", getItemsByBusinessController);
// /**
//  * @swagger
//  * /api/v1/items/{id}:
//  *   put:
//  *     summary: Update an item
//  *     tags: [Items]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Item ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *               price:
//  *                 type: number
//  *               type:
//  *                 type: string
//  *                 enum: [product, service]
//  *     responses:
//  *       200:
//  *         description: Item updated successfully
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Forbidden
//  *       404:
//  *         description: Item not found
//  */
// productRoutes.put("/:id", authenticate, updateItemController);
// /**
//  * @swagger
//  * /api/v1/items/item/{id}:
//  *   get:
//  *     summary: Get a single item by ID
//  *     tags: [Items]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Item ID
//  *     responses:
//  *       200:
//  *         description: Item fetched successfully
//  *       404:
//  *         description: Item not found
//  */
// productRoutes.get("/item/:id", getSingleItemController);
// /**
//  * @swagger
//  * /api/v1/items/{id}:
//  *   delete:
//  *     summary: Delete an item
//  *     tags: [Items]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Item ID
//  *     responses:
//  *       200:
//  *         description: Item deleted successfully
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Forbidden
//  *       404:
//  *         description: Item not found
//  */
// productRoutes.delete("/:id", authenticate, deleteItemController);
