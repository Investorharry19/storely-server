import { Request, Response } from "express";
import storeService from "./store.service";
// ============================================================
// GET STOREFRONT
// GET /store/:slug
// ============================================================
const getStorefront = async (req: Request | any, res: Response) => {
  const data = await storeService.getStorefront(req.params.slug);

  return res.status(200).json({ success: true, data });
};

// ============================================================
// GET PRODUCT DETAIL
// GET /store/:slug/products/:productId
// ============================================================
const getProductDetail = async (req: Request | any, res: Response) => {
  const data = await storeService.getProductDetail(
    req.params.slug,
    req.params.productId,
  );

  return res.status(200).json({ success: true, data });
};

// ============================================================
// GET SERVICE DETAIL
// GET /store/:slug/services/:serviceId
// ============================================================
const getServiceDetail = async (req: Request | any, res: Response) => {
  const data = await storeService.getServiceDetail(
    req.params.slug,
    req.params.serviceId,
  );

  return res.status(200).json({ success: true, data });
};

const controller = { getStorefront, getProductDetail, getServiceDetail };

export default controller;
