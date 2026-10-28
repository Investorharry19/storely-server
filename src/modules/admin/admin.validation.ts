import z from "zod";

export const paginationSchema = z.object({
  page: z.string().transform(Number).default(1),
  limit: z.string().transform(Number).default(20),
});

export const userQuerySchema = paginationSchema.extend({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  search: z.string().trim().optional(),
});

export const transactionQuerySchema = paginationSchema.extend({
  status: z.enum(["PENDING", "PAID", "FAILED"]).optional(),
});

export const orderQuerySchema = paginationSchema.extend({
  status: z.enum(["NEW", "PROCESSING", "COMPLETED", "CANCELLED"]).optional(),
  search: z.string().trim().optional(),
});

export const revenueQuerySchema = paginationSchema.extend({
  status: z.enum(["PENDING", "PAID", "FAILED"]).optional(),
});

export const ticketQuerySchema = paginationSchema.extend({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]).optional(),
});

export const resolveTicketSchema = z.object({
  status: z.enum(["IN_PROGRESS", "RESOLVED"]),
  assignedTo: z.string().trim().optional(),
});

export const userIdSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export const paymentIdSchema = z.object({
  paymentId: z.string().uuid("Invalid payment ID"),
});

export const ticketIdSchema = z.object({
  ticketId: z.string().uuid("Invalid ticket ID"),
});
