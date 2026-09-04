import {
  AddWishlistNoteRequestDTO,
  CreateWishlistGroupRequestDTO,
  EditWishlistGroupRequestDTO,
  EditWishlistNoteRequestDTO,
  ToggleWishlistPackageRequestDTO,
} from "../dto-mapper/dto/wishlist/wishlistRequestDTO";
import { IWishlistGroup } from "./IWishList";

export interface IWishlistService {
  getUserWishlists(userId: string): Promise<IWishlistGroup[]>;
  createWishlistGroup(
    userId: string,
    dto: CreateWishlistGroupRequestDTO,
  ): Promise<IWishlistGroup>;
  togglePackageInWishlistGroup(
    userId: string,
    dto: ToggleWishlistPackageRequestDTO,
  ): Promise<IWishlistGroup>;
  addNoteToWishlistGroup(
    userId: string,
    groupId: string,
    dto: AddWishlistNoteRequestDTO,
  ): Promise<IWishlistGroup>;
  generateShareableLink(
    userId: string,
    groupId: string,
  ): Promise<{
    shareToken: string;
  }>;
  getSharedGroup(shareToken: string): Promise<IWishlistGroup>;
  editGroup(
    userId: string,
    groupId: string,
    dto: EditWishlistGroupRequestDTO,
  ): Promise<IWishlistGroup>;
  deleteGroup(userId: string, groupId: string): Promise<IWishlistGroup | null>;
  deleteNote(
    userId: string,
    groupId: string,
    noteId: string,
  ): Promise<IWishlistGroup>;
  editNote(
    userId: string,
    groupId: string,
    noteId: string,
    dto: EditWishlistNoteRequestDTO,
  ): Promise<IWishlistGroup>;
}
