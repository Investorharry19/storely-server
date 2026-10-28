import z from "zod";

export const updateOrderStatusSchema = z.object({
  status: z.enum(["NEW", "PROCESSING", "COMPLETED", "CANCELLED"], {
    error: "Status must be NEW, PROCESSING, COMPLETED, or CANCELLED",
  }),
});

export const orderQuerySchema = z.object({
  status: z.enum(["NEW", "PROCESSING", "COMPLETED", "CANCELLED"]).optional(),

  paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]).optional(),

  customerName: z.string().trim().optional(),

  from: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: "Invalid from date" })
    .optional(),

  to: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: "Invalid to date" })
    .optional(),

  page: z
    .string()
    .transform(Number)
    .refine((v) => v > 0, { message: "Page must be greater than 0" })
    .default(1),

  limit: z
    .string()
    .transform(Number)
    .refine((v) => v > 0 && v <= 100, {
      message: "Limit must be between 1 and 100",
    })
    .default(20),
});
