import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError.js";
import { ICommonAuthService } from "../interfaces/ICommonAuthService.js";
import { StatusCode } from "../constants/statusCodeConstants.js";

export class CommonAuthController {
  constructor(private commonAuthService: ICommonAuthService) {}
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return next(new CustomError("No refresh token", 401));
      }
      const { newAccessToken } =
        await this.commonAuthService.refreshToken(refreshToken);
      res.cookie("access_token", newAccessToken, {
        httpOnly: true,

        maxAge: 15 * 60 * 1000,
      });
      res.status(StatusCode.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
