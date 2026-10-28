import { Request, Response } from "express";
import paymentService from "./payment.service";

const getPayments = async (req: Request | any, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const status = req.query.status;
  const result = await paymentService.getPayments(req.user.id, {
    page,
    limit,
    status,
  });
  return res.status(200).json({ success: true, data: result });
};

const getSummary = async (req: Request | any, res: Response) => {
  const summary = await paymentService.getSummary(req.user.id);
  return res.status(200).json({ success: true, data: summary });
};

export default { getPayments, getSummary };
