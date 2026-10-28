"use strict";
// import { Request, Response, NextFunction } from "express";
// import { responseFailure, responseSuccess } from "../../utils/response";
// import { AuthRequest } from "../../middlewares/auth.middleware";
// import {
//   createItem,
//   getItemsByBusiness,
//   updateItem,
//   deleteItem,
//   getItemById,
// } from "./product.service";
// export const createItemController = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const userId = req.user.id;
//     console.log(req.body);
//     const { businessId, name, description, price, type } = req.body;
//     if (!businessId || !name || !description || !price || !type) {
//       return responseFailure(res, "All required fields must be provided", 400);
//     }
//     const files = req.files as Express.Multer.File[];
//     const priceNum = parseFloat(price);
//     const item = await createItem(
//       businessId,
//       userId,
//       name,
//       description,
//       priceNum,
//       type,
//       files,
//     );
//     return responseSuccess(res, "Item created successfully", item, 201);
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// };
// export const getItemsByBusinessController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { businessId } = req.query;
//     if (!businessId) return responseFailure(res, "businessId is required", 401);
//     const items = await getItemsByBusiness(businessId as string);
//     return responseSuccess(res, "Items fetched successfully", items, 200);
//   } catch (err) {
//     next(err);
//   }
// };
// export const getSingleItemController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { id } = req.params;
//     const item = await getItemById(id as string);
//     return responseSuccess(res, "Item fetched successfully", item, 200);
//   } catch (err) {
//     next(err);
//   }
// };
// export const updateItemController = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const userId = req.user.id;
//     const { id } = req.params;
//     const data = req.body;
//     const updated = await updateItem(id as string, userId, data);
//     return responseSuccess(res, "Item updated successfully", updated, 200);
//   } catch (err) {
//     next(err);
//   }
// };
// export const deleteItemController = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const userId = req.user.id;
//     const { id } = req.params;
//     await deleteItem(id as string, userId);
//     return responseSuccess(res, "Item deleted successfully", null, 200);
//   } catch (err) {
//     next(err);
//   }
// };
