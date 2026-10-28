"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePlanSchema = exports.suspendSchema = exports.sendMessageSchema = void 0;
const zod_1 = require("zod");
exports.sendMessageSchema = zod_1.z.object({
    subject: zod_1.z.string().min(1),
    message: zod_1.z.string().min(1),
});
exports.suspendSchema = zod_1.z.object({
    reason: zod_1.z.string().min(1),
    noteToSeller: zod_1.z.string().min(1),
});
exports.changePlanSchema = zod_1.z.object({
    plan: zod_1.z.string().min(1),
});
