import { inject, injectable } from "inversify";
import { IPackageDestinationController } from "../interfaces/IPackageDestinationController";
import { Types } from "../types/types";
import type { IPackageDestinationService } from "../interfaces/IPackageDestinationService";
import { NextFunction, Request, Response } from "express";
import { PackageDestinationRequestMapper } from "../dto-mapping/mapper/package-destination/PackageDestinationRequestMapper";
import { StatusCode } from "../constants/statusCodeConstants";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { PackageDestinationResponseMapper } from "../dto-mapping/mapper/package-destination/PackageDestinationResponseMapper";
import { sendSuccessResponse } from "../utils/apiResponse";

@injectable()
export class PackageDestinationController implements IPackageDestinationController {
  constructor(
    @inject(Types.PackageDestinationService)
    private _packageDestinationService: IPackageDestinationService,
  ) {}

  createDestination = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const destination =
        await this._packageDestinationService.createDestinationService(
          req.body,
        );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.DESTINATION.SUCCESS.CREATED,
        destination,
        StatusCode.CREATED,
      );
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
        await this._packageDestinationService.getAllDestinationsService();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.DESTINATION.SUCCESS.FETCH_ALL,
        destinations,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getDestinationById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const destination =
        await this._packageDestinationService.getDestinationByIdService(
          req.params.id as string,
        );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.DESTINATION.SUCCESS.FETCH,
        destination,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  deleteDestination = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this._packageDestinationService.deleteDestinationByIdService(
        req.params.id as string,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.DESTINATION.SUCCESS.DELETED,
        undefined,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getDestinationsByPackageCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { category } = req.params;
      const destinations =
        await this._packageDestinationService.getDestinationsByPackageCategoryService(
          category as string,
        );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.DESTINATION.SUCCESS.FETCH_BY_PACKAGE_CATEGORY,
        destinations,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
