"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCheckoutSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const orderItemSchema = zod_1.default.object({
    itemId: zod_1.default.string().uuid("Invalid item ID"),
    itemType: zod_1.default.enum(["product", "service"], {
        message: "Item type is required and must be of type product or service",
    }),
    quantity: zod_1.default
        .number({ message: "Quantity must be a number" })
        .int()
        .min(1, "Quantity must be at least 1")
        .default(1),
});
exports.initializeCheckoutSchema = zod_1.default.object({
    businessSlug: zod_1.default.string({ error: "Business slug is required" }),
    customerName: zod_1.default
        .string({ error: "Customer name is required" })
        .min(2)
        .max(100)
        .trim(),
    customerPhone: zod_1.default
        .string({ error: "Customer phone is required" })
        .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number format"),
    customerEmail: zod_1.default.string().email("Invalid email address").optional(),
    deliveryAddress: zod_1.default.string().max(500).trim().optional(),
    items: zod_1.default.array(orderItemSchema).min(1, "At least one item is required"),
});
