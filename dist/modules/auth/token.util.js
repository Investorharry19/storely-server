"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefreshTokenExpiry = exports.verifyRefreshToken = exports.hashRefreshToken = exports.generateRefreshToken = exports.verifyAccessToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_EXPIRY = process.env.ACCESS_EXPIRY || "15m";
const REFRESH_EXPIRY = process.env.REFRESH_EXPIRY || "30d";
if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error("ACCESS_SECRET and REFRESH_SECRET must be set in environment variables");
}
// ============================================================
// ACCESS TOKEN
// Short-lived (15 min). Sent in Authorization header.
// ============================================================
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ sub: userId, type: "access" }, ACCESS_SECRET, {
        expiresIn: ACCESS_EXPIRY,
        algorithm: "HS256",
    });
};
exports.generateAccessToken = generateAccessToken;
const verifyAccessToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, ACCESS_SECRET);
    if (decoded?.type !== "access") {
        throw new Error("Invalid token type");
    }
    return decoded;
};
exports.verifyAccessToken = verifyAccessToken;
// ============================================================
// REFRESH TOKEN
// Long-lived (30 days). Stored as a hash in DB.
// Raw token returned to client — NEVER stored raw on server.
// On each use, old token is invalidated and a new one issued.
// ============================================================
const generateRefreshToken = () => {
    // 256 bits of randomness — cryptographically secure
    const raw = crypto_1.default.randomBytes(32).toString("hex");
    const hash = crypto_1.default.createHash("sha256").update(raw).digest("hex");
    return { raw, hash };
};
exports.generateRefreshToken = generateRefreshToken;
const hashRefreshToken = (raw) => {
    return crypto_1.default.createHash("sha256").update(raw).digest("hex");
};
exports.hashRefreshToken = hashRefreshToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
// ============================================================
// REFRESH TOKEN EXPIRY DATE
// Used when storing the hash in the DB.
// ============================================================
const getRefreshTokenExpiry = () => {
    const days = parseInt(REFRESH_EXPIRY.replace("d", ""), 10) || 30;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    return expiry;
};
exports.getRefreshTokenExpiry = getRefreshTokenExpiry;
