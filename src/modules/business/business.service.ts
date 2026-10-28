import { PrismaClient } from "@prisma/client";
import { generateSlug, ensureUniqueSlug } from "../../utils/slug";
import cloudinary, {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary";
import {
  createBusinessSchema,
  updateBusinessSchema,
} from "./business.validation";
import z from "zod";
import { de } from "zod/v4/locales";

const prisma = new PrismaClient();

/**
 * Create a new business profile for a user.
 * Auto-generates a unique slug from the business name.
 */
const createBusiness = async (
  userId: string,
  data: z.infer<typeof createBusinessSchema>,
  logo: Express.Multer.File,
) => {
  const existing = await prisma.business.findUnique({ where: { userId } });
  if (existing) {
    const error: any = new Error("User already has a business profile");
    error.statusCode = 409;
    throw error;
  }

  const baseSlug = generateSlug(data.name);
  const slug = await ensureUniqueSlug(baseSlug);

  let [logoUrl, publicId]: [string | null, string | null] = [null, null];

  if (logo) {
    console.log("Uploading logo to Cloudinary:", logo.path);
    const result = await uploadToCloudinary(logo).catch((err) => {
      console.error("Error uploading logo to Cloudinary:", err);
      throw new Error("Failed to upload logo");
    });
    logoUrl = result.url;
    publicId = result.publicId;
  }

  const business = await prisma.business.create({
    data: {
      userId,
      name: data.name,
      slug,
      type: data.type,
      category: data.category,
      description: data.description ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      website: data.website ?? null,
      location: data.location ?? null,
      logoUrl: logoUrl ?? null,
      publicId: publicId ?? null,
    },
  });

  return business;
};

/**
 * Get the authenticated user's business profile.
 */
const getMyBusiness = async (userId: string) => {
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) {
    const error: Error | any = new Error("Business profile not found");
    error.statusCode = 404;
    throw error;
  }
  return business;
};

/**
 * Get a public business profile by slug.
 * Used for the public storefront page.
 */
const getBusinessBySlug = async (slug: string) => {
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isAvailable: true },
        orderBy: { createdAt: "desc" },
      },
      services: {
        where: { isAvailable: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!business || !business.isActive) {
    const error: Error | any = new Error("Store not found");
    error.statusCode = 404;
    throw error;
  }

  return business;
};

/**
 * Update the authenticated user's business profile.
 * If the name changes, regenerate the slug.
 */
const updateBusiness = async (
  userId: string,
  data: z.infer<typeof updateBusinessSchema>,
) => {
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) {
    const error: Error | any = new Error("Business profile not found");
    error.statusCode = 404;
    throw error;
  }

  let slug = business.slug;
  if (data.name && data.name !== business.name) {
    const baseSlug = generateSlug(data.name);
    slug = await ensureUniqueSlug(baseSlug, business.id);
  }

  const updated = await prisma.business.update({
    where: { userId },
    data: {
      ...(data.name && { name: data.name, slug }),
      ...(data.type && { type: data.type }),
      ...(data.category && { category: data.category }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.website !== undefined && { website: data.website }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
      ...(data.publicId !== undefined && { publicId: data.publicId }),
    },
  });

  return updated;
};

/**
 * Upload or replace the business logo URL and public ID.
 * The actual file upload is handled separately (e.g. via a CDN/storage middleware).
 * This just saves the resulting URL and public ID to the database.
 */
const updateLogoUrl = async (userId: string, file: Express.Multer.File) => {
  const business = await prisma.business.findUnique({ where: { userId } });
  if (!business) {
    const error: Error | any = new Error("Business profile not found");
    error.statusCode = 404;
    throw error;
  }

  console.log("Uploading new logo to Cloudinary:", file);
  const result = await uploadToCloudinary(file).catch((err) => {
    console.error("Error uploading logo to Cloudinary:", err);
    throw new Error("Failed to upload logo");
  });
  const logoUrl = result.url;
  const publicId = result.publicId;
  const prevPublicId = business.publicId;

  const updated = await prisma.business.update({
    where: { userId },
    data: {
      logoUrl,
      ...(publicId && { publicId }),
    },
  });

  console.log(business, 163);
  if (prevPublicId) {
    await deleteFromCloudinary(prevPublicId).catch((err) => {
      console.error("Error deleting old logo from Cloudinary:", err);
    });
  }

  return updated;
};

export const businessService = {
  createBusiness,
  getMyBusiness,
  getBusinessBySlug,
  updateBusiness,
  updateLogoUrl,
};
