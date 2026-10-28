"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const business_validation_1 = require("./business.validation");
const business_service_1 = require("./business.service");
const createBusiness = async (req, res) => {
    const parsed = business_validation_1.createBusinessSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        });
    }
    const business = await business_service_1.businessService.createBusiness(req.user.id, parsed.data, req.file);
    return res.status(201).json({
        success: true,
        message: "Business profile created successfully",
        data: {
            ...business,
            storeUrl: `${process.env.APP_URL}/${business.slug}`,
        },
    });
};
const getMyBusiness = async (req, res) => {
    const business = await business_service_1.businessService.getMyBusiness(req.user.id);
    return res.status(200).json({
        success: true,
        data: {
            ...business,
            storeUrl: `${process.env.APP_URL}/${business.slug}`,
        },
    });
};
const getBusinessBySlug = async (req, res) => {
    const business = await business_service_1.businessService.getBusinessBySlug(req.params.slug);
    return res.status(200).json({
        success: true,
        data: business,
    });
};
const updateBusiness = async (req, res) => {
    const parsed = business_validation_1.updateBusinessSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            errors: parsed.error.flatten().fieldErrors,
        });
    }
    const business = await business_service_1.businessService.updateBusiness(req.user.id, parsed.data);
    return res.status(200).json({
        success: true,
        message: "Business profile updated successfully",
        data: {
            ...business,
            storeUrl: `${process.env.APP_URL}/${business.slug}`,
        },
    });
};
const updateLogo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No logo file uploaded",
        });
    }
    const business = await business_service_1.businessService.updateLogoUrl(req.user.id, req.file);
    return res.status(200).json({
        success: true,
        message: "Logo updated successfully",
        data: { logoUrl: business.logoUrl },
    });
};
exports.controller = {
    createBusiness,
    getMyBusiness,
    getBusinessBySlug,
    updateBusiness,
    updateLogo,
};
