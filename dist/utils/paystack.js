"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTransaction = exports.initializeTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
if (!PAYSTACK_SECRET_KEY) {
    console.warn("PAYSTACK_SECRET_KEY is not defined in environment variables");
}
const paystackClient = axios_1.default.create({
    baseURL: "https://api.paystack.co",
    headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
    },
});
const initializeTransaction = async (email, amount, callbackUrl, metadata) => {
    try {
        const response = await paystackClient.post("/transaction/initialize", {
            email,
            amount: amount * 100, // Paystack expects amount in kobo
            callback_url: callbackUrl,
            metadata,
        });
        return response.data.data;
    }
    catch (error) {
        throw new Error(`Paystack initialization failed: ${error.response?.data?.message || error.message}`);
    }
};
exports.initializeTransaction = initializeTransaction;
const verifyTransaction = async (reference) => {
    try {
        const response = await paystackClient.get(`/transaction/verify/${reference}`);
        return response.data.data;
    }
    catch (error) {
        throw new Error(`Paystack verification failed: ${error.response?.data?.message || error.message}`);
    }
};
exports.verifyTransaction = verifyTransaction;
