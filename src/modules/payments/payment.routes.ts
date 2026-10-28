import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { authenticate } from "../../middlewares/auth.middleware";
import controller from "./payment.controller";

const router = Router();
router.get("/summary", authenticate, asyncHandler(controller.getSummary));
router.get("/", authenticate, asyncHandler(controller.getPayments));

export default router;
