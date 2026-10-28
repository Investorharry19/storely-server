import { Request, Response } from "express";
import catalogService from "./catalog.service";

import {
  createProductSchema,
  updateProductSchema,
  updateServiceSchema,
  createServiceSchema,
} from "./catalog.validation";
import z from "zod";

// ============================================================
// PRODUCTS
// ============================================================

const createProduct = async (req: Request | any, res: Response) => {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const files = (req.files as Express.Multer.File[]) ?? [];
  const imageUrls = parsed.data.imageUrls ?? [];

  if (files.length === 0 && imageUrls.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one product image or image URL is required" });
  }

  const product = await catalogService.createProduct(
    req.user.id,
    parsed.data,
    files,
  );

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

const getMyProducts = async (req: Request | any, res: Response) => {
  const products = await catalogService.getMyProducts(req.user.id);

  return res.status(200).json({ success: true, data: products });
};

const getProductById = async (req: Request | any, res: Response) => {
  const product = await catalogService.getProductById(
    req.user.id,
    req.params.productId,
  );

  return res.status(200).json({ success: true, data: product });
};

const updateProduct = async (req: Request | any, res: Response) => {
  const body = { ...req.body };
  if (typeof body.imageUrls === "string") {
    try {
      body.imageUrls = JSON.parse(body.imageUrls);
    } catch {
      body.imageUrls = undefined;
    }
  }
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const product = await catalogService.updateProduct(
    req.user.id,
    req.params.productId,
    parsed.data,
    (req.files as Express.Multer.File[]) ?? [],
    typeof req.body.imageOrder === "string"
      ? JSON.parse(req.body.imageOrder)
      : undefined,
  );

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

const deleteProduct = async (req: Request | any, res: Response) => {
  await catalogService.deleteProduct(req.user.id, req.params.productId);

  return res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
};

const bulkUpdateProducts = async (req: Request | any, res: Response) => {
  const schema = z.object({
    productIds: z
      .array(z.string().uuid())
      .min(1, "At least one product ID is required"),
    isAvailable: z.boolean(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await catalogService.bulkUpdateProducts(
    req.user.id,
    parsed.data.productIds,
    { isAvailable: parsed.data.isAvailable },
  );

  return res.status(200).json({
    success: true,
    message: `${result.count} product(s) updated`,
    data: result,
  });
};

const bulkDeleteProducts = async (req: Request | any, res: Response) => {
  const schema = z.object({
    productIds: z
      .array(z.string().uuid())
      .min(1, "At least one product ID is required"),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await catalogService.bulkDeleteProducts(
    req.user.id,
    parsed.data.productIds,
  );

  return res.status(200).json({
    success: true,
    message: `${result.count} product(s) deleted`,
  });
};

// ============================================================
// SERVICES
// ============================================================

const createService = async (req: Request | any, res: Response) => {
  const parsed = createServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const service = await catalogService.createService(req.user.id, parsed.data);

  return res.status(201).json({
    success: true,
    message: "Service created successfully",
    data: service,
  });
};

const getMyServices = async (req: Request | any, res: Response) => {
  const services = await catalogService.getMyServices(req.user.id);

  return res.status(200).json({ success: true, data: services });
};

const getServiceById = async (req: Request | any, res: Response) => {
  const service = await catalogService.getServiceById(
    req.user.id,
    req.params.serviceId,
  );

  return res.status(200).json({ success: true, data: service });
};

const updateService = async (req: Request | any, res: Response) => {
  const parsed = updateServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const service = await catalogService.updateService(
    req.user.id,
    req.params.serviceId,
    parsed.data,
  );

  return res.status(200).json({
    success: true,
    message: "Service updated successfully",
    data: service,
  });
};

const deleteService = async (req: Request | any, res: Response) => {
  await catalogService.deleteService(req.user.id, req.params.serviceId);

  return res
    .status(200)
    .json({ success: true, message: "Service deleted successfully" });
};

const bulkUpdateServices = async (req: Request | any, res: Response) => {
  const schema = z.object({
    serviceIds: z
      .array(z.string().uuid())
      .min(1, "At least one service ID is required"),
    isAvailable: z.boolean(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await catalogService.bulkUpdateServices(
    req.user.id,
    parsed.data.serviceIds,
    { isAvailable: parsed.data.isAvailable },
  );

  return res.status(200).json({
    success: true,
    message: `${result.count} service(s) updated`,
    data: result,
  });
};

const bulkDeleteServices = async (req: Request | any, res: Response) => {
  const schema = z.object({
    serviceIds: z
      .array(z.string().uuid())
      .min(1, "At least one service ID is required"),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await catalogService.bulkDeleteServices(
    req.user.id,
    parsed.data.serviceIds,
  );

  return res.status(200).json({
    success: true,
    message: `${result.count} service(s) deleted`,
  });
};

const controller = {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkUpdateProducts,
  bulkDeleteProducts,
  createService,
  getMyServices,
  getServiceById,
  updateService,
  deleteService,
  bulkUpdateServices,
  bulkDeleteServices,
};

export default controller;
