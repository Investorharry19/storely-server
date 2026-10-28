import { Request, Response } from "express";
import dashboardService from "./dashboard.service";
import { dashboardQuerySchema } from "./dashboardFilter.validation";

export const getDashboardData = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const parsed = dashboardQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors
      });
    }

    const query = parsed.data;

    const data = await dashboardService.getDashboardData(userId, query);

    return res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully",
      data,
    });
  } catch (err: any) {
    console.error("DASHBOARD ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};