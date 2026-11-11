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

  getAdminSummaryCounts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const counts =
        await this._dashboardService.getAdminSummaryCountsService();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.DASHBOARD.SUCCESS.FETCH_ADMIN_SUMMARY,
        counts,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

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
  getAdminDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const dashboardData =
        await this._dashboardService.getAdminDashboardStatsService();
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
