import { Router } from "express";
import waitlistController from "./waitlist.controller";

const router = Router();

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
router.post("/", waitlistController.joinWaitlist);

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
router.get("/", waitlistController.getWaitlist); // Note: In a real app, this should be protected

export default router;
