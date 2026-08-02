import { NextFunction, Request } from "express";

export const webhookVerification = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  (req as any).rawBody = req.body.toString("utf8");
  req.body = JSON.parse((req as any).rawBody);
  next();
};
