import { randomBytes } from "crypto";
import { inject, injectable } from "inversify";
import { RESPONSE_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCodeConstants";
import { IWishlistGroup } from "../interfaces/IWishList";
import type { IWishlistRepository } from "../interfaces/IWishlistRepository";

import {
  AddWishlistNoteInput,
  CreateWishlistGroupInput,
  EditWishlistGroupInput,
  EditWishlistNoteInput,
  ToggleWishlistPackageInput
} from "../dto-mapping/dto/wishlist/wishlistRequestDTO";
import {
  ShareLinkResponseDTO,
  WishlistGroupResponseDTO,
} from "../dto-mapping/dto/wishlist/wishlistResponseDTO";
import { WishlistRequestMapper } from "../dto-mapping/mapper/wishlist/WishlistRequestMapper";
import { WishlistResponseMapper } from "../dto-mapping/mapper/wishlist/WishlistResponseMapper";
import { IWishlistService } from "../interfaces/IWishlistService";
import { Types } from "../types/types";
import { CustomError } from "../utils/customError";

@injectable()
export class WishlistService implements IWishlistService {
  constructor(
    @inject(Types.WishlistRepository)
    private _wishlistRepository: IWishlistRepository,
  ) {}

  async getUserWishlists(userId: string): Promise<WishlistGroupResponseDTO[]> {
    const wishlistGroups = await this._wishlistRepository.findByUserId(userId);
    return WishlistResponseMapper.toGroupResponseListDTO(wishlistGroups);
  }
  async createWishlistGroup(
    userId: string,
    body: CreateWishlistGroupInput,
  ): Promise<WishlistGroupResponseDTO> {
    const dto = WishlistRequestMapper.toCreateGroupReqDTO(body);
    const wishlistGroup = await this._wishlistRepository.createGroup(
      userId,
      dto,
    );
    return WishlistResponseMapper.toGroupResponseDTO(wishlistGroup);
  }
  async togglePackageInWishlistGroup(
    userId: string,
    body: ToggleWishlistPackageInput,
  ): Promise<WishlistGroupResponseDTO> {
    const dto = WishlistRequestMapper.toTogglePackageReqDTO(body);
    const { groupId, packageId } = dto;
    const group = await this._wishlistRepository.findWishlistGroupById(groupId);
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
      ? await this._wishlistRepository.removePackageToGroup(groupId, packageId)
      : await this._wishlistRepository.addPackageToGroup(groupId, packageId);
    if (!updatedGroup) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.UPDATE);
    }
    return WishlistResponseMapper.toGroupResponseDTO(updatedGroup);
  }
  async addNoteToWishlistGroup(
    userId: string,
    groupId: string,
    body: AddWishlistNoteInput,
  ): Promise<WishlistGroupResponseDTO> {
    const dto = WishlistRequestMapper.toAddNoteReqDTO(body);
    const { text } = dto;
    const group = await this._wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    const updatedGroup = await this._wishlistRepository.addNote(groupId, text);
    if (!updatedGroup) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.ADD_NOTE);
    }
    return WishlistResponseMapper.toGroupResponseDTO(updatedGroup);
  }
  async generateShareableLink(
    userId: string,
    groupId: string,
  ): Promise<ShareLinkResponseDTO> {
    const group = await this._wishlistRepository.findWishlistGroupById(groupId);
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
    await this._wishlistRepository.updateShareToken(groupId, token, true);
    return WishlistResponseMapper.toShareLinkDTO({ shareToken: token });
  }

  async getSharedGroup(shareToken: string): Promise<WishlistGroupResponseDTO> {
    const group = await this._wishlistRepository.findByShareToken(shareToken);
    if (!group) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.LINK_EXPIRE_OR_NOT_FOUND,
      );
    }
    return WishlistResponseMapper.toGroupResponseDTO(group);
  }

  async editGroup(
    userId: string,
    groupId: string,
    body: EditWishlistGroupInput,
  ): Promise<WishlistGroupResponseDTO> {
    const dto = WishlistRequestMapper.toEditGroupReqDTO(body);
    const group = await this._wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }
    const updated = await this._wishlistRepository.updateById(groupId, dto);
    if (!updated) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.UPDATE);
    }
    return WishlistResponseMapper.toGroupResponseDTO(updated);
  }

  async deleteGroup(
    userId: string,
    groupId: string,
  ): Promise<IWishlistGroup | null> {
    const group = await this._wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    return this._wishlistRepository.deleteById(groupId);
  }

  async deleteNote(userId: string, groupId: string, noteId: string) {
    const group = await this._wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    const updatedGroup = await this._wishlistRepository.deleteNote(
      groupId,
      noteId,
    );
    if (!updatedGroup) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.UPDATE);
    }
    return WishlistResponseMapper.toGroupResponseDTO(updatedGroup);
  }

  async editNote(
    userId: string,
    groupId: string,
    noteId: string,
    body: EditWishlistNoteInput,
  ): Promise<WishlistGroupResponseDTO> {
    const dto = WishlistRequestMapper.toEditNoteReqDTO(body);
    const { text } = dto;
    const group = await this._wishlistRepository.findWishlistGroupById(groupId);
    if (!group || group.userId.toString() !== userId) {
      throw new CustomError(
        RESPONSE_MESSAGES.WISHLIST.ERROR.UNAUTHORIZED_OR_NOT_FOUND,
        StatusCode.UNAUTHORIZED,
      );
    }

    const updatedGroup = await this._wishlistRepository.updateNote(
      groupId,
      noteId,
      text,
    );
    if (!updatedGroup) {
      throw new CustomError(RESPONSE_MESSAGES.WISHLIST.ERROR.UPDATE);
    }
    return WishlistResponseMapper.toGroupResponseDTO(updatedGroup);
  }
}
