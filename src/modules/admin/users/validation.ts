import { z } from "zod";

export const sendMessageSchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const banUserSchema = z.object({
  reason: z.string().min(1),
  noteToUser: z.string().min(1),
});

export const warnUserSchema = z.object({
  reason: z.string().min(1),
  noteToUser: z.string().min(1),
});

export const changePlanSchema = z.object({
  plan: z.string().min(1),
});
