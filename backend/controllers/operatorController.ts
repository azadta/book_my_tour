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
import { CustomError } from "../utils/customError";
import { logger } from "../utils/logger";
@injectable()
export class OperatorController implements IOperatorController {
  constructor(
    @inject(Types.OperatorService) private operatorService: IOperatorService,
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
      const dto = OperatorRequestMapper.toOperatorRegisterRequestDTO(req.body);
      const result = await this.operatorService.operatorRegisterService(dto);
      res.status(StatusCode.CREATED).json({
        success: true,
        message: RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_SENT_EMAIL,
        ...OperatorResponseMapper.toOperatorRegisterRespsonseDTO(result),
      });
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
      const dto = OperatorRequestMapper.toVerityOperatorOtpDTO(req.body);
      await this.operatorService.operatorVerifyOtpService(dto);
      res.status(StatusCode.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_VERIFIED,
      });
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
        await this.operatorService.operatorResendOtpService(operatorId);
      res.status(StatusCode.OK).json({
        succuss: true,
        message: RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_SENT_EMAIL,
        otpExpire,
      });
    } catch (error) {
      next(error);
    }
  };

  loginOperator = async (req: Request, res: Response, next: NextFunction) => {
    const dto = OperatorRequestMapper.toOperatorLoginRequestDTO(req.body);

    try {
      logger.info(`Operator login attempt`, {
        layer: "CONTROLLER",
        module: "Operator",
        action: "LOGIN",
        email: req.body.email,
      });
      const { accessToken, refreshToken, operatorData } =
        await this.operatorService.operatorLoginService(dto);
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
        .json(OperatorResponseMapper.toOperatorResponseDTO(operatorData));
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
      const data = await this.operatorService.operatorForgotPasswordService(
        req.body.email,
      );
      res.status(StatusCode.OK).json(data);
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
      const data = await this.operatorService.operatorResetPasswordService(
        req.params.token as string,
        req.body.newPassword,
      );
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  operatorLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token").clearCookie("refresh_token");
      const result = this.operatorService.operatorLogoutService();
      res.status(StatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateOperator = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, 401),
      );
    }

    if (req.user.id !== req.params.id) {
      return next(
        new CustomError("RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED", 401),
      );
    }
    try {
      const dto = OperatorRequestMapper.toUpdateOperatorProfileDTO(req.body);
      const updatedOperator = await this.operatorService.updateOperatorService(
        req.params.id as string,
        dto,
      );
      if (!updatedOperator) {
        return next(
          new CustomError(RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND, 404),
        );
      }

      res
        .status(StatusCode.OK)
        .json(OperatorResponseMapper.toOperatorResponseDTO(updatedOperator));
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
        await this.operatorService.updateOperatorProfileImageService(
          req.user!.id,
          image,
        );
      res
        .status(StatusCode.OK)
        .json(OperatorResponseMapper.toOperatorResponseDTO(operator));
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
      const dto =
        OperatorRequestMapper.toOperatorResetPasswordAuthenticatedRequestDTO(
          req.body,
        );
      const data = await this.operatorService.resetPasswordAuthenticatedService(
        req.user!.id,
        dto,
      );
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  //admin
  getOperatorVerificationRequests = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const data =
        await this.operatorService.getOperatorVerificationRequestsService();
      res
        .status(StatusCode.OK)
        .json(AdminResponseMapper.toAdminOperatorListResponseDTO(data));
    } catch (error) {
      next(error);
    }
  };

  verifyOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const dto = AdminRequestMapper.toVerifyOperatorPayload(req.body);

      const data = await this.operatorService.verifyOperatorService(
        id as string,
        dto,
      );
      res.status(StatusCode.OK).json(data);
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
      const [rawOperators, totalCount] = await Promise.all([
        this.operatorService.getPaginatedOperatorsService(skip, limit),
        this.operatorService.getTotalOperatorsCount(),
      ]);
      res.status(StatusCode.OK).json({
        operators:
          AdminResponseMapper.toAdminOperatorListResponseDTO(rawOperators),
        totalCount,
      });
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
      const operator = await this.operatorService.getOperatorDetailsService(
        req.params.id as string,
      );

      res
        .status(StatusCode.OK)
        .json(AdminResponseMapper.toAdminOperatorResponseDTO(operator));
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
      const dto = AdminRequestMapper.toAdminUpdateOperatorRequestDTO(req.body);
      const updated = await this.operatorService.adminUpdateOperatorService(
        req.params.id as string,
        dto,
      );

      res
        .status(StatusCode.OK)
        .json(OperatorResponseMapper.toOperatorResponseDTO(updated));
    } catch (error) {
      next(error);
    }
  };

  blockOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = AdminRequestMapper.toBlockOperatorPayload(req.body);
      const blocked = await this.operatorService.blockOperatorService(
        req.params.id as string,
        dto,
      );
      res.status(StatusCode.OK).json({
        message: req.body.isBlocked
          ? RESPONSE_MESSAGES.OPERATOR.SUCCESS.BLOCKED
          : RESPONSE_MESSAGES.OPERATOR.SUCCESS.UNBLOCKED,
        operator: AdminResponseMapper.toAdminOperatorResponseDTO(blocked),
      });
    } catch (error) {
      next(error);
    }
  };

  deleteOperator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.operatorService.deleteOperatorService(req.params.id as string);
      res
        .status(StatusCode.OK)
        .json({ message: RESPONSE_MESSAGES.OPERATOR.SUCCESS.DELETED });
    } catch (error) {
      next(error);
    }
  };
}
