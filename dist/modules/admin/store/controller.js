"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("./service"));
const validation_1 = require("./validation");
const getStores = async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const data = await service_1.default.getStores({ page, limit });
    return res.status(200).json({ success: true, data });
};
const getStoreDetail = async (req, res) => {
    const data = await service_1.default.getStoreById(req.params.id);
    if (!data) {
        return res.status(404).json({ success: false, message: "Store not found" });
    }
    return res.status(200).json({ success: true, data });
};
const getStoreProducts = async (req, res) => {
    const data = await service_1.default.getStoreProducts(req.params.storeId);
    return res.status(200).json({ success: true, data });
};
const getStoreOrders = async (req, res) => {
    const data = await service_1.default.getStoreOrders(req.params.storeId);
    return res.status(200).json({ success: true, data });
};
const suspendStore = async (req, res) => {
    const parsed = validation_1.suspendSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await service_1.default.suspendStore(req.user.id, req.params.storeId, parsed.data);
    return res
        .status(200)
        .json({ success: true, message: "Store suspended successfully", data });
};
const verifyStore = async (req, res) => {
    const data = await service_1.default.verifyStore(req.user.id, req.params.storeId);
    return res
        .status(200)
        .json({ success: true, message: "Store verified successfully", data });
};
const sendMessage = async (req, res) => {
    const parsed = validation_1.sendMessageSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await service_1.default.sendMessage(req.user.id, req.params.storeId, parsed.data);
    return res
        .status(200)
        .json({ success: true, message: "Message sent to store", data });
};
const changePlan = async (req, res) => {
    const parsed = validation_1.changePlanSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
            .status(400)
            .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }
    const data = await service_1.default.changePlan(req.user.id, req.params.storeId, parsed.data.plan);
    return res
        .status(200)
        .json({ success: true, message: "Plan change processed", data });
};
exports.default = {
    getStores,
    getStoreDetail,
    getStoreProducts,
    getStoreOrders,
    suspendStore,
    verifyStore,
    sendMessage,
    changePlan,
};
