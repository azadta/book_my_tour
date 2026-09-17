import { NextFunction, Request, Response } from "express";

export interface IPackageCategoryController{
    //admin
      createPackageCategory: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;


  //user
    getAllPackageCategories: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
    getActiveCategories: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;


    
}