"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_service_1 = __importDefault(require("./store.service"));
// ============================================================
// GET STOREFRONT
// GET /store/:slug
// ============================================================
const getStorefront = async (req, res) => {
    const data = await store_service_1.default.getStorefront(req.params.slug);
    return res.status(200).json({ success: true, data });
};
// ============================================================
// GET PRODUCT DETAIL
// GET /store/:slug/products/:productId
// ============================================================
const getProductDetail = async (req, res) => {
    const data = await store_service_1.default.getProductDetail(req.params.slug, req.params.productId);
    return res.status(200).json({ success: true, data });
};
// ============================================================
// GET SERVICE DETAIL
// GET /store/:slug/services/:serviceId
// ============================================================
const getServiceDetail = async (req, res) => {
    const data = await store_service_1.default.getServiceDetail(req.params.slug, req.params.serviceId);
    return res.status(200).json({ success: true, data });
};
const controller = { getStorefront, getProductDetail, getServiceDetail };
exports.default = controller;
