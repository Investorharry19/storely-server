"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${req.method} ${req.path}:`, err.message);
    // Prisma unique constraint violation (e.g. duplicate slug or email)
    if (err.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: `A record with this ${err.meta?.target?.join(", ")} already exists`,
        });
    }
    // Prisma record not found
    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: "Record not found",
        });
    }
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: statusCode >= 500
            ? "Internal server error"
            : err.message || "Something went wrong",
    });
};
exports.errorHandler = errorHandler;
