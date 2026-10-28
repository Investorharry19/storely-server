import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Convert a business name to a URL-safe slug.
 * e.g. "Nefertiti Fashion!" → "nefertiti-fashion"
 */
export const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, ""); // trim leading/trailing hyphens
};

export const ensureUniqueSlug = async (
  baseSlug: string,
  excludeId: any = null,
) => {
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
