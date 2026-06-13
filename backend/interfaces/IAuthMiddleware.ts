import { NextFunction, Request, Response } from "express";

export interface IAuthMiddleware {
  verifyRole: (
    ...allowedRoles: string[]
  ) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
