"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * authorizeAdmin middleware.
 * Must be used AFTER authenticate — requires req.user to be set.
 * Checks the user's role in the DB and rejects non-admins.
 */
const authorizeAdmin = async (req, res, next) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { role: true },
    });
    if (!user || user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required.",
        });
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
