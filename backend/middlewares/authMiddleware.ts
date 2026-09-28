import { NextFunction, Request, Response } from "express";

import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import { StatusCode } from "../constants/statusCodeConstants";
import type { IAdminRepository } from "../interfaces/IAdminRepository";
import { IAuthMiddleware } from "../interfaces/IAuthMiddleware";
import type { IOperatorRepository } from "../interfaces/IOperatorRepository";
import type { ISecurityService } from "../interfaces/ISecurityService";
import type { IUserRepository } from "../interfaces/IUserRepository";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";
@injectable()
export class AuthMiddleware implements IAuthMiddleware {
  constructor(
    @inject(Types.SecurityService) private _securityService: ISecurityService,
    @inject(Types.UserRepository) private _userRepository: IUserRepository,
    @inject(Types.OperatorRepository)
    private _operatorRepository: IOperatorRepository,
    @inject(Types.AdminRepository) private _adminRepository: IAdminRepository,
  ) {}

  verifyRole = (...allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.access_token;

      if (!token) {
        return next(
          new CustomError(
            RESPONSE_MESSAGES.AUTH.ERROR.TOKEN_MISSING,
            StatusCode.UNAUTHORIZED,
          ),
        );
      }

      try {
        const decoded = this._securityService.verifyAccessToken(token);

        if (!allowedRoles.includes(decoded.role)) {
          return next(
            new CustomError(
              RESPONSE_MESSAGES.AUTH.ERROR.ACCESS_DENIED,
              StatusCode.FORBIDDEN,
            ),
          );
        }

        if (decoded.role === "user") {
          const user = await this._userRepository.findById(decoded.id);
          if (!user)
            return next(
              new CustomError(
                RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND,
                StatusCode.NOT_FOUND,
              ),
            );
          if (user.isBlocked)
            return next(
              new CustomError(
                RESPONSE_MESSAGES.USER.SUCCESS.BLOCKED,
                StatusCode.FORBIDDEN,
              ),
            );
        } else if (decoded.role === "operator") {
          const operator = await this._operatorRepository.findById(decoded.id);
          if (!operator)
            return next(
              new CustomError(
                RESPONSE_MESSAGES.OPERATOR.ERROR.NOT_FOUND,
                StatusCode.NOT_FOUND,
              ),
            );
          if (operator.isBlocked)
            return next(
              new CustomError(
                RESPONSE_MESSAGES.OPERATOR.SUCCESS.BLOCKED,
                StatusCode.FORBIDDEN,
              ),
            );
        } else if (decoded.role === "admin") {
          const admin = await this._adminRepository.findById(decoded.id);
          if (!admin)
            return next(
              new CustomError(
                RESPONSE_MESSAGES.ADMIN.ERROR.NOT_FOUND,
                StatusCode.NOT_FOUND,
              ),
            );
        }

        req.user = decoded;

        next();
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          return next(
            new CustomError(
              RESPONSE_MESSAGES.AUTH.ERROR.EXPIRED_TOKEN,
              StatusCode.UNAUTHORIZED,
            ),
          );
        }
        next(error);
      }
    };
  };
}
