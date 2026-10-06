import type { NextFunction, Request, RequestHandler, Response } from "express";

/** Express 4 doesn't forward rejected promises to the error handler; this does. */
export function asyncHandler(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
