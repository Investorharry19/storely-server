"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardQuerySchema = exports.periodEnum = void 0;
const zod_1 = require("zod");
exports.periodEnum = zod_1.z.enum(["day", "week", "month"]);
exports.dashboardQuerySchema = zod_1.z.object({
    from: zod_1.z.string().date().optional(),
    to: zod_1.z.string().date().optional(),
    period: exports.periodEnum.default("day"),
});
