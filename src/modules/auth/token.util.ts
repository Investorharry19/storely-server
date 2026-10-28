import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_SECRET: string | any = process.env.ACCESS_SECRET;
const REFRESH_SECRET: string | any = process.env.REFRESH_SECRET;
const ACCESS_EXPIRY: string | any = process.env.ACCESS_EXPIRY || "15m";
const REFRESH_EXPIRY: string | any = process.env.REFRESH_EXPIRY || "30d";

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error(
    "ACCESS_SECRET and REFRESH_SECRET must be set in environment variables",
  );
}

// ============================================================
// ACCESS TOKEN
// Short-lived (15 min). Sent in Authorization header.
// ============================================================

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ sub: userId, type: "access" }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRY,
    algorithm: "HS256",
  });
};

export const verifyAccessToken = (token: string) => {
  const decoded: any | JwtPayload = jwt.verify(token, ACCESS_SECRET);
  if (decoded?.type !== "access") {
    throw new Error("Invalid token type");
  }
  return decoded;
};

// ============================================================
// REFRESH TOKEN
// Long-lived (30 days). Stored as a hash in DB.
// Raw token returned to client — NEVER stored raw on server.
// On each use, old token is invalidated and a new one issued.
// ============================================================

export const generateRefreshToken = () => {
  // 256 bits of randomness — cryptographically secure
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
};

export const hashRefreshToken = (raw: string) => {
  return crypto.createHash("sha256").update(raw).digest("hex");
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};

// ============================================================
// REFRESH TOKEN EXPIRY DATE
// Used when storing the hash in the DB.
// ============================================================
export const getRefreshTokenExpiry = () => {
  const days = parseInt(REFRESH_EXPIRY.replace("d", ""), 10) || 30;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
};
