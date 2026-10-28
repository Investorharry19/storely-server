"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseFailure = exports.responseSuccess = void 0;
const responseSuccess = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.responseSuccess = responseSuccess;
const responseFailure = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};
exports.responseFailure = responseFailure;
