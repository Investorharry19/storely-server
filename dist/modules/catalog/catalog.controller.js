"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catalog_service_1 = __importDefault(require("./catalog.service"));
const catalog_validation_1 = require("./catalog.validation");
const zod_1 = __importDefault(require("zod"));
// ============================================================
// PRODUCTS
// ============================================================
const createProduct = async (req, res) => {
    const parsed = catalog_validation_1.createProductSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const files = req.files ?? [];
    const imageUrls = parsed.data.imageUrls ?? [];
    if (files.length === 0 && imageUrls.length === 0) {
        return res
            .status(400)
            .json({ message: "At least one product image or image URL is required" });
    }
    const product = await catalog_service_1.default.createProduct(req.user.id, parsed.data, files);
    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
    });
};
const getMyProducts = async (req, res) => {
    const products = await catalog_service_1.default.getMyProducts(req.user.id);
    return res.status(200).json({ success: true, data: products });
};
const getProductById = async (req, res) => {
    const product = await catalog_service_1.default.getProductById(req.user.id, req.params.productId);
    return res.status(200).json({ success: true, data: product });
};
const updateProduct = async (req, res) => {
    const body = { ...req.body };
    if (typeof body.imageUrls === "string") {
        try {
            body.imageUrls = JSON.parse(body.imageUrls);
        }
        catch {
            body.imageUrls = undefined;
        }
    }
    const parsed = catalog_validation_1.updateProductSchema.safeParse(body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const product = await catalog_service_1.default.updateProduct(req.user.id, req.params.productId, parsed.data, req.files ?? [], typeof req.body.imageOrder === "string"
        ? JSON.parse(req.body.imageOrder)
        : undefined);
    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
    });
};
const deleteProduct = async (req, res) => {
    await catalog_service_1.default.deleteProduct(req.user.id, req.params.productId);
    return res
        .status(200)
        .json({ success: true, message: "Product deleted successfully" });
};
const bulkUpdateProducts = async (req, res) => {
    const schema = zod_1.default.object({
        productIds: zod_1.default
            .array(zod_1.default.string().uuid())
            .min(1, "At least one product ID is required"),
        isAvailable: zod_1.default.boolean(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await catalog_service_1.default.bulkUpdateProducts(req.user.id, parsed.data.productIds, { isAvailable: parsed.data.isAvailable });
    return res.status(200).json({
        success: true,
        message: `${result.count} product(s) updated`,
        data: result,
    });
};
const bulkDeleteProducts = async (req, res) => {
    const schema = zod_1.default.object({
        productIds: zod_1.default
            .array(zod_1.default.string().uuid())
            .min(1, "At least one product ID is required"),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await catalog_service_1.default.bulkDeleteProducts(req.user.id, parsed.data.productIds);
    return res.status(200).json({
        success: true,
        message: `${result.count} product(s) deleted`,
    });
};
// ============================================================
// SERVICES
// ============================================================
const createService = async (req, res) => {
    const parsed = catalog_validation_1.createServiceSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const service = await catalog_service_1.default.createService(req.user.id, parsed.data);
    return res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
    });
};
const getMyServices = async (req, res) => {
    const services = await catalog_service_1.default.getMyServices(req.user.id);
    return res.status(200).json({ success: true, data: services });
};
const getServiceById = async (req, res) => {
    const service = await catalog_service_1.default.getServiceById(req.user.id, req.params.serviceId);
    return res.status(200).json({ success: true, data: service });
};
const updateService = async (req, res) => {
    const parsed = catalog_validation_1.updateServiceSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const service = await catalog_service_1.default.updateService(req.user.id, req.params.serviceId, parsed.data);
    return res.status(200).json({
        success: true,
        message: "Service updated successfully",
        data: service,
    });
};
const deleteService = async (req, res) => {
    await catalog_service_1.default.deleteService(req.user.id, req.params.serviceId);
    return res
        .status(200)
        .json({ success: true, message: "Service deleted successfully" });
};
const bulkUpdateServices = async (req, res) => {
    const schema = zod_1.default.object({
        serviceIds: zod_1.default
            .array(zod_1.default.string().uuid())
            .min(1, "At least one service ID is required"),
        isAvailable: zod_1.default.boolean(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await catalog_service_1.default.bulkUpdateServices(req.user.id, parsed.data.serviceIds, { isAvailable: parsed.data.isAvailable });
    return res.status(200).json({
        success: true,
        message: `${result.count} service(s) updated`,
        data: result,
    });
};
const bulkDeleteServices = async (req, res) => {
    const schema = zod_1.default.object({
        serviceIds: zod_1.default
            .array(zod_1.default.string().uuid())
            .min(1, "At least one service ID is required"),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const result = await catalog_service_1.default.bulkDeleteServices(req.user.id, parsed.data.serviceIds);
    return res.status(200).json({
        success: true,
        message: `${result.count} service(s) deleted`,
    });
};
const controller = {
    createProduct,
    getMyProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    bulkUpdateProducts,
    bulkDeleteProducts,
    createService,
    getMyServices,
    getServiceById,
    updateService,
    deleteService,
    bulkUpdateServices,
    bulkDeleteServices,
};
exports.default = controller;
