import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCode } from "../constants/statusCodeConstants";

import type { IDashboardService } from "../interfaces/IDashboardService";
import { Types } from "../types/types";
import { IDashboardController } from "../interfaces/IDashboardController";
import { sendSuccessResponse } from "../utils/apiResponse";
import { RESPONSE_MESSAGES } from "../constants/messages";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject(Types.DashboardService)
    private _dashboardService: IDashboardService,
  ) {}
  //admin
  getTotalUsersCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const usersCount =
        await this._dashboardService.getTotalUsersCountService();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.DASHBOARD.SUCCESS.FETCH_USERS_COUNT,
        usersCount,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
  getTotalOperatorsCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorsCount =
        await this._dashboardService.getTotalOperatorsCountService();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.DASHBOARD.SUCCESS.FETCH_OPERATORS_COUNT,
        operatorsCount,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  todaySignupCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const todaySignupCount =
        await this._dashboardService.getSignupCountTodayService();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.DASHBOARD.SUCCESS.FETCH_TODAY_SIGNUP_COUNT,
        todaySignupCount,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getPendingOperatorsCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const count =
        await this._dashboardService.getPendingOperatorsCountService();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.DASHBOARD.SUCCESS.FETCH_PENDING_OPERATORS_COUNT,
        count,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  //operator
  getOperatorDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user?.id as string;
      const dashboardData =
        await this._dashboardService.getOperatorDashboardStatsService(
          operatorId,
        );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.DASHBOARD.SUCCESS.FETCH_OPERATORS_DATA,
        dashboardData,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
