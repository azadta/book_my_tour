import { inject, injectable } from "inversify";
import { IWishlistController } from "../interfaces/IWishlistController";
import { Types } from "../types/types";
import type { IWishlistService } from "../interfaces/IWishlistService";
import { NextFunction, Request, Response } from "express";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { WishlistResponseMapper } from "../dto-mapping/mapper/wishlist/WishlistResponseMapper";
import { WishlistRequestMapper } from "../dto-mapping/mapper/wishlist/WishlistRequestMapper";

@injectable()
export class WishlistController implements IWishlistController {
  constructor(
    @inject(Types.WishlistService) private wishlistService: IWishlistService,
  ) {}
  //user
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
        await this.wishlistService.getUserWishlists(userId);
      res.status(StatusCode.OK).json({
        success: true,
        wishlistGroups:
          WishlistResponseMapper.toGroupResponseListDTO(wishlistGroups),
      });
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
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }
      const dto = WishlistRequestMapper.toCreateGroupReqDTO(req.body);

      const wishlistGroup = await this.wishlistService.createWishlistGroup(
        userId,
        dto,
      );
      res.status(StatusCode.CREATED).json({
        success: true,
        wishlistGroup: WishlistResponseMapper.toGroupResponseDTO(wishlistGroup),
      });
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
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }

      const dto = WishlistRequestMapper.toTogglePackageReqDTO(req.body);
      const updatedGroup =
        await this.wishlistService.togglePackageInWishlistGroup(userId, dto);
      res.status(StatusCode.OK).json({
        success: true,
        data: WishlistResponseMapper.toGroupResponseDTO(updatedGroup),
      });
    } catch (error) {
      next(error);
    }
  };

  addWishlistNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }

      const { groupId } = req.params;
      const dto = WishlistRequestMapper.toAddNoteReqDTO(req.body);
      const updatedGroup = await this.wishlistService.addNoteToWishlistGroup(
        userId,
        groupId as string,
        dto,
      );
      res.status(StatusCode.OK).json({
        success: true,
        data: WishlistResponseMapper.toGroupResponseDTO(updatedGroup),
      });
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
      const userId = req.user?.id;
      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }

      const { groupId } = req.params;
      const shareData = await this.wishlistService.generateShareableLink(
        userId,
        groupId as string,
      );
      res.status(StatusCode.OK).json({
        success: true,
        data: WishlistResponseMapper.toShareLinkDTO(shareData),
      });
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
      const sharedGroup = await this.wishlistService.getSharedGroup(
        shareToken as string,
      );
      res.status(StatusCode.OK).json({
        success: true,
        data: WishlistResponseMapper.toGroupResponseDTO(sharedGroup),
      });
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
      const userId = req.user?.id;
      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }
      const { groupId } = req.params;
      const dto = WishlistRequestMapper.toEditGroupReqDTO(req.body);
      const updatedGroup = await this.wishlistService.editGroup(
        userId,
        groupId as string,
        dto,
      );
      res.status(StatusCode.OK).json({
        success: true,
        data: WishlistResponseMapper.toGroupResponseDTO(updatedGroup),
      });
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
      const userId = req.user?.id;
      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }
      const { groupId } = req.params;

      await this.wishlistService.deleteGroup(userId, groupId as string);
      res.status(StatusCode.OK).json({
        success: true,
        message: RESPONSE_MESSAGES.WISHLIST.SUCCESS.DELETE,
      });
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
      const userId = req.user?.id;
      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }
      const { groupId, noteId } = req.params;
      const dto = WishlistRequestMapper.toEditNoteReqDTO(req.body);

      const updatedGroup = await this.wishlistService.editNote(
        userId,
        groupId as string,
        noteId as string,
        dto,
      );
      res.status(StatusCode.OK).json({
        success: true,
        data: WishlistResponseMapper.toGroupResponseDTO(updatedGroup),
      });
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
      const userId = req.user?.id;
      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED,
        });
        return;
      }
      const { groupId, noteId } = req.params;

      const updatedGroup = await this.wishlistService.deleteNote(
        userId,
        groupId as string,
        noteId as string,
      );
      res.status(StatusCode.OK).json({
        success: true,
        data: WishlistResponseMapper.toGroupResponseDTO(updatedGroup),
      });
    } catch (error) {
      next(error);
    }
  };
}
