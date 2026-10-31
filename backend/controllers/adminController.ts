import { NextFunction, Request, Response } from "express";

import { CustomError } from "../utils/customError";

import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { AdminResponseDTO } from "../dto-mapping/dto/admin/adminResponseDTO";
import { IAdminController } from "../interfaces/IAdminController";
import type { IAdminService } from "../interfaces/IAdminService";
import { Types } from "../types/types";
import { sendSuccessResponse } from "../utils/apiResponse";
import { logger } from "../utils/logger";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(Types.AdminService) private _adminService: IAdminService,
  ) {}

  loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`Admin login attempt`, {
        layer: "CONTROLLER",
        module: "ADMIN",
        action: "LOGIN",
        email: req.body.email,
      });
      const { accessToken, refreshToken, adminData } =
        await this._adminService.loginAdminService(req.body);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });

      sendSuccessResponse<AdminResponseDTO>(
        res,
        RESPONSE_MESSAGES.ADMIN.SUCCESS.LOGIN,
        adminData,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  logoutAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token").clearCookie("refresh_token");
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.AUTH.SUCCESS.ADMIN_LOGOUT,
        undefined,
        StatusCode.OK,
      );
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
      const updatedAdmin = await this._adminService.updateAdminService(
        req.params.id as string,
        req.body,
      );

      //eslint-disable-next-line @typescript-eslint/no-unused-vars

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.ADMIN.SUCCESS.UPDATE,
        updatedAdmin,
        StatusCode.OK,
      );
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
      const admin = await this._adminService.updateProfieImageService(
        req.user!.id,
        req.body,
      );
      //eslint-disable-next-line @typescript-eslint/no-unused-vars

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.ADMIN.SUCCESS.UPDATE_IMAGE,
        admin,
        StatusCode.OK,
      );
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
      await this._adminService.resetPasswordAuthenticatedService(
        req.user!.id,
        req.body,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.ADMIN.SUCCESS.UPDATE_PASSWORD,
        undefined,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
