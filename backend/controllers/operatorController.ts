import { NextFunction, Request, Response } from "express";

import { inject, injectable } from "inversify";
import { StatusCode } from "../constants/statusCodeConstants";
import { IOperatorController } from "../interfaces/IOperatorController";
import type { IOperatorService } from "../interfaces/IOperatorService";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";
import { logger } from "../utils/logger";
import { RESPONSE_MESSAGES } from "../constants/messages";
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
      const result = await this.operatorService.operatorRegisterService(
        req.body,
      );
      res
        .status(StatusCode.CREATED)
        .json({ success: true, message:RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_SENT_EMAIL, ...result });
    } catch (error) {
      next(error);
    }
  };

  operatorOtpverification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { operatorId, otp } = req.body;
    try {
      await this.operatorService.operatorVerifyOtpService(operatorId, otp);
      res
        .status(StatusCode.OK)
        .json({ success: true, message:RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_VERIFIED });
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
      res
        .status(StatusCode.OK)
        .json({ succuss: true, message: RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_SENT_EMAIL, otpExpire });
    } catch (error) {
      next(error);
    }
  };

  loginOperator = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      logger.info(`Operator login attempt`, {
        layer: "CONTROLLER",
        module: "Operator",
        action: "LOGIN",
        email: req.body.email,
      });
      const { accessToken, refreshToken, operatorData } =
        await this.operatorService.operatorLoginService(email, password);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: Number(process.env.MAX_AGE),
      });
      res.status(StatusCode.OK).json(operatorData);
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
      return next(new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, 401));
    }

    if (req.user.id !== req.params.id) {
      return next(new CustomError("RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED", 401));
    }
    try {
      const updatedUser = await this.operatorService.updateOperatorService(
        req.params.id as string,
        req.body,
      );
      if (!updatedUser) {
        return next(new CustomError(RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND, 404));
      }
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = updatedUser.toObject();
      res.status(StatusCode.OK).json(rest);
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
      const user = await this.operatorService.updateOperatorProfileImageService(
        req.user!.id,
        image,
      );
      res.status(StatusCode.OK).json(user);
    } catch (error) {
      next(error);
    }
  };

  createPackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("operator creating a new package", {
        layer: "CONTROLLER",
        module: "OPERATOR",
        operatorId: req.user?.id,
        action: "CREATE_PACKAGE",
      });
      const operatorId = req?.user?.id;

      const packageData = {
        ...req.body,
        operatorId,
      };
      const created =
        await this.operatorService.createPackageService(packageData);
      res.status(StatusCode.CREATED).json({ success: true, data: created });
    } catch (error) {
      next(error);
    }
  };

  getAllDestinations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const destinations =
        await this.operatorService.getAllDestinationsServise();
      res.status(StatusCode.OK).json(destinations);
    } catch (error) {
      next(error);
    }
  };

  getAllPackageCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categories = await this.operatorService.getAllCategories();
      res.status(StatusCode.OK).json(categories);
    } catch (error) {
      next(error);
    }
  };

  getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [packages, totalCount] = await Promise.all([
        this.operatorService.getPaginatedPackagesService({}, skip, limit),
        this.operatorService.getTotalPackagesCount(),
      ]);
      res.json({ packages, totalCount });
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
      const data = await this.operatorService.resetPasswordAuthenticatedService(
        req.user!.id,
        req.body.oldPassword,
        req.body.newPassword,
        req.body.confirmPassword,
      );
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  getMyPackagesCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user?.id;
      const totalPakagesCount =
        await this.operatorService.getMyPackagesCountService(
          operatorId as string,
        );
      res.status(StatusCode.OK).json({ success: true, totalPakagesCount });
    } catch (error) {
      next(error);
    }
  };

  getPaginatedPackages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user!.id;
      const { limit, page } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const totalCount = await this.operatorService.getMyPackagesCountService(
        operatorId as string,
      );

      const packages = await this.operatorService.getPaginatedPackagesService(
        { operatorId },
        skip,
        Number(limit),
      );
      res.status(StatusCode.OK).json({ success: true, totalCount, packages });
    } catch (error) {
      next(error);
    }
  };

  getPackageByIdAndOperator = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const packageId = req.params.id;
      const operatorId = req.user!.id;

      const pkg = await this.operatorService.getPackageByIdAndOperatorService(
        packageId as string,
        operatorId,
      );

      res.status(StatusCode.OK).json(pkg);
    } catch (error) {
      next(error);
    }
  };

  deletePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const operatorId = req.user?.id;
      if (!operatorId) {
        throw new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
      }
      const { id: packageId } = req.params;
      const deletePackage = await this.operatorService.deletePackageService(
        packageId as string,
        operatorId,
      );
      if (!deletePackage) {
        throw new CustomError(RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND, StatusCode.NOT_FOUND);
      }
      res
        .status(StatusCode.OK)
        .json({ success: true, message:RESPONSE_MESSAGES.PACKAGE.SUCCESS.DELETED });
    } catch (error) {
      next(error);
    }
  };

  updatePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packageId = req.params.id;
      const updatedPackage = await this.operatorService.updatePackageService(
        packageId as string,
        req.user!.id,
        req.body,
      );
      if (!updatedPackage) {
        return next(new CustomError(RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND, StatusCode.NOT_FOUND));
      }
      res.status(StatusCode.OK).json(updatedPackage);
    } catch (error) {
      next(error);
    }
  };
}
