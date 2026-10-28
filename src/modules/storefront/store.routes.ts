import { Router } from "express";
const router = Router();
import { asyncHandler } from "../../middlewares/asyncHandler";
import controller from "./stotre.controller";

// All store routes are fully public — no authentication required.
// Customers access these via the shareable store link.

// GET /store/:slug                           — main storefront (business + products + services)
// GET /store/:slug/products/:productId       — single product detail
// GET /store/:slug/services/:serviceId       — single service detail

router.get("/:slug", asyncHandler(controller.getStorefront));
router.get(
  "/:slug/products/:productId",
  asyncHandler(controller.getProductDetail),
);
router.get(
  "/:slug/services/:serviceId",
  asyncHandler(controller.getServiceDetail),
);

const StoreFrontRoutes = router;

export default StoreFrontRoutes;
