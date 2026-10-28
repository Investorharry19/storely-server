"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceSchema = exports.createServiceSchema = exports.updateProductSchema = exports.editProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
// ============================================================
// PRODUCT
// ============================================================
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: "Product name is required" })
        .min(2, "Product name must be at least 2 characters")
        .max(150)
        .trim(),
    description: zod_1.z.string().max(1000).trim().optional(),
    price: zod_1.z.preprocess((value) => {
        if (typeof value === "string")
            return parseFloat(value);
        if (typeof value === "number")
            return value;
        return undefined;
    }, zod_1.z
        .number({ error: "Price is required and must be a number" })
        .min(0, "Price cannot be negative")),
    priceType: zod_1.z.enum(["FIXED", "STARTING_FROM"]).default("FIXED"),
    category: zod_1.z.string().max(60).trim().optional(),
    stockQuantity: zod_1.z.preprocess((value) => {
        if (typeof value === "string")
            return parseInt(value, 10);
        if (typeof value === "number")
            return value;
        return undefined;
    }, zod_1.z
        .number({ message: "Stock quantity must be a number" })
        .int("Stock quantity must be a whole number")
        .min(0, "Stock quantity cannot be negative")
        .default(0)),
    isAvailable: zod_1.z.preprocess((value) => {
        if (value === "true")
            return true;
        if (value === "false")
            return false;
        return value;
    }, zod_1.z.boolean().default(true)),
    imageUrls: zod_1.z
        .array(zod_1.z.string().url("Each image must be a valid URL"))
        .max(5, "Maximum 5 images allowed")
        .default([]),
});
exports.editProductSchema = exports.createProductSchema.partial();
exports.updateProductSchema = exports.createProductSchema.partial();
// ============================================================
// SERVICE
// ============================================================
exports.createServiceSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: "Service name is required" })
        .min(2, "Service name must be at least 2 characters")
        .max(150)
        .trim(),
    description: zod_1.z.string().max(1000).trim().optional(),
    price: zod_1.z
        .number({
        error: "Price is required and must be a number",
    })
        .min(0, "Price cannot be negative"),
    priceType: zod_1.z.enum(["FIXED", "STARTING_FROM"]).default("FIXED"),
    category: zod_1.z.string().max(60).trim().optional(),
    isAvailable: zod_1.z.preprocess((value) => {
        if (value === "true")
            return true;
        if (value === "false")
            return false;
        return value;
    }, zod_1.z.boolean().default(true)),
});
exports.updateServiceSchema = exports.createServiceSchema.partial();
