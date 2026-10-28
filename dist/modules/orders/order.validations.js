"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQuerySchema = exports.updateOrderStatusSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updateOrderStatusSchema = zod_1.default.object({
    status: zod_1.default.enum(["NEW", "PROCESSING", "COMPLETED", "CANCELLED"], {
        error: "Status must be NEW, PROCESSING, COMPLETED, or CANCELLED",
    }),
});
exports.orderQuerySchema = zod_1.default.object({
    status: zod_1.default.enum(["NEW", "PROCESSING", "COMPLETED", "CANCELLED"]).optional(),
    paymentStatus: zod_1.default.enum(["PENDING", "PAID", "FAILED"]).optional(),
    customerName: zod_1.default.string().trim().optional(),
    from: zod_1.default
        .string()
        .refine((v) => !isNaN(Date.parse(v)), { message: "Invalid from date" })
        .optional(),
    to: zod_1.default
        .string()
        .refine((v) => !isNaN(Date.parse(v)), { message: "Invalid to date" })
        .optional(),
    page: zod_1.default
        .string()
        .transform(Number)
        .refine((v) => v > 0, { message: "Page must be greater than 0" })
        .default(1),
    limit: zod_1.default
        .string()
        .transform(Number)
        .refine((v) => v > 0 && v <= 100, {
        message: "Limit must be between 1 and 100",
    })
        .default(20),
});
