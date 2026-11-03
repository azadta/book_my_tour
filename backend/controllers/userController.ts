import { NextFunction, Request, Response } from "express";

import { CustomError } from "../utils/customError";

import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { IUserController } from "../interfaces/IUserController";
import type { IUserService } from "../interfaces/IUserService";
import { Types } from "../types/types";
import { logger } from "../utils/logger";
import { sendSuccessResponse } from "../utils/apiResponse";

@injectable()
export class UserController implements IUserController {
  constructor(@inject(Types.UserService) private _userService: IUserService) {}
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`Attempting registration for email ${req.body.email}`, {
        layer: "CONTROLLER",
        module: "USER",
        action: "REGISTER",
      });
      const result = await this._userService.registerUser(req.body);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_SENT_EMAIL,
        result,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, otp } = req.body;
      await this._userService.verifyUserOtp({ userId, otp });
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

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      const data = await this._userService.resendUserOtp(userId);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.AUTH.SUCCESS.OTP_RESENT_EMAIL,
        data,
        StatusCode.OK,
      );
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
        await this._userService.loginUser(email, password);
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
        RESPONSE_MESSAGES.USER.SUCCESS.LOGGED_IN,
        userData,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  google = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email } = req.body;
    try {
      const { accessToken, refreshToken, user } =
        await this._userService.googleLogin(name, email);
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
        RESPONSE_MESSAGES.USER.SUCCESS.LOGGED_IN,
        user,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._userService.forgotPasswordService(
        req.body.email,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.USER.SUCCESS.OTP_SENT,
        data,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._userService.resetPasswordService(
        req.params.token as string,
        req.body.newPassword,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.USER.SUCCESS.RESET_PASSWORD,
        data,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token").clearCookie("refresh_token");
      const result = this._userService.userLogoutService();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.USER.SUCCESS.LOGGED_OUT,
        result,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, 401),
      );
    }

    if (req.user.id !== req.params.id) {
      return next(
        new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, 401),
      );
    }
    try {
      const updatedUser = await this._userService.updateUserService(
        req.params.id as string,
        req.body,
      );
      if (!updatedUser) {
        return next(
          new CustomError(RESPONSE_MESSAGES.USER.ERROR.NOT_FOUND, 404),
        );
      }
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = updatedUser.toObject();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.USER.SUCCESS.UPDATE,
        rest,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.id !== req.params.id) {
      return next(
        new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED, 401),
      );
    }
    try {
      await this._userService.deleteUserService(req.params.id as string);
      res.clearCookie("access_token");
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.USER.SUCCESS.DELETED,
        undefined,
        StatusCode.OK,
      );
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
      const user = await this._userService.updateProfileImageService(
        req.user!.id,
        image,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.USER.SUCCESS.UPDATE_PROFILE_IMAGE,
        user,
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
      const data = await this._userService.resetPasswordAuthenticatedService(
        req.user!.id,
        req.body.oldPassword,
        req.body.newPassword,
        req.body.confirmPassword,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.USER.SUCCESS.RESET_PASSWORD,
        data,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getPaginatedUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [users, totalCount] = await Promise.all([
        this._userService.getPaginatedUsersService(skip, limit),
        this._userService.getTotalUsersCount(),
      ]);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.USER.SUCCESS.FETCH_ALL,
        { users, totalCount },
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this._userService.getUserDetailsService(
        req.params.id as string,
      );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.USER.SUCCESS.FETCH,
        user,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  adminUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this._userService.AdminUpdateUserService(
        req.params.id as string,
        req.body,
      );

      sendSuccessResponse(res, RESPONSE_MESSAGES.USER.SUCCESS.UPDATE,updated,StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  blockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.warn(`Admin is blocking a user`, {
        layer: "CONTROLLER",
        module: "ADMIN",
        targetUserId: req.params.id,
        adminId: req.user?.id,
      });
      const blockedUser = await this._userService.blockUserService(
        req.params.id as string,
        req.body.isBlocked,
      );
      const message = req.body.isBlocked
        ? RESPONSE_MESSAGES.USER.SUCCESS.BLOCKED
        : RESPONSE_MESSAGES.USER.SUCCESS.UNBLOCKED;
      sendSuccessResponse(res, message, blockedUser, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  adminDeleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this._userService.deleteUserService(req.params.id as string);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.USER.SUCCESS.DELETED,
        undefined,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
