"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../prisma/client");
const logAdminAction = async ({ adminId, action, entityType, entityId, details, }) => {
    return client_1.prisma.adminActionLog.create({
        data: {
            adminId,
            action,
            entityType,
            entityId,
            details,
        },
    });
};
exports.default = { logAdminAction };
