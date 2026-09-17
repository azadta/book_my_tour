import { inject, injectable } from "inversify";
import { IPackageController } from "../interfaces/IPackageController";
import { Types } from "../types/types";
import type { IPackageService } from "../interfaces/IPackageService";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { PackageResponseMapper } from "../dto-mapping/mapper/package/PackageResponseMapper";
import { CustomError } from "../utils/customError";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { PackageRequestMapper } from "../dto-mapping/mapper/package/PackageRequestMapper";
import { logger } from "../utils/logger";

@injectable()
export class PackageController implements IPackageController {
  constructor(
    @inject(Types.PackageService) private packageService: IPackageService,
  ) {}

  getPackageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packageId = req.params.id;

      const pkg = await this.packageService.getPackageByIdService(
        packageId as string,
      );

      res
        .status(StatusCode.OK)
        .json(PackageResponseMapper.toPackageResponseDTO(pkg));
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
      const deletePackage = await this.packageService.deletePackageService(
        packageId as string,
      );
      if (!deletePackage) {
        throw new CustomError(
          RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
          StatusCode.NOT_FOUND,
        );
      }
      res.status(StatusCode.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.PACKAGE.SUCCESS.DELETED,
      });
    } catch (error) {
      next(error);
    }
  };

  //operator
  createPackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("operator creating a new package", {
        layer: "CONTROLLER",
        module: "OPERATOR",
        operatorId: req.user?.id,
        action: "CREATE_PACKAGE",
      });
      const operatorId = req?.user?.id;
      const dto = PackageRequestMapper.toCreatePackageEntity(
        req.body,
        operatorId as string,
      );

      const packageData = {
        ...req.body,
        operatorId,
      };
      const created =
        await this.packageService.createPackageService(packageData);
      res.status(StatusCode.CREATED).json({
        success: true,
        data: PackageResponseMapper.toPackageResponseDTO(created),
      });
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
      const [rawPackages, totalCount] = await Promise.all([
        this.packageService.getFilteredPaginatedPackagesService(
          {},
          skip,
          limit,
        ),
        this.packageService.getTotalPackagesCount(),
      ]);
      res.json({
        packages: PackageResponseMapper.toPackageListResponseDTO(rawPackages),
        totalCount,
      });
    } catch (error) {
      next(error);
    }
  };
  //operator

  getMyPackagesCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const operatorId = req.user?.id;
      const totalPakagesCount =
        await this.packageService.getOperatorPackagesCountService(
          operatorId as string,
        );
      res.status(StatusCode.OK).json({ success: true, totalPakagesCount });
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
        await this.packageService.getOperatorPackagesCountService(
          operatorId as string,
        );

      const packages =
        await this.packageService.getFilteredPaginatedPackagesService(
          { operatorId },
          skip,
          Number(limit),
        );
      res.status(StatusCode.OK).json({ success: true, totalCount, packages });
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

      const pkg = await this.packageService.getPackageByIdAndOperatorService(
        packageId as string,
        operatorId,
      );

      res
        .status(StatusCode.OK)
        .json(PackageResponseMapper.toPackageResponseDTO(pkg));
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
        await this.packageService.deleteOperatorPackageService(
          packageId as string,
          operatorId,
        );
      if (!deletePackage) {
        throw new CustomError(
          RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
          StatusCode.NOT_FOUND,
        );
      }
      res.status(StatusCode.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.PACKAGE.SUCCESS.DELETED,
      });
    } catch (error) {
      next(error);
    }
  };

  updatePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packageId = req.params.id;
      const dto = PackageRequestMapper.toUpdatePackageEntity(req.body);
      const updatedPackage =
        await this.packageService.updateOperatorPackageService(
          packageId as string,
          req.user!.id,
          dto,
        );
      if (!updatedPackage) {
        return next(
          new CustomError(
            RESPONSE_MESSAGES.PACKAGE.ERROR.NOT_FOUND,
            StatusCode.NOT_FOUND,
          ),
        );
      }
      res
        .status(StatusCode.OK)
        .json(PackageResponseMapper.toPackageResponseDTO(updatedPackage));
    } catch (error) {
      next(error);
    }
  };

  //user
  getPaginatedPackages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const skip = (page - 1) * limit;
      const [rawPackages, totalCount] = await Promise.all([
        this.packageService.getPaginatedPackagesService(skip, limit),
        this.packageService.getTotalPackagesCount(),
      ]);

      res.json({
        packages: PackageResponseMapper.toPackageListResponseDTO(rawPackages),
        totalCount,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawPackages = await this.packageService.getAllPackagesService();
      res.json({
        packages: PackageResponseMapper.toPackageListResponseDTO(rawPackages),
      });
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
      const {
        packages: rawPackages,
        totalCount,
        uniqueCategoryCount,
      } = await this.packageService.getFilteredPackagesService(query);
      res.status(200).json({
        packages: PackageResponseMapper.toPackageListResponseDTO(rawPackages),
        totalCount,
        uniqueCategoryCount,
      });
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

      const packages = await this.packageService.getPackagesByCategoryService(
        category as string,
      );
      res
        .status(StatusCode.OK)
        .json(PackageResponseMapper.toPackageListResponseDTO(packages));
    } catch (error) {
      next(error);
    }
  };
}
