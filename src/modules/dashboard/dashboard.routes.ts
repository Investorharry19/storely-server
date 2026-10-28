import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { getDashboardData } from "./dashboard.controller";

const router = Router();
/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           example: '{"from":"2026-04-01","to":"2026-04-14","period":"day"}'
 *           description: JSON string containing from, to and period (day, week, month)
 *
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                     revenueChart:
 *                       type: array
 *                     salesByCategory:
 *                       type: array
 *                     recentOrders:
 *                       type: array
 *                     share:
 *                       type: object
 *
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authenticate, getDashboardData);

export default router;