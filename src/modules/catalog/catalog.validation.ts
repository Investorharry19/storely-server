import { PriceType } from "@prisma/client";
import { z } from "zod";

// ============================================================
// PRODUCT
// ============================================================
export const createProductSchema = z.object({
  name: z
    .string({ error: "Product name is required" })
    .min(2, "Product name must be at least 2 characters")
    .max(150)
    .trim(),

  description: z.string().max(1000).trim().optional(),

  price: z.preprocess(
    (value) => {
      if (typeof value === "string") return parseFloat(value);
      if (typeof value === "number") return value;
      return undefined;
    },
    z
      .number({ error: "Price is required and must be a number" })
      .min(0, "Price cannot be negative"),
  ),

  priceType: z.enum(["FIXED", "STARTING_FROM"]).default("FIXED"),

  category: z.string().max(60).trim().optional(),

  stockQuantity: z.preprocess(
    (value) => {
      if (typeof value === "string") return parseInt(value, 10);
      if (typeof value === "number") return value;
      return undefined;
    },
    z
      .number({ message: "Stock quantity must be a number" })
      .int("Stock quantity must be a whole number")
      .min(0, "Stock quantity cannot be negative")
      .default(0),
  ),

  isAvailable: z.preprocess((value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }, z.boolean().default(true)),

  imageUrls: z
    .array(z.string().url("Each image must be a valid URL"))
    .max(5, "Maximum 5 images allowed")
    .default([]),
});

export const editProductSchema = createProductSchema.partial();

export const updateProductSchema = createProductSchema.partial();

// ============================================================
// SERVICE
// ============================================================
export const createServiceSchema = z.object({
  name: z
    .string({ error: "Service name is required" })
    .min(2, "Service name must be at least 2 characters")
    .max(150)
    .trim(),

  description: z.string().max(1000).trim().optional(),

  price: z
    .number({
      error: "Price is required and must be a number",
    })
    .min(0, "Price cannot be negative"),

  priceType: z.enum(["FIXED", "STARTING_FROM"]).default("FIXED"),

  category: z.string().max(60).trim().optional(),

  isAvailable: z.preprocess((value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }, z.boolean().default(true)),
});

export const updateServiceSchema = createServiceSchema.partial();
