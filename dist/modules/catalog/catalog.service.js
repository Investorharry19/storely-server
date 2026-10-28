"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const prisma = new client_1.PrismaClient();
// ============================================================
// HELPERS
// ============================================================
const getBusinessOrThrow = async (userId) => {
    const business = await prisma.business.findUnique({ where: { userId } });
    if (!business) {
        const error = new Error("Business profile not found. Please complete onboarding first.");
        error.statusCode = 404;
        throw error;
    }
    return business;
};
const getProductOrThrow = async (productId, businessId) => {
    const product = await prisma.product.findFirst({
        where: { id: productId, businessId },
    });
    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }
    return product;
};
const getServiceOrThrow = async (serviceId, businessId) => {
    const service = await prisma.service.findFirst({
        where: { id: serviceId, businessId },
    });
    if (!service) {
        const error = new Error("Service not found");
        error.statusCode = 404;
        throw error;
    }
    return service;
};
// ============================================================
// PRODUCTS
// ============================================================
const createProduct = async (userId, data, files) => {
    const business = await getBusinessOrThrow(userId);
    //   // Upload images to Cloudinary if provided
    let imageData = [];
    if (files && files.length > 0) {
        const uploadPromises = files.map((file, index) => {
            return new Promise((resolve, reject) => {
                cloudinary_1.default.uploader
                    .upload_stream({ folder: `storely/${business.id}` }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                        });
                })
                    .end(file.buffer);
            });
        });
        imageData = await Promise.all(uploadPromises);
    }
    return prisma.product.create({
        data: {
            businessId: business.id,
            name: data.name,
            description: data.description ?? null,
            price: data.price,
            category: data.category ?? null,
            stockQuantity: data.stockQuantity ?? 0,
            isAvailable: data.isAvailable ?? true,
            imageUrls: imageData ?? [],
        },
    });
};
const getMyProducts = async (userId) => {
    const business = await getBusinessOrThrow(userId);
    return prisma.product.findMany({
        where: { businessId: business.id },
        orderBy: { createdAt: "desc" },
    });
};
const getProductById = async (userId, productId) => {
    const business = await getBusinessOrThrow(userId);
    return getProductOrThrow(productId, business.id);
};
const updateProduct = async (userId, productId, data, files = [], imageOrder) => {
    const business = await getBusinessOrThrow(userId);
    const existingProduct = await getProductOrThrow(productId, business.id);
    const uploadedImages = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
        cloudinary_1.default.uploader
            .upload_stream({ folder: `storely/${business.id}` }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
        })
            .end(file.buffer);
    })));
    let orderedImages = undefined;
    if (imageOrder) {
        const currentImages = Array.isArray(existingProduct.imageUrls)
            ? existingProduct.imageUrls
            : [];
        const nextImages = imageOrder
            .map((entry) => {
            if (entry.type === "new")
                return uploadedImages[entry.index ?? -1];
            return currentImages.find((image) => (typeof image === "string" ? image : image.url) === entry.url);
        })
            .filter(Boolean);
        // Never replace a valid gallery with an empty array because a malformed
        // or stale client payload omitted the existing image URLs.
        if (nextImages.length > 0)
            orderedImages = nextImages;
    }
    else if (files.length > 0) {
        orderedImages = [
            ...(Array.isArray(data.imageUrls) ? data.imageUrls : []),
            ...uploadedImages,
        ];
    }
    else if (Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
        orderedImages = data.imageUrls;
    }
    return prisma.product.update({
        where: { id: productId },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.price !== undefined && { price: data.price }),
            ...(data.category !== undefined && { category: data.category }),
            ...(data.stockQuantity !== undefined && {
                stockQuantity: data.stockQuantity,
            }),
            ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
            ...(orderedImages !== undefined && {
                imageUrls: orderedImages,
            }),
        },
    });
};
const deleteProduct = async (userId, productId) => {
    const business = await getBusinessOrThrow(userId);
    await getProductOrThrow(productId, business.id);
    return prisma.product.delete({ where: { id: productId } });
};
/**
 * Bulk toggle visibility (show/hide) for multiple products at once.
 * PRD requirement: bulk actions — hide/show multiple items.
 */
const bulkUpdateProducts = async (userId, productIds, data) => {
    const business = await getBusinessOrThrow(userId);
    return prisma.product.updateMany({
        where: {
            id: { in: productIds },
            businessId: business.id,
        },
        data: {
            ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        },
    });
};
/**
 * Bulk delete multiple products at once.
 */
const bulkDeleteProducts = async (userId, productIds) => {
    const business = await getBusinessOrThrow(userId);
    return prisma.product.deleteMany({
        where: {
            id: { in: productIds },
            businessId: business.id,
        },
    });
};
// ============================================================
// SERVICES
// ============================================================
const createService = async (userId, data) => {
    const business = await getBusinessOrThrow(userId);
    return prisma.service.create({
        data: {
            businessId: business.id,
            name: data.name,
            description: data.description ?? null,
            price: data.price,
            priceType: data.priceType ?? "FIXED",
            category: data.category ?? null,
            isAvailable: data.isAvailable ?? true,
        },
    });
};
const getMyServices = async (userId) => {
    const business = await getBusinessOrThrow(userId);
    return prisma.service.findMany({
        where: { businessId: business.id },
        orderBy: { createdAt: "desc" },
    });
};
const getServiceById = async (userId, serviceId) => {
    const business = await getBusinessOrThrow(userId);
    return getServiceOrThrow(serviceId, business.id);
};
const updateService = async (userId, serviceId, data) => {
    const business = await getBusinessOrThrow(userId);
    await getServiceOrThrow(serviceId, business.id);
    return prisma.service.update({
        where: { id: serviceId },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.price !== undefined && { price: data.price }),
            ...(data.priceType !== undefined && { priceType: data.priceType }),
            ...(data.category !== undefined && { category: data.category }),
            ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        },
    });
};
const deleteService = async (userId, serviceId) => {
    const business = await getBusinessOrThrow(userId);
    await getServiceOrThrow(serviceId, business.id);
    return prisma.service.delete({ where: { id: serviceId } });
};
/**
 * Bulk toggle visibility for multiple services at once.
 */
const bulkUpdateServices = async (userId, serviceIds, data) => {
    const business = await getBusinessOrThrow(userId);
    return prisma.service.updateMany({
        where: {
            id: { in: serviceIds },
            businessId: business.id,
        },
        data: {
            ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        },
    });
};
/**
 * Bulk delete multiple services at once.
 */
const bulkDeleteServices = async (userId, serviceIds) => {
    const business = await getBusinessOrThrow(userId);
    return prisma.service.deleteMany({
        where: {
            id: { in: serviceIds },
            businessId: business.id,
        },
    });
};
const catalogService = {
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
exports.default = catalogService;
