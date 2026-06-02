import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { ISecurityService } from "../interfaces/ISecurityService.js";
import { IUserRepository } from "../interfaces/IUserRepository.js";
import { CustomError } from "../utils/customError.js";
import { IOperatorRepository } from "../interfaces/IOperatorRepository.js";
import { IAdminRepository } from "../interfaces/IAdminRepository.js";
import { StatusCode } from "../constants/statusCodeConstants.js";

export class AuthMiddleware {
  constructor(
    private securityService: ISecurityService,
    private userRepository: IUserRepository,
    private operatorRepository: IOperatorRepository,
    private adminRepository: IAdminRepository,
  ) {}

  verifyRole = (...allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.access_token;

      if (!token)
        return next(new CustomError("Unauthorized: No token provided", StatusCode.UNAUTHORIZED));

      try {
        const decoded = this.securityService.verifyAccessToken(token);

        if (!allowedRoles.includes(decoded.role)) {
          return next(
            new CustomError("Access denied: Insufficient permissions", StatusCode.FORBIDDEN),
          );
        }

        if (decoded.role === "user") {
          const user = await this.userRepository.findById(decoded.id);
          if (!user) return next(new CustomError("User not found",StatusCode.NOT_FOUND));
          if (user.isBlocked)
            return next(new CustomError("Account is blocked", StatusCode.FORBIDDEN));
        } else if (decoded.role === "operator") {
          const operator = await this.operatorRepository.findById(decoded.id);
          if (!operator)
            return next(new CustomError("Operator not found", StatusCode.NOT_FOUND));
          if (operator.isBlocked)
            return next(new CustomError("Account is blocked", StatusCode.FORBIDDEN));
        } else if (decoded.role === "admin") {
          const admin = await this.adminRepository.findById(decoded.id);
          if (!admin) return next(new CustomError("Admin not found", StatusCode.NOT_FOUND));
        }

        req.user = decoded;

        next();
      } catch (error:any) {
        if(error.name==='TokenExpiredError'){
          return next(new CustomError('Token expired',StatusCode.UNAUTHORIZED)) 
        }
        next(error);
      }
    };
  };
}
