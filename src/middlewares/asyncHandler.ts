import { Request, Response, NextFunction, RequestHandler } from "express";
import { ParsedQs } from "qs";

/**
 * Wraps async route handlers and forwards errors to Express error middleware.
 */
export function asyncHandler<
  P = Record<string, any>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
  Req extends Request<P, ResBody, ReqBody, ReqQuery, Locals> = Request<
    P,
    ResBody,
    ReqBody,
    ReqQuery,
    Locals
  >,
  T = any,
>(
  fn: (
    req: Req,
    res: Response<ResBody, Locals>,
    next: NextFunction,
  ) => Promise<T>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
  return (req, res, next) => {
    Promise.resolve(
      fn(req as Req, res as Response<ResBody, Locals>, next),
    ).catch(next);
  };
}
