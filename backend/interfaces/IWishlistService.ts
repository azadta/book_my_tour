import {
  AddWishlistNoteInput,
  AddWishlistNoteRequestDTO,
  CreateWishlistGroupInput,
  CreateWishlistGroupRequestDTO,
  EditWishlistGroupInput,
  EditWishlistGroupRequestDTO,
  EditWishlistNoteInput,
  EditWishlistNoteRequestDTO,
  ToggleWishlistPackageInput,
  ToggleWishlistPackageRequestDTO,
} from "../dto-mapping/dto/wishlist/wishlistRequestDTO";
import {
  ShareLinkResponseDTO,
  WishlistGroupResponseDTO,
} from "../dto-mapping/dto/wishlist/wishlistResponseDTO";
import { IWishlistGroup } from "./IWishList";

export interface IWishlistService {
  getUserWishlists(userId: string): Promise<WishlistGroupResponseDTO[]>;
  createWishlistGroup(
    userId: string,
    body: CreateWishlistGroupInput,
  ): Promise<WishlistGroupResponseDTO>;
  togglePackageInWishlistGroup(
    userId: string,
    body: ToggleWishlistPackageInput,
  ): Promise<WishlistGroupResponseDTO>;
  addNoteToWishlistGroup(
    userId: string,
    groupId: string,
    body: AddWishlistNoteInput,
  ): Promise<WishlistGroupResponseDTO>;
  generateShareableLink(
    userId: string,
    groupId: string,
  ): Promise<ShareLinkResponseDTO>;
  getSharedGroup(shareToken: string): Promise<WishlistGroupResponseDTO>;
  editGroup(
    userId: string,
    groupId: string,
    body: EditWishlistGroupInput,
  ): Promise<WishlistGroupResponseDTO>;
  deleteGroup(userId: string, groupId: string): Promise<IWishlistGroup | null>;
  deleteNote(
    userId: string,
    groupId: string,
    noteId: string,
  ): Promise<WishlistGroupResponseDTO>;
  editNote(
    userId: string,
    groupId: string,
    noteId: string,
    body: EditWishlistNoteInput,
  ): Promise<WishlistGroupResponseDTO>;
}
