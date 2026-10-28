import { z } from "zod";

export const periodEnum = z.enum(["day", "week", "month"]);

export const dashboardQuerySchema = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional(),
  period: periodEnum.default("day"),
});
