"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBusinessSchema = exports.createBusinessSchema = void 0;
const zod_1 = __importDefault(require("zod"));
var ProductType;
(function (ProductType) {
    ProductType[ProductType["red"] = 0] = "red";
    ProductType[ProductType["green"] = 1] = "green";
    ProductType[ProductType["blue"] = 2] = "blue";
})(ProductType || (ProductType = {}));
exports.createBusinessSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Business name is required" })
        .min(2, "Business name must be at least 2 characters")
        .max(100, "Business name must not exceed 100 characters")
        .trim(),
    type: zod_1.default.enum(["PRODUCT", "SERVICE", "HYBRID"], {
        error: "Business type is required",
    }),
    category: zod_1.default
        .string({ error: "Category is required" })
        .min(1, "Category is required")
        .max(60)
        .trim(),
    description: zod_1.default
        .string()
        .max(500, "Description must not exceed 500 characters")
        .trim()
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number format")
        .optional(),
    email: zod_1.default.string().email("Invalid email address").optional(),
    website: zod_1.default.string().optional(),
    location: zod_1.default.string().max(150).trim().optional(),
    logoUrl: zod_1.default.string().url("Invalid logo URL").optional(),
    publicId: zod_1.default.string().trim().optional(),
});
exports.updateBusinessSchema = exports.createBusinessSchema.partial();
