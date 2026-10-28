import { Response } from "express";

export const responseSuccess = (
  res: Response,
  message: string,
  data: any = null,
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const responseFailure = (
  res: Response,
  message: string,
  statusCode = 400,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};
