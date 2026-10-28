import { NextFunction, Request, Response } from "express";
import { ParsedQs } from "qs";

import { verifyAccessToken } from "../modules/auth/token.util";
import { string } from "zod";

/**
 * Authenticate middleware.
 * Validates the JWT access token from the Authorization header.
 * Attaches the decoded user payload to req.user on success.
 *
 * Usage: router.get('/protected', authenticate, handler)
 */
export const authenticate = (
  req: Request | any,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub };
    next();
  } catch (err: any) {
    // Distinguish expired from invalid — frontend can use this to trigger a token refresh
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please refresh your token.",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid authentication token. Please log in again.",
      code: "TOKEN_INVALID",
    });
  }
};

// export default authenticate;

export type AuthRequest<
  P = Record<string, any>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
> = Request<P, ResBody, ReqBody, ReqQuery, Locals> & { user: { id: string } };
