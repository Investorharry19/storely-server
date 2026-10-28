"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketIdSchema = exports.paymentIdSchema = exports.userIdSchema = exports.resolveTicketSchema = exports.ticketQuerySchema = exports.revenueQuerySchema = exports.orderQuerySchema = exports.transactionQuerySchema = exports.userQuerySchema = exports.paginationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.paginationSchema = zod_1.default.object({
    page: zod_1.default.string().transform(Number).default(1),
    limit: zod_1.default.string().transform(Number).default(20),
});
exports.userQuerySchema = exports.paginationSchema.extend({
    status: zod_1.default.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    search: zod_1.default.string().trim().optional(),
});
exports.transactionQuerySchema = exports.paginationSchema.extend({
    status: zod_1.default.enum(["PENDING", "PAID", "FAILED"]).optional(),
});
exports.orderQuerySchema = exports.paginationSchema.extend({
    status: zod_1.default.enum(["NEW", "PROCESSING", "COMPLETED", "CANCELLED"]).optional(),
    search: zod_1.default.string().trim().optional(),
});
exports.revenueQuerySchema = exports.paginationSchema.extend({
    status: zod_1.default.enum(["PENDING", "PAID", "FAILED"]).optional(),
});
exports.ticketQuerySchema = exports.paginationSchema.extend({
    status: zod_1.default.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]).optional(),
});
exports.resolveTicketSchema = zod_1.default.object({
    status: zod_1.default.enum(["IN_PROGRESS", "RESOLVED"]),
    assignedTo: zod_1.default.string().trim().optional(),
});
exports.userIdSchema = zod_1.default.object({
    userId: zod_1.default.string().uuid("Invalid user ID"),
});
exports.paymentIdSchema = zod_1.default.object({
    paymentId: zod_1.default.string().uuid("Invalid payment ID"),
});
exports.ticketIdSchema = zod_1.default.object({
    ticketId: zod_1.default.string().uuid("Invalid ticket ID"),
});
