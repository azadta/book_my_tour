import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import type { ICommonAuthService } from "../interfaces/ICommonAuthService";
import { StatusCode } from "../constants/statusCodeConstants";
import { inject, injectable } from "inversify";
import { Types } from "../types/types";
import { ICommonAuthController } from "../interfaces/ICommonAuthController";

@injectable()
export class CommonAuthController implements ICommonAuthController {
  constructor(
    @inject(Types.CommonAuthService)
    private commonAuthService: ICommonAuthService,
  ) {}
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return next(
          new CustomError("No refresh token", StatusCode.UNAUTHORIZED),
        );
      }
      const { newAccessToken } =
        await this.commonAuthService.refreshToken(refreshToken);
      res.cookie("access_token", newAccessToken, {
        httpOnly: true,

        maxAge:Number(process.env.MAX_AGE)
      });
      res.status(StatusCode.OK).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
