import { Request, Response } from "express";
import adminService from "./admin.service";
import {
  paginationSchema,
  userQuerySchema,
  transactionQuerySchema,
  orderQuerySchema,
  revenueQuerySchema,
  ticketQuerySchema,
  resolveTicketSchema,
  userIdSchema,
  paymentIdSchema,
  ticketIdSchema,
} from "./admin.validation";

// ============================================================
// DASHBOARD METRICS
// ============================================================
const getDashboardMetrics = async (req: Request | any, res: Response) => {
  const data = await adminService.getDashboardMetrics();
  return res.status(200).json({ success: true, data });
};

// ============================================================
// USERS
// ============================================================
const getPendingUsers = async (req: Request | any, res: Response) => {
  const parsed = paginationSchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await adminService.getPendingUsers(parsed.data);
  return res.status(200).json({ success: true, data });
};

const getAllUsers = async (req: Request | any, res: Response) => {
  const parsed: any = userQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await adminService.getAllUsers(parsed.data);
  return res.status(200).json({ success: true, data });
};

const getUserDetail = async (req: Request | any, res: Response) => {
  const data = await adminService.getUserDetail(req.params.id);
  return res.status(200).json({ success: true, data });
};

const approveUser = async (req: Request | any, res: Response) => {
  const parsed = userIdSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const user = await adminService.approveUser(parsed.data.userId);
  return res
    .status(200)
    .json({ success: true, message: "User approved successfully", data: user });
};

const rejectUser = async (req: Request | any, res: Response) => {
  const parsed = userIdSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const user = await adminService.rejectUser(parsed.data.userId);
  return res
    .status(200)
    .json({ success: true, message: "User rejected", data: user });
};

// ============================================================
// ORDERS
// ============================================================
const getRecentOrders = async (req: Request | any, res: Response) => {
  const parsed = paginationSchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await adminService.getRecentOrders(parsed.data);
  return res.status(200).json({ success: true, data });
};

const getOrderDetail = async (req: Request | any, res: Response) => {
  const data = await adminService.getOrderDetail(req.params.id);
  return res.status(200).json({ success: true, data });
};

const getAllOrders = async (req: Request | any, res: Response) => {
  const parsed: any = orderQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await adminService.getAllOrders(parsed.data);
  return res.status(200).json({ success: true, data });
};

// ============================================================
// PAYMENTS
// ============================================================
const getTransactions = async (req: Request | any, res: Response) => {
  const parsed: any = transactionQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await adminService.getTransactions(parsed.data);
  return res.status(200).json({ success: true, data });
};

const refundPayment = async (req: Request | any, res: Response) => {
  const parsed = paymentIdSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await adminService.refundPayment(parsed.data.paymentId);
  return res
    .status(200)
    .json({ success: true, message: "Payment refunded successfully", data });
};

const getAllRevenue = async (req: Request | any, res: Response) => {
  const parsed: any = revenueQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await adminService.getAllRevenue(parsed.data);
  return res.status(200).json({ success: true, data });
};

const getRevenueDetail = async (req: Request | any, res: Response) => {
  const data = await adminService.getRevenueDetail(req.params.id);
  return res.status(200).json({ success: true, data });
};

// ============================================================
// SUPPORT TICKETS
// ============================================================
const getPaymentIssues = async (req: Request | any, res: Response) => {
  const parsed = paginationSchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await adminService.getPaymentIssues(parsed.data);
  return res.status(200).json({ success: true, data });
};

const getPlatformTickets = async (req: Request | any, res: Response) => {
  const parsed: any = ticketQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const data = await adminService.getPlatformTickets(parsed.data);
  return res.status(200).json({ success: true, data });
};

const resolveTicket = async (req: Request | any, res: Response) => {
  const idParsed = ticketIdSchema.safeParse(req.body);
  if (!idParsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: idParsed.error.flatten().fieldErrors });
  }

  const bodyParsed: any = resolveTicketSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: bodyParsed.error.flatten().fieldErrors });
  }

  const data = await adminService.resolveTicket(
    idParsed.data.ticketId,
    bodyParsed.data,
  );
  return res
    .status(200)
    .json({ success: true, message: "Ticket updated successfully", data });
};

const controller = {
  getDashboardMetrics,
  getPendingUsers,
  getAllUsers,
  getUserDetail,
  approveUser,
  rejectUser,
  getRecentOrders,
  getOrderDetail,
  getAllOrders,
  getTransactions,
  refundPayment,
  getAllRevenue,
  getRevenueDetail,
  getPaymentIssues,
  getPlatformTickets,
  resolveTicket,
};

export default controller;
