"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUniqueSlug = exports.generateSlug = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Convert a business name to a URL-safe slug.
 * e.g. "Nefertiti Fashion!" → "nefertiti-fashion"
 */
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove special characters
        .replace(/\s+/g, "-") // spaces to hyphens
        .replace(/-+/g, "-") // collapse multiple hyphens
        .replace(/^-|-$/g, ""); // trim leading/trailing hyphens
};
exports.generateSlug = generateSlug;
const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
    let slug = baseSlug;
    let suffix = 1;
    while (true) {
        const existing = await prisma.business.findUnique({ where: { slug } });
        // No conflict, or the conflict is the business being updated
        if (!existing || existing.id === excludeId) {
            return slug;
        }
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
    }
};
exports.ensureUniqueSlug = ensureUniqueSlug;
