import z from "zod";

const orderItemSchema = z.object({
  itemId: z.string().uuid("Invalid item ID"),
  itemType: z.enum(["product", "service"], {
    message: "Item type is required and must be of type product or service",
  }),
  quantity: z
    .number({ message: "Quantity must be a number" })
    .int()
    .min(1, "Quantity must be at least 1")
    .default(1),
});

export const initializeCheckoutSchema = z.object({
  businessSlug: z.string({ error: "Business slug is required" }),

  customerName: z
    .string({ error: "Customer name is required" })
    .min(2)
    .max(100)
    .trim(),

  customerPhone: z
    .string({ error: "Customer phone is required" })
    .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number format"),

  customerEmail: z.string().email("Invalid email address").optional(),

  deliveryAddress: z.string().max(500).trim().optional(),

  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});
