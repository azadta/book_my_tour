import { NextFunction, Request, Response } from "express";

import { CustomError } from "../utils/customError";

import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { AdminRequestMapper } from "../dto-mapping/mapper/admin/AdminRequestMapper";
import { AdminResponseMapper } from "../dto-mapping/mapper/admin/AdminResponseMapper";
import { IAdminController } from "../interfaces/IAdminController";
import type { IAdminService } from "../interfaces/IAdminService";
import { Types } from "../types/types";
import { logger } from "../utils/logger";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(Types.AdminService) private adminService: IAdminService,
  ) {}

  loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const dto = AdminRequestMapper.toLoginRequestDTO(req.body);

    try {
      logger.info(`Admin login attempt`, {
        layer: "CONTROLLER",
        module: "ADMIN",
        action: "LOGIN",
        email: req.body.email,
      });
      const { accessToken, refreshToken, adminData } =
        await this.adminService.loginAdminService(dto);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res
        .status(StatusCode.OK)
        .json(AdminResponseMapper.toAdminResponseDTO(adminData));
    } catch (error) {
      next(error);
    }
  };

  logoutAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token").clearCookie("refresh_token");
      res
        .status(StatusCode.OK)
        .json({ message: RESPONSE_MESSAGES.AUTH.SUCCESS.ADMIN_LOGOUT });
    } catch (error) {
      next(error);
    }
  };

  updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.id !== req.params.id) {
      return next(
        new CustomError(
          RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
          StatusCode.UNAUTHORIZED,
        ),
      );
    }

    try {
      const dto = AdminRequestMapper.toUpdateAdminRequestDTO(req.body);
      const updatedAdmin = await this.adminService.updateAdminService(
        req.params.id as string,
        dto,
      );
      if (!updatedAdmin)
        return next(
          new CustomError(
            RESPONSE_MESSAGES.ADMIN.ERROR.NOT_FOUND,
            StatusCode.NOT_FOUND,
          ),
        );
      //eslint-disable-next-line @typescript-eslint/no-unused-vars

      res
        .status(StatusCode.OK)
        .json(AdminResponseMapper.toAdminResponseDTO(updatedAdmin));
    } catch (error) {
      next(error);
    }
  };

  updateAdminProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const dto = AdminRequestMapper.toUpdateProfileImageRequestDTO(req.body);

      const admin = await this.adminService.updateProfieImageService(
        req.user!.id,
        dto,
      );
      //eslint-disable-next-line @typescript-eslint/no-unused-vars

      res
        .status(StatusCode.OK)
        .json(AdminResponseMapper.toAdminResponseDTO(admin));
    } catch (error) {
      next(error);
    }
  };
  resetPasswordAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const dto = AdminRequestMapper.toResetPasswordAuthenticatedRequestDTO(
        req.body,
      );
      const data = await this.adminService.resetPasswordAuthenticatedService(
        req.user!.id,
        dto,
      );
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };
}
