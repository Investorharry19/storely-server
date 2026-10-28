"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const token_util_1 = require("../modules/auth/token.util");
/**
 * Authenticate middleware.
 * Validates the JWT access token from the Authorization header.
 * Attaches the decoded user payload to req.user on success.
 *
 * Usage: router.get('/protected', authenticate, handler)
 */
const authenticate = (req, res, next) => {
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
        const decoded = (0, token_util_1.verifyAccessToken)(token);
        req.user = { id: decoded.sub };
        next();
    }
    catch (err) {
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
exports.authenticate = authenticate;
