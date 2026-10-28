"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = void 0;
const dashboard_service_1 = __importDefault(require("./dashboard.service"));
const dashboardFilter_validation_1 = require("./dashboardFilter.validation");
const getDashboardData = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const parsed = dashboardFilter_validation_1.dashboardQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors
            });
        }
        const query = parsed.data;
        const data = await dashboard_service_1.default.getDashboardData(userId, query);
        return res.status(200).json({
            success: true,
            message: "Dashboard fetched successfully",
            data,
        });
    }
    catch (err) {
        console.error("DASHBOARD ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error",
        });
    }
};
exports.getDashboardData = getDashboardData;
