import { Response, Request } from "express";

import orderService from "./order.service";
import { updateOrderStatusSchema, orderQuerySchema } from "./order.validations";

// ============================================================
// GET ORDERS (filtered, paginated)
// ============================================================

const getOrders = async (req: Request | any, res: Response) => {
  const parsed = orderQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const result = await orderService.getOrders(req.user.id, parsed.data);

  return res.status(200).json({ success: true, data: result });
};

// ============================================================
// GET SINGLE ORDER
// ============================================================

const getOrderById = async (req: Request | any, res: Response) => {
  const order = await orderService.getOrderById(
    req.user.id,
    req.params.orderId,
  );

  return res.status(200).json({ success: true, data: order });
};

// ============================================================
// UPDATE ORDER STATUS
// ============================================================

const updateOrderStatus = async (req: Request | any, res: Response) => {
  const parsed = updateOrderStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const order = await orderService.updateOrderStatus(
    req.user.id,
    req.params.orderId,
    parsed.data.status,
  );

  return res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: order,
  });
};

// ============================================================
// EXPORT AS CSV
// ============================================================

const exportCsv = async (req: Request | any, res: Response) => {
  const parsed = orderQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const csv = await orderService.exportOrdersAsCsv(req.user.id, parsed.data);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="storely-orders.csv"',
  );
  return res.status(200).send(csv);
};

// ============================================================
// EXPORT AS PDF
// ============================================================

const exportPdf = async (req: Request | any, res: Response) => {
  const parsed = orderQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const pdfBuffer = await orderService.exportOrdersAsPdf(
    req.user.id,
    parsed.data,
  );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="storely-orders.pdf"',
  );
  return res.status(200).send(pdfBuffer);
};

const controller = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  exportCsv,
  exportPdf,
};

export default controller;
