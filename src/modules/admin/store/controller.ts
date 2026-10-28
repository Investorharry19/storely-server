import { Request, Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import storeService from "./service";
import {
  sendMessageSchema,
  suspendSchema,
  changePlanSchema,
} from "./validation";

const getStores = async (req: Request<any>, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const data = await storeService.getStores({ page, limit });

  return res.status(200).json({ success: true, data });
};

const getStoreDetail = async (req: Request<{ id: string }>, res: Response) => {
  const data = await storeService.getStoreById(req.params.id);
  if (!data) {
    return res.status(404).json({ success: false, message: "Store not found" });
  }

  return res.status(200).json({ success: true, data });
};

const getStoreProducts = async (
  req: Request<{ storeId: string }>,
  res: Response,
) => {
  const data = await storeService.getStoreProducts(req.params.storeId);
  return res.status(200).json({ success: true, data });
};

const getStoreOrders = async (
  req: Request<{ storeId: string }>,
  res: Response,
) => {
  const data = await storeService.getStoreOrders(req.params.storeId);
  return res.status(200).json({ success: true, data });
};

const suspendStore = async (
  req: AuthRequest<{ storeId: string }>,
  res: Response,
) => {
  const parsed = suspendSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await storeService.suspendStore(
    req.user.id,
    req.params.storeId,
    parsed.data,
  );
  return res
    .status(200)
    .json({ success: true, message: "Store suspended successfully", data });
};

const verifyStore = async (
  req: AuthRequest<{ storeId: string }>,
  res: Response,
) => {
  const data = await storeService.verifyStore(req.user.id, req.params.storeId);
  return res
    .status(200)
    .json({ success: true, message: "Store verified successfully", data });
};

const sendMessage = async (
  req: AuthRequest<{ storeId: string }>,
  res: Response,
) => {
  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await storeService.sendMessage(
    req.user.id,
    req.params.storeId,
    parsed.data,
  );
  return res
    .status(200)
    .json({ success: true, message: "Message sent to store", data });
};

const changePlan = async (
  req: AuthRequest<{ storeId: string }>,
  res: Response,
) => {
  const parsed = changePlanSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await storeService.changePlan(
    req.user.id,
    req.params.storeId,
    parsed.data.plan,
  );
  return res
    .status(200)
    .json({ success: true, message: "Plan change processed", data });
};

export default {
  getStores,
  getStoreDetail,
  getStoreProducts,
  getStoreOrders,
  suspendStore,
  verifyStore,
  sendMessage,
  changePlan,
};
