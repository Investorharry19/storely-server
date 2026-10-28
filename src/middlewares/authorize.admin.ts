import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * authorizeAdmin middleware.
 * Must be used AFTER authenticate — requires req.user to be set.
 * Checks the user's role in the DB and rejects non-admins.
 */
export const authorizeAdmin = async (
  req: Request | any,
  res: Response,
  next: NextFunction,
) => {
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
