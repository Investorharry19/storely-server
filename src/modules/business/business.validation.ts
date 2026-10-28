import z from "zod";

enum ProductType {
  red,
  green,
  blue,
}
export const createBusinessSchema = z.object({
  name: z
    .string({ error: "Business name is required" })
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must not exceed 100 characters")
    .trim(),

  type: z.enum(["PRODUCT", "SERVICE", "HYBRID"], {
    error: "Business type is required",
  }),

  category: z
    .string({ error: "Category is required" })
    .min(1, "Category is required")
    .max(60)
    .trim(),

  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .trim()
    .optional(),

  phone: z
    .string()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number format")
    .optional(),

  email: z.string().email("Invalid email address").optional(),

  website: z.string().optional(),

  location: z.string().max(150).trim().optional(),

  logoUrl: z.string().url("Invalid logo URL").optional(),

  publicId: z.string().trim().optional(),
});

export const updateBusinessSchema = createBusinessSchema.partial();
