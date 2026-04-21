import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { ISecurityService } from "../interfaces/ISecurityService.js";
import { IUserRepository } from "../interfaces/IUserRepository.js";
import { CustomError } from "./customError.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; role: string };
    }
  }
}

export class AuthMiddleware {
  constructor(
    private securityService: ISecurityService,
    private userRepository: IUserRepository,
  ) {}

  verifyRole = (...allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.access_token;

      if (!token)
        return next(new CustomError("Unauthorized: No token provided", 401));

      try {
        const decoded = this.securityService.verifyAccessToken(token);

        if (!allowedRoles.includes(decoded.role)) {
          return next(
            new CustomError("Access denied: Insufficient permissions", 403),
          );
        }

        if (decoded.role === "user") {
          const user = await this.userRepository.findById(decoded.id);
          if (!user) return next(new CustomError("User not found", 404));
          if (user.isBlocked)
            return next(new CustomError("Account is blocked", 403));
        }

        req.user = decoded;

        next();
      } catch (error) {
        return next(new CustomError("Invalid or expired token", 403));
      }
    };
  };
}
