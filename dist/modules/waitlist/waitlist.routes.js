"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waitlist_controller_1 = __importDefault(require("./waitlist.controller"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Waitlist
 *   description: Waitlist management API
 */
/**
 * @swagger
 * /waitlist:
 *   post:
 *     summary: Join the waitlist
 *     tags: [Waitlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JoinWaitlistRequest'
 *     responses:
 *       201:
 *         description: Successfully joined the waitlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JoinWaitlistResponse'
 *       400:
 *         description: Validation error or already on waitlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 errors: { type: object }
 */
router.post("/", waitlist_controller_1.default.joinWaitlist);
/**
 * @swagger
 * /waitlist:
 *   get:
 *     summary: Get all waitlist entries
 *     tags: [Waitlist]
 *     responses:
 *       200:
 *         description: List of waitlist entries
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaitlistResponse'
 */
router.get("/", waitlist_controller_1.default.getWaitlist); // Note: In a real app, this should be protected
exports.default = router;
