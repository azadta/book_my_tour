import { NextFunction, Request, Response } from "express";

import { CustomError } from "../utils/customError.js";

import { IUserService } from "../interfaces/IUserService.js";
import { logger } from "../utils/logger.js";
import { StatusCode } from "../constants/statusCodeConstants.js";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: string; role: string };
    }
  }
}

export class UserController {
  constructor(private userService: IUserService) {}
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`Attempting registration for email ${req.body.email}`, {
        layer: "CONTROLLER",
        module: "USER",
        action: "REGISTER",
      });
      const result = await this.userService.registerUser(req.body);
      res.status(StatusCode.CREATED).json({ success: true, message: "OTP sent", ...result });
    } catch (error: any) {
      next(error);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, otp } = req.body;
      await this.userService.verifyUserOtp({ userId, otp });
      res
        .status(StatusCode.OK)
        .json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      const data = await this.userService.resendUserOtp(userId);
      res
        .status(StatusCode.CREATED)
        .json({ success: true, message: "OTP resent to email", ...data });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      logger.info(`User login attempt`, {
        layer: "CONTROLLER",
        module: "USER",
        action: "LOGIN",
        email: req.body.email,
      });

      const { accessToken, refreshToken, userData } =
        await this.userService.loginUser(email, password);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(StatusCode.OK).json(userData);
    } catch (error) {
      next(error);
    }
  };

  google = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body;
    try {
      const { accessToken, refreshToken, user } =
        await this.userService.googleLogin(name, email);
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(StatusCode.OK).json(user);
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.userService.forgotPasswordService(req.body.email);
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.userService.resetPasswordService(
        req.params.token as string,
        req.body.newPassword,
      );
      res.status(StatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  logout = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token").clearCookie("refresh_token");
      const result = this.userService.userLogoutService();
      res.status(StatusCode.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new CustomError("Unauthorized", 401));
    }

    if (req.user.id !== req.params.id) {
      return next(new CustomError("unauthorized", 401));
    }
    try {
      const updatedUser = await this.userService.updateUserService(
        req.params.id,
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

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.id !== req.params.id) {
      return next(new CustomError("unauthorized", 401));
    }
    try {
      await this.userService.deleteUserService(req.params.id);
      res.clearCookie("access_token");
      res.status(StatusCode.OK).json({ message: "User has been deleted" });
    } catch (error) {
      next(error);
    }
  };

  updateProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { image } = req.body;
      const user = await this.userService.updateProfileImageService(
        req.user!.id,
        image,
      );
      res.status(StatusCode.OK).json(user);
    } catch (error) {
      next(error);
    }
  };

  getAllPackageCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const categories = await this.userService.getAllCategories();
      res.json(categories);
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
      const data = await this.userService.resetPasswordAuthenticatedService(
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

  getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [packages, totalCount] = await Promise.all([
        this.userService.getPaginatedPackagesService(skip, limit),
        this.userService.getTotalPackagesCount(),
      ]);

      res.json({ packages, totalCount });
    } catch (error) {
      next(error);
    }
  };
}
