import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { PackageRequestMapper } from "../dto-mapping/mapper/package/PackageRequestMapper";
import { PackageResponseMapper } from "../dto-mapping/mapper/package/PackageResponseMapper";
import { IPackageController } from "../interfaces/IPackageController";
import type { IPackageService } from "../interfaces/IPackageService";
import { Types } from "../types/types";
import { sendSuccessResponse } from "../utils/apiResponse";
import { CustomError } from "../utils/customError";
import { logger } from "../utils/logger";

@injectable()
export class PackageController implements IPackageController {
  constructor(
    @inject(Types.PackageService) private _packageService: IPackageService,
  ) {}

  getPackageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packageId = req.params.id;

      const pkg = await this._packageService.getPackageByIdService(
        packageId as string,
      );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.PACKAGE.SUCCESS.FETCH_PACKAGE,
        pkg,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  adminDeletePackage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id: packageId } = req.params;
      const deletePackage = await this._packageService.deletePackageService(
        packageId as string,
      );
      if (!deletePackage) {
        throw new CustomError(
          RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
          StatusCode.NOT_FOUND,
        );
      }
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.PACKAGE.SUCCESS.DELETED,
        undefined,
        StatusCode.OK,
      );
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

      const created = await this._packageService.createPackageService(
        operatorId as string,
        req.body,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.PACKAGE.SUCCESS.CREATED,
        created,
        StatusCode.CREATED,
      );
    } catch (error) {
      next(error);
    }
  };

  getAdminAllPackages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [packages, totalCount] = await Promise.all([
        this._packageService.getFilteredPaginatedPackagesService(
          {},
          skip,
          limit,
        ),
        this._packageService.getTotalPackagesCount(),
      ]);
      const data = { packages, totalCount };
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.PACKAGE.SUCCESS.FETCH_PACKAGES,
        data,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getMyPackagesCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user?.id;
      const totalPakagesCount =
        await this._packageService.getOperatorPackagesCountService(
          operatorId as string,
        );
      sendSuccessResponse(res,RESPONSE_MESSAGES.PACKAGE.SUCCESS.FETCH_COUNT,totalPakagesCount,StatusCode.OK)
    } catch (error) {
      next(error);
    }
  };

  getOperatorPaginatedPackages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user!.id;
      const { limit, page } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const totalCount =
        await this._packageService.getOperatorPackagesCountService(
          operatorId as string,
        );

      const packages =
        await this._packageService.getFilteredPaginatedPackagesService(
          { operatorId },
          skip,
          Number(limit),
        );
      const data = { packages, totalCount };
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.PACKAGE.SUCCESS.FETCH_PACKAGES,
        data,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getPackageByIdAndOperator = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const packageId = req.params.id;
      const operatorId = req.user!.id;

      const pkg = await this._packageService.getPackageByIdAndOperatorService(
        packageId as string,
        operatorId,
      );

      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.PACKAGE.SUCCESS.FETCH_PACKAGE,
        pkg,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  deletePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const operatorId = req.user?.id;
      if (!operatorId) {
        throw new CustomError(
          RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
          StatusCode.UNAUTHORIZED,
        );
      }
      const { id: packageId } = req.params;
      const deletePackage =
        await this._packageService.deleteOperatorPackageService(
          packageId as string,
          operatorId,
        );
      if (!deletePackage) {
        throw new CustomError(
          RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
          StatusCode.NOT_FOUND,
        );
      }
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.PACKAGE.SUCCESS.DELETED,
        undefined,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  updatePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packageId = req.params.id;

      const updatedPackage =
        await this._packageService.updateOperatorPackageService(
          packageId as string,
          req.user!.id,
          req.body,
        );
      if (!updatedPackage) {
        return next(
          new CustomError(
            RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
            StatusCode.NOT_FOUND,
          ),
        );
      }
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.PACKAGE.SUCCESS.UPDATE,
        updatedPackage,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getPaginatedPackages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [packages, totalCount] = await Promise.all([
        this._packageService.getPaginatedPackagesService(skip, limit),
        this._packageService.getTotalPackagesCount(),
      ]);

      const data = { packages, totalCount };
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.PACKAGE.SUCCESS.FETCH_PACKAGES,
        data,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packages = await this._packageService.getAllPackagesService();
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.PACKAGE.SUCCESS.FETCH_PACKAGES,
        packages,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getFilteredPackages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const query = req.query;
      const data = await this._packageService.getFilteredPackagesService(query);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.PACKAGE.SUCCESS.FETCH_PACKAGES,
        data,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getPackagesByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { category } = req.params;

      const packages = await this._packageService.getPackagesByCategoryService(
        category as string,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.PACKAGE.SUCCESS.FETCH_PACKAGES,
        packages,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
