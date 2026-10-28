"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ============================================================
// GET STOREFRONT
// Returns business details + all available products + services.
// This is the main page customers land on.
// ============================================================
const getStorefront = async (slug) => {
    const business = await prisma.business.findUnique({
        where: { slug },
        select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            category: true,
            description: true,
            phone: true,
            email: true,
            website: true,
            location: true,
            logoUrl: true,
            isActive: true,
            products: {
                where: { isAvailable: true },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    category: true,
                    stockQuantity: true,
                    imageUrls: true,
                },
            },
            services: {
                where: { isAvailable: true },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    priceType: true,
                    category: true,
                    imageUrl: true,
                },
            },
        },
    });
    if (!business || !business.isActive) {
        const error = new Error("Store not found");
        error.statusCode = 404;
        throw error;
    }
    return {
        ...business,
        storeUrl: `${process.env.APP_URL}/${business.slug}`,
    };
};
// ============================================================
// GET PRODUCT DETAIL
// Returns a single product — verifies it belongs to this store.
// ============================================================
const getProductDetail = async (slug, productId) => {
    const business = await prisma.business.findUnique({
        where: { slug },
        select: { id: true, isActive: true, name: true },
    });
    if (!business || !business.isActive) {
        const error = new Error("Store not found");
        error.statusCode = 404;
        throw error;
    }
    const product = await prisma.product.findFirst({
        where: {
            id: productId,
            businessId: business.id,
            isAvailable: true,
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
            stockQuantity: true,
            imageUrls: true,
        },
    });
    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }
    return {
        ...product,
        businessName: business.name,
        storeUrl: `${process.env.APP_URL}/${slug}`,
    };
};
// ============================================================
// GET SERVICE DETAIL
// Returns a single service — verifies it belongs to this store.
// ============================================================
const getServiceDetail = async (slug, serviceId) => {
    const business = await prisma.business.findUnique({
        where: { slug },
        select: { id: true, isActive: true, name: true },
    });
    if (!business || !business.isActive) {
        const error = new Error("Store not found");
        error.statusCode = 404;
        throw error;
    }
    const service = await prisma.service.findFirst({
        where: {
            id: serviceId,
            businessId: business.id,
            isAvailable: true,
        },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            priceType: true,
            category: true,
            imageUrl: true,
        },
    });
    if (!service) {
        const error = new Error("Service not found");
        error.statusCode = 404;
        throw error;
    }
    return {
        ...service,
        businessName: business.name,
        storeUrl: `${process.env.APP_URL}/${slug}`,
    };
};
const storeService = { getStorefront, getProductDetail, getServiceDetail };
exports.default = storeService;
