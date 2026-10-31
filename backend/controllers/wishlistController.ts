import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { IWishlistController } from "../interfaces/IWishlistController";
import type { IWishlistService } from "../interfaces/IWishlistService";
import { Types } from "../types/types";
import { sendSuccessResponse } from "../utils/apiResponse";

@injectable()
export class WishlistController implements IWishlistController {
  constructor(
    @inject(Types.WishlistService) private _wishlistService: IWishlistService,
  ) {}

  getWishlists = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }

      const wishlistGroups =
        await this._wishlistService.getUserWishlists(userId);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WISHLIST.SUCCESS.FETCH_GROUPS,
        wishlistGroups,
        StatusCode.OK,
      );
    } catch (error: any) {
      next(error);
    }
  };

  createWhishlistGroup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;

      const wishlistGroup = await this._wishlistService.createWishlistGroup(
        userId,
        req.body,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WISHLIST.SUCCESS.CREATED_GROUP,
        wishlistGroup,
        StatusCode.CREATED,
      );
    } catch (error: any) {
      next(error);
    }
  };

  toggleWhishlistPackage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;

      const updatedGroup =
        await this._wishlistService.togglePackageInWishlistGroup(
          userId,
          req.body,
        );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WISHLIST.SUCCESS.TOGGLE_PACKAGE,
        updatedGroup,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  addWishlistNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string;

      const { groupId } = req.params;

      const updatedGroup = await this._wishlistService.addNoteToWishlistGroup(
        userId,
        groupId as string,
        req.body,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WISHLIST.SUCCESS.ADD_NOTE,
        updatedGroup,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getWishlistShareLink = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;

      const { groupId } = req.params;
      const shareData = await this._wishlistService.generateShareableLink(
        userId,
        groupId as string,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WISHLIST.SUCCESS.CREATE_SHARE_LINK,
        shareData,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  getSharedWishlist = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { shareToken } = req.params;
      const sharedGroup = await this._wishlistService.getSharedGroup(
        shareToken as string,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WISHLIST.SUCCESS.FETCH_SHARED_WHISHLIST,
        sharedGroup,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  editWishlistGroup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;

      const { groupId } = req.params;

      const updatedGroup = await this._wishlistService.editGroup(
        userId,
        groupId as string,
        req.body,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WISHLIST.SUCCESS.EDIT_GROUP,
        updatedGroup,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  deleteWishlistGroup = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;

      const { groupId } = req.params;

      await this._wishlistService.deleteGroup(userId, groupId as string);
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WISHLIST.SUCCESS.DELETE,
        undefined,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };

  editWishlistNote = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;
      const { groupId, noteId } = req.params;
      const updatedGroup = await this._wishlistService.editNote(
        userId,
        groupId as string,
        noteId as string,
        req.body,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WISHLIST.SUCCESS.EDIT_NOTE,
        updatedGroup,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
  deleteWishlistNote = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;

      const { groupId, noteId } = req.params;

      const updatedGroup = await this._wishlistService.deleteNote(
        userId,
        groupId as string,
        noteId as string,
      );
      sendSuccessResponse(
        res,
        RESPONSE_MESSAGES.WISHLIST.SUCCESS.DELETE_NOTE,
        updatedGroup,
        StatusCode.OK,
      );
    } catch (error) {
      next(error);
    }
  };
}
