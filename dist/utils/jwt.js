"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.loginToken = exports.generateToken = void 0;
exports.generateResetPasswordToken = generateResetPasswordToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const generateToken = (payload) => {
    const options = {
        expiresIn: env_1.env.jwtExpiresIn,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, options);
};
exports.generateToken = generateToken;
const loginToken = (payload) => {
    const options = {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, options);
};
exports.loginToken = loginToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
};
exports.verifyToken = verifyToken;
function generateResetPasswordToken(payload) {
    const options = {
        expiresIn: 1000 * 10,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, options);
}
