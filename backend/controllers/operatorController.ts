import { Request, Response, NextFunction } from "express";

import { CustomError } from "../utils/customError.js";
import { IOperatorService } from "../interfaces/IOperatorService.js";
import { logger } from "../utils/logger.js";
import { StatusCode } from "../constants/statusCodeConstants.js";

export class OperatorController {
  constructor(private operatorService: IOperatorService) {}

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
        .json({ success: true, message: "Otp sent", ...result });
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
        .json({ success: true, message: "OTP verified Successfully" });
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
        .json({ succuss: true, message: "OTP sent to email", otpExpire });
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
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
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

  operatorLogout = (req: Request, res: Response, next: NextFunction) => {
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
      return next(new CustomError("Unauthorized", 401));
    }

    if (req.user.id !== req.params.id) {
      return next(new CustomError("unauthorized", 401));
    }
    try {
      const updatedUser = await this.operatorService.updateOperatorService(
        req.params.id as string,
        req.body,
      );
      if (!updatedUser) {
        return next(new CustomError("User not found", 404));
      }

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
        this.operatorService.getPaginatedPackagesService(skip, limit),
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
}
