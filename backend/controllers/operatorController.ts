import { NextFunction, Request, Response } from "express";

import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { AdminRequestMapper } from "../dto-mapping/mapper/admin/AdminRequestMapper";
import { AdminResponseMapper } from "../dto-mapping/mapper/admin/AdminResponseMapper";
import { OperatorRequestMapper } from "../dto-mapping/mapper/operator/OperatorRequestMapper";
import { OperatorResponseMapper } from "../dto-mapping/mapper/operator/OperatorResponseMapper";
import { IOperatorController } from "../interfaces/IOperatorController";
import type { IOperatorService } from "../interfaces/IOperatorService";
import { Types } from "../types/types";
import { sendSuccessResponse } from "../utils/apiResponse";
import { CustomError } from "../utils/customError";
import { logger } from "../utils/logger";
@injectable()
export class OperatorController implements IOperatorController {
  constructor(
    @inject(Types.OperatorService) private _operatorService: IOperatorService,
  ) {}

  operatorRegister = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      logger.info(`Attempting registration for email ${req.body.email}`, {
        layer: "CONTROLLER",
        module: "OPERATOR",
        action: "REGISTER",
      });

      const result = await this._operatorService.operatorRegisterService(
        req.body,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.OPERATOR.SUCCESS.REGISTRATION_PROCESSING,
        result,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  operatorOtpverification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this._operatorService.operatorVerifyOtpService(req.body);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_VERIFIED,
        undefined,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  operatorResendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { operatorId } = req.body;
    try {
      const { otpExpire } =
        await this._operatorService.operatorResendOtpService(operatorId);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_SENT_EMAIL,
        otpExpire,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  loginOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`Operator login attempt`, {
        layer: "CONTROLLER",
        module: "Operator",
        action: "LOGIN",
        email: req.body.email,
      });
      const { accessToken, refreshToken, operatorData } =
        await this._operatorService.operatorLoginService(req.body);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.OPERATOR.SUCCESS.LOGGED_IN,
        operatorData,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  forgotOperatorPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { message } =
        await this._operatorService.operatorForgotPasswordService(
          req.body.email,
        );
      sendSuccessResponse(res, message, undefined, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  resetOperatorPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { message } =
        await this._operatorService.operatorResetPasswordService(
          req.params.token as string,
          req.body.newPassword,
        );
      sendSuccessResponse(res, message, undefined, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  operatorLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token").clearCookie("refresh_token");
      const { message } = this._operatorService.operatorLogoutService();
      sendSuccessResponse(res, message, undefined, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  updateOperator = async (req: Request, res: Response, next: NextFunction) => {
    const operatorId = req.user?.id as string;

    if (operatorId !== req.params.id) {
      return next(
        new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, 401),
      );
    }
    try {
      const updatedOperator = await this._operatorService.updateOperatorService(
        req.params.id as string,
        req.body,
      );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.OPERATOR.SUCCESS.UPDATED,
        updatedOperator,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  updateOperatorProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { image } = req.body;
      const operator =
        await this._operatorService.updateOperatorProfileImageService(
          req.user!.id,
          image,
        );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.OPERATOR.SUCCESS.IMAGE_UPDATED,
        operator,
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
      const { message } =
        await this._operatorService.resetPasswordAuthenticatedService(
          req.user!.id,
          req.body,
        );
      sendSuccessResponse(res, message, undefined, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  getOperatorVerificationRequests = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data =
        await this._operatorService.getOperatorVerificationRequestsService();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.ADMIN.SUCCESS.FETCH_OPERATOR_VERIFICATION_REQS,
        data,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  verifyOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const { message } = await this._operatorService.verifyOperatorService(
        id as string,
        req.body,
      );
      sendSuccessResponse(res, message, undefined, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  getPaginatedOperators = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [operators, totalCount] = await Promise.all([
        this._operatorService.getPaginatedOperatorsService(skip, limit),
        this._operatorService.getTotalOperatorsCount(),
      ]);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.ADMIN.SUCCESS.FETCH_OPERATORS,
        { operators, totalCount },
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getOperatorDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operator = await this._operatorService.getOperatorDetailsService(
        req.params.id as string,
      );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.ADMIN.SUCCESS.FETCH_OPERATOR_DETAILS,
        operator,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  AdminUpdateOperator = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const updatedOperator =
        await this._operatorService.adminUpdateOperatorService(
          req.params.id as string,
          req.body,
        );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.OPERATOR.SUCCESS.UPDATED,
        updatedOperator,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  blockOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blockedOperator = await this._operatorService.blockOperatorService(
        req.params.id as string,
        req.body,
      );
      const message = req.body.isBlocked
        ? RESPONSE_MESSAGES.OPERATOR.SUCCESS.BLOCKED
        : RESPONSE_MESSAGES.OPERATOR.SUCCESS.UNBLOCKED;

      sendSuccessResponse(res, message, blockedOperator, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  deleteOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this._operatorService.deleteOperatorService(
        req.params.id as string,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.OPERATOR.SUCCESS.DELETED,
        undefined,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
