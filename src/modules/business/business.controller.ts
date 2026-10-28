import { Request, Response } from "express";
import {
  createBusinessSchema,
  updateBusinessSchema,
} from "./business.validation";
import { businessService } from "./business.service";

const createBusiness = async (req: Request | any, res: Response) => {
  const parsed = createBusinessSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const business = await businessService.createBusiness(
    req.user.id,
    parsed.data,
    req.file,
  );

  return res.status(201).json({
    success: true,
    message: "Business profile created successfully",
    data: {
      ...business,
      storeUrl: `${process.env.APP_URL}/${business.slug}`,
    },
  });
};

const getMyBusiness = async (req: Request | any, res: Response) => {
  const business = await businessService.getMyBusiness(req.user.id);

  return res.status(200).json({
    success: true,
    data: {
      ...business,
      storeUrl: `${process.env.APP_URL}/${business.slug}`,
    },
  });
};

const getBusinessBySlug = async (req: Request | any, res: Response) => {
  const business = await businessService.getBusinessBySlug(req.params.slug);

  return res.status(200).json({
    success: true,
    data: business,
  });
};

const updateBusiness = async (req: Request | any, res: Response) => {
  const parsed = updateBusinessSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const business = await businessService.updateBusiness(
    req.user.id,
    parsed.data,
  );

  return res.status(200).json({
    success: true,
    message: "Business profile updated successfully",
    data: {
      ...business,
      storeUrl: `${process.env.APP_URL}/${business.slug}`,
    },
  });
};

const updateLogo = async (req: Request | any, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No logo file uploaded",
    });
  }

  const business = await businessService.updateLogoUrl(req.user.id, req.file);

  return res.status(200).json({
    success: true,
    message: "Logo updated successfully",
    data: { logoUrl: business.logoUrl },
  });
};

export const controller = {
  createBusiness,
  getMyBusiness,
  getBusinessBySlug,
  updateBusiness,
  updateLogo,
};
