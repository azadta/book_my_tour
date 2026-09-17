import { inject, injectable } from "inversify";
import { IPackageDestinationController } from "../interfaces/IPackageDestinationController";
import { Types } from "../types/types";
import type { IPackageDestinationService } from "../interfaces/IPackageDestinationService";
import { NextFunction, Request, Response } from "express";
import { PackageDestinationRequestMapper } from "../dto-mapping/mapper/package-destination/PackageDestinationRequestMapper";
import { StatusCode } from "../constants/statusCodeConstants";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { PackageDestinationResponseMapper } from "../dto-mapping/mapper/package-destination/PackageDestinationResponseMapper";

@injectable()
export class PackageDestinationController implements IPackageDestinationController {
  constructor(
    @inject(Types.PackageDestinationService)
    private packageDestinationService: IPackageDestinationService,
  ) {}
  //admin
  createDestination = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const dto = PackageDestinationRequestMapper.toDestinationEntity(req.body);
      const rawDestination =
        await this.packageDestinationService.createDestinationService(dto);
      res.status(StatusCode.CREATED).json({
        message: RESPONSE_MESSAGES.DESTINATION.SUCCESS.CREATED,
        destination:
          PackageDestinationResponseMapper.toDestinationResponseDTO(
            rawDestination,
          ),
      });
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
      const rawDestinations =
        await this.packageDestinationService.getAllDestinationsService();
      res.json(
        PackageDestinationResponseMapper.toDestinationListResponseDTO(
          rawDestinations,
        ),
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
      const rawDestination =
        await this.packageDestinationService.getDestinationByIdService(
          req.params.id as string,
        );
      res.json({
        success: true,
        destination:
          PackageDestinationResponseMapper.toDestinationResponseDTO(
            rawDestination,
          ),
      });
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
      await this.packageDestinationService.deleteDestinationByIdService(
        req.params.id as string,
      );
      res.json({ success: true, message: "Destination deleted" });
    } catch (error) {
      next(error);
    }
  };

  //user

  getDestinationsByPackageCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { category } = req.params;
      const rawDestinations =
        await this.packageDestinationService.getDestinationsByPackageCategoryService(
          category as string,
        );
      res
        .status(StatusCode.OK)
        .json(
          PackageDestinationResponseMapper.toDestinationListResponseDTO(
            rawDestinations,
          ),
        );
    } catch (error) {
      next(error);
    }
  };
}
