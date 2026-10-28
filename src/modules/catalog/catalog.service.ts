import { PrismaClient } from "@prisma/client";
import cloudinary from "../../utils/cloudinary";
import {
  createProductSchema,
  createServiceSchema,
  editProductSchema,
  updateServiceSchema,
} from "./catalog.validation";
import { z } from "zod";

const prisma = new PrismaClient();

// ============================================================
// HELPERS
// ============================================================

const getBusinessOrThrow = async (userId: string) => {
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) {
    const error: Error | any = new Error(
      "Business profile not found. Please complete onboarding first.",
    );
    error.statusCode = 404;
    throw error;
  }
  return business;
};

const getProductOrThrow = async (productId: string, businessId: string) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, businessId },
  });
  if (!product) {
    const error: Error | any = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }
  return product;
};

const getServiceOrThrow = async (serviceId: string, businessId: string) => {
  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessId },
  });
  if (!service) {
    const error: Error | any = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }
  return service;
};

// ============================================================
// PRODUCTS
// ============================================================

const createProduct = async (
  userId: string,
  data: z.infer<typeof createProductSchema>,
  files: Express.Multer.File[],
) => {
  const business = await getBusinessOrThrow(userId);

  //   // Upload images to Cloudinary if provided
  let imageData: { url: string; publicId: string }[] = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map((file, index) => {
      return new Promise<{ url: string; publicId: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: `storely/${business.id}` },
              (error, result) => {
                if (error) reject(error);
                else
                  resolve({
                    url: result!.secure_url,
                    publicId: result!.public_id,
                  });
              },
            )
            .end(file.buffer);
        },
      );
    });

    imageData = await Promise.all(uploadPromises);
  }

  return prisma.product.create({
    data: {
      businessId: business.id,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      category: data.category ?? null,
      stockQuantity: data.stockQuantity ?? 0,
      isAvailable: data.isAvailable ?? true,
      imageUrls: imageData ?? [],
    },
  });
};

const getMyProducts = async (userId: string) => {
  const business = await getBusinessOrThrow(userId);

  return prisma.product.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });
};

const getProductById = async (userId: string, productId: string) => {
  const business = await getBusinessOrThrow(userId);
  return getProductOrThrow(productId, business.id);
};

const updateProduct = async (
  userId: string,
  productId: string,
  data: z.infer<typeof editProductSchema>,
  files: Express.Multer.File[] = [],
  imageOrder?: Array<{
    type: "existing" | "new";
    url?: string;
    index?: number;
  }>,
) => {
  const business = await getBusinessOrThrow(userId);
  const existingProduct = await getProductOrThrow(productId, business.id);

  const uploadedImages = await Promise.all(
    files.map(
      (file) =>
        new Promise<{ url: string; publicId: string }>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: `storely/${business.id}` },
              (error, result) => {
                if (error) reject(error);
                else
                  resolve({
                    url: result!.secure_url,
                    publicId: result!.public_id,
                  });
              },
            )
            .end(file.buffer);
        }),
    ),
  );

  let orderedImages: any = undefined;
  if (imageOrder) {
    const currentImages = Array.isArray(existingProduct.imageUrls)
      ? (existingProduct.imageUrls as Array<{ url?: string } | string>)
      : [];
    const nextImages = imageOrder
      .map((entry) => {
        if (entry.type === "new") return uploadedImages[entry.index ?? -1];
        return currentImages.find(
          (image) =>
            (typeof image === "string" ? image : image.url) === entry.url,
        );
      })
      .filter(Boolean) as any;
    // Never replace a valid gallery with an empty array because a malformed
    // or stale client payload omitted the existing image URLs.
    if (nextImages.length > 0) orderedImages = nextImages;
  } else if (files.length > 0) {
    orderedImages = [
      ...(Array.isArray(data.imageUrls) ? data.imageUrls : []),
      ...uploadedImages,
    ] as any;
  } else if (Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
    orderedImages = data.imageUrls;
  }

  return prisma.product.update({
    where: { id: productId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.stockQuantity !== undefined && {
        stockQuantity: data.stockQuantity,
      }),
      ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
      ...(orderedImages !== undefined && {
        imageUrls: orderedImages,
      }),
    },
  });
};

const deleteProduct = async (userId: string, productId: string) => {
  const business = await getBusinessOrThrow(userId);
  await getProductOrThrow(productId, business.id);

  return prisma.product.delete({ where: { id: productId } });
};

/**
 * Bulk toggle visibility (show/hide) for multiple products at once.
 * PRD requirement: bulk actions — hide/show multiple items.
 */
const bulkUpdateProducts = async (
  userId: string,
  productIds: string[],
  data: { isAvailable: boolean },
) => {
  const business = await getBusinessOrThrow(userId);

  return prisma.product.updateMany({
    where: {
      id: { in: productIds },
      businessId: business.id,
    },
    data: {
      ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
    },
  });
};

/**
 * Bulk delete multiple products at once.
 */
const bulkDeleteProducts = async (userId: string, productIds: string[]) => {
  const business = await getBusinessOrThrow(userId);

  return prisma.product.deleteMany({
    where: {
      id: { in: productIds },
      businessId: business.id,
    },
  });
};

// ============================================================
// SERVICES
// ============================================================

const createService = async (
  userId: string,
  data: z.infer<typeof createServiceSchema>,
) => {
  const business = await getBusinessOrThrow(userId);

  return prisma.service.create({
    data: {
      businessId: business.id,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      priceType: data.priceType ?? "FIXED",
      category: data.category ?? null,
      isAvailable: data.isAvailable ?? true,
    },
  });
};

const getMyServices = async (userId: string) => {
  const business = await getBusinessOrThrow(userId);

  return prisma.service.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });
};

const getServiceById = async (userId: string, serviceId: string) => {
  const business = await getBusinessOrThrow(userId);
  return getServiceOrThrow(serviceId, business.id);
};

const updateService = async (
  userId: string,
  serviceId: string,
  data: z.infer<typeof updateServiceSchema>,
) => {
  const business = await getBusinessOrThrow(userId);
  await getServiceOrThrow(serviceId, business.id);

  return prisma.service.update({
    where: { id: serviceId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.priceType !== undefined && { priceType: data.priceType }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
    },
  });
};

const deleteService = async (userId: string, serviceId: string) => {
  const business = await getBusinessOrThrow(userId);
  await getServiceOrThrow(serviceId, business.id);

  return prisma.service.delete({ where: { id: serviceId } });
};

/**
 * Bulk toggle visibility for multiple services at once.
 */
const bulkUpdateServices = async (
  userId: string,
  serviceIds: string[],
  data: { isAvailable: boolean },
) => {
  const business = await getBusinessOrThrow(userId);

  return prisma.service.updateMany({
    where: {
      id: { in: serviceIds },
      businessId: business.id,
    },
    data: {
      ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
    },
  });
};

/**
 * Bulk delete multiple services at once.
 */
const bulkDeleteServices = async (userId: string, serviceIds: string[]) => {
  const business = await getBusinessOrThrow(userId);

  return prisma.service.deleteMany({
    where: {
      id: { in: serviceIds },
      businessId: business.id,
    },
  });
};

const catalogService = {
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

export default catalogService;
