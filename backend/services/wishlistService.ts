import { randomBytes } from "crypto";
import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { IWishlistGroup } from "../interfaces/IWishList";
import type { IWishlistRepository } from "../interfaces/IWishlistRepository";

import { IWishlistService } from "../interfaces/IWishlistService";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";
import {
  AddWishlistNoteRequestDTO,
  CreateWishlistGroupRequestDTO,
  EditWishlistGroupRequestDTO,
  EditWishlistNoteRequestDTO,
  ToggleWishlistPackageRequestDTO,
} from "../dto-mapper/dto/wishlist/wishlistRequestDTO";

@injectable()
export class WishlistService implements IWishlistService {
  constructor(
    @inject(Types.WishlistRepository)
    private wishlistRepository: IWishlistRepository,
  ) {}

  async getUserWishlists(userId: string): Promise<IWishlistGroup[]> {
    return this.wishlistRepository.findByUserId(userId);
  }
  async createWishlistGroup(
    userId: string,
    dto: CreateWishlistGroupRequestDTO,
  ): Promise<IWishlistGroup> {
    return this.wishlistRepository.createGroup(userId, dto);
  }
  async togglePackageInWishlistGroup(
    userId: string,
    dto: ToggleWishlistPackageRequestDTO,
  ): Promise<IWishlistGroup> {
    const { groupId, packageId } = dto;
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    if (group.userId.toString() !== userId) {
      throw new CustomError(RESPONSE_MESSAGES.AUTH.ERROR.UNAUTHORIZED);
    }

    const hasPackage = group.packages.some(
      (pkg: any) =>
        (pkg._id ? pkg._id.toString() : pkg.toString()) === packageId,
    );
    const updatedGroup = hasPackage
      ? await this.wishlistRepository.removePackageToGroup(groupId, packageId)
      : await this.wishlistRepository.addPackageToGroup(groupId, packageId);
    if (!updatedGroup) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.UPDATE);
    }
    return updatedGroup;
  }
  async addNoteToWishlistGroup(
    userId: string,
    groupId: string,
    dto: AddWishlistNoteRequestDTO,
  ): Promise<IWishlistGroup> {
    const { text } = dto;
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    const updatedGroup = await this.wishlistRepository.addNote(groupId, text);
    if (!updatedGroup) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.ADD_NOTE);
    }
    return updatedGroup;
  }
  async generateShareableLink(
    userId: string,
    groupId: string,
  ): Promise<{ shareToken: string }> {
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    if (group?.shareToken) {
      return { shareToken: group.shareToken };
    }

    const token = randomBytes(12).toString("hex");
    await this.wishlistRepository.updateShareToken(groupId, token, true);
    return { shareToken: token };
  }

  async getSharedGroup(shareToken: string): Promise<IWishlistGroup> {
    const group = await this.wishlistRepository.findByShareToken(shareToken);
    if (!group) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.LINK_EXPIRE_OR_NOT_FOUND,
      );
    }
    return group;
  }

  async editGroup(
    userId: string,
    groupId: string,
    dto: EditWishlistGroupRequestDTO,
  ): Promise<IWishlistGroup> {
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }
    const updated = await this.wishlistRepository.updateById(groupId, dto);
    if (!updated) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.UPDATE);
    }
    return updated;
  }

  async deleteGroup(
    userId: string,
    groupId: string,
  ): Promise<IWishlistGroup | null> {
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    return this.wishlistRepository.deleteById(groupId);
  }

  async deleteNote(userId: string, groupId: string, noteId: string) {
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    const updated = await this.wishlistRepository.deleteNote(groupId, noteId);
    if (!updated) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.UPDATE);
    }
    return updated;
  }

  async editNote(
    userId: string,
    groupId: string,
    noteId: string,
    dto: EditWishlistNoteRequestDTO,
  ): Promise<IWishlistGroup> {
    const { text } = dto;
    const group = await this.wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    const updated = await this.wishlistRepository.updateNote(
      groupId,
      noteId,
      text,
    );
    if (!updated) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.UPDATE);
    }
    return updated;
  }
}
