"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const payment_controller_1 = __importDefault(require("./payment.controller"));
const router = (0, express_1.Router)();
router.get("/summary", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(payment_controller_1.default.getSummary));
router.get("/", auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(payment_controller_1.default.getPayments));
exports.default = router;
