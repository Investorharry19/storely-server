"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinWaitlistSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.joinWaitlistSchema = zod_1.default.object({
    fullName: zod_1.default
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(100),
    email: zod_1.default.string().email("Invalid email address"),
    phoneNumber: zod_1.default
        .string()
        .optional()
        .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
        message: "Invalid phone number format",
    }),
});
