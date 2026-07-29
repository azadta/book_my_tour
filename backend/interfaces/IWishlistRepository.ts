import { IBaseRepository } from "./IBaseRepository";
import { ICreateWishlistDTO, IWishlistGroup } from "./IWishList";

export interface IWishlistRepository extends IBaseRepository<IWishlistGroup>  {
  findByUserId(userId: string): Promise<IWishlistGroup[]>;
  findWishlistGroupById(groupId: string): Promise<IWishlistGroup | null>;
  findByShareToken(shareToken: string): Promise<IWishlistGroup | null>;

  createGroup(userId: string, dto: ICreateWishlistDTO): Promise<IWishlistGroup>;
  addPackageToGroup(
    groupId: string,
    packageId: string,
  ): Promise<IWishlistGroup | null>;
  removePackageToGroup(
    groupId: string,
    packageId: string,
  ): Promise<IWishlistGroup | null>;
  addNote(groupId: string, text: string): Promise<IWishlistGroup | null>;
  updateShareToken(
    groupId: string,
    token: string,
    isPublic: boolean,
  ): Promise<IWishlistGroup | null>;
  updateNote(groupId: string, noteId: string, text: string): Promise<IWishlistGroup | null>;
  deleteNote(groupId: string, noteId: string): Promise<IWishlistGroup | null>

}
