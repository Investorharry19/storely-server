"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtpExpiry = exports.generateOTP = void 0;
const generateOTP = (length = 6) => {
    return Math.floor(Math.random() * 10 ** length)
        .toString()
        .padStart(length, "0");
};
exports.generateOTP = generateOTP;
const getOtpExpiry = (minutes = 5) => {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + minutes);
    return expires;
};
exports.getOtpExpiry = getOtpExpiry;
