import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCode } from "../constants/statusCodeConstants";

import type { IDashboardService } from "../interfaces/IDashboardService";
import { Types } from "../types/types";
import { IDashboardController } from "../interfaces/IDashboardController";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(@inject(Types.DashboardService) private dashboardService:IDashboardService){

  }
  //admin
  getTotalUsersCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const usersCount = await this.dashboardService.getTotalUsersCountService();
      res.status(StatusCode.OK).json({ success: true, usersCount });
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
        await this.dashboardService.getTotalOperatorsCountService();
      res.status(StatusCode.OK).json({ success: true, operatorsCount });
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
        await this.dashboardService.getSignupCountTodayService();
      res.status(StatusCode.OK).json({ success: true, todaySignupCount });
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
        await this.dashboardService.getPendingOperatorsCountService();
      res.status(StatusCode.OK).json({ success: true, count });
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
      const stats =
        await this.dashboardService.getOperatorDashboardStatsService(
          operatorId,
        );
      res.status(StatusCode.OK).json(stats);
    } catch (error) {
      next(error);
    }
  };

}
