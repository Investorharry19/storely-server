"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const joinWaitlist = async (data) => {
    const existing = await prisma.waitlist.findUnique({
        where: { email: data.email },
    });
    if (existing) {
        const error = new Error("You are already on the waitlist!");
        error.statusCode = 400;
        throw error;
    }
    return await prisma.waitlist.create({
        data,
    });
};
const getWaitlist = async () => {
    return await prisma.waitlist.findMany({
        orderBy: { createdAt: "desc" },
    });
};
const waitlistService = {
    joinWaitlist,
    getWaitlist,
};
exports.default = waitlistService;
