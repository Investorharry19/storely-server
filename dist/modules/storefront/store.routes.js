"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const stotre_controller_1 = __importDefault(require("./stotre.controller"));
// All store routes are fully public — no authentication required.
// Customers access these via the shareable store link.
// GET /store/:slug                           — main storefront (business + products + services)
// GET /store/:slug/products/:productId       — single product detail
// GET /store/:slug/services/:serviceId       — single service detail
router.get("/:slug", (0, asyncHandler_1.asyncHandler)(stotre_controller_1.default.getStorefront));
router.get("/:slug/products/:productId", (0, asyncHandler_1.asyncHandler)(stotre_controller_1.default.getProductDetail));
router.get("/:slug/services/:serviceId", (0, asyncHandler_1.asyncHandler)(stotre_controller_1.default.getServiceDetail));
const StoreFrontRoutes = router;
exports.default = StoreFrontRoutes;
