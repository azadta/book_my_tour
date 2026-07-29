import { injectable } from "inversify";
import { IWishlistRepository } from "../interfaces/IWishlistRepository";
import { ICreateWishlistDTO, IWishlistGroup } from "../interfaces/IWishList";
import { BaseRepository } from "./baseRepository";
import WishlistGroup from "../models/WishlistGroup";

@injectable()
export class WishlistRepository
  extends BaseRepository<IWishlistGroup>
  implements IWishlistRepository
{
  constructor() {
    super(WishlistGroup);
  }

  async findByUserId(userId: string): Promise<IWishlistGroup[]> {
    return WishlistGroup.find({ userId }).populate("packages");
  }

  async findWishlistGroupById(groupId: string): Promise<IWishlistGroup | null> {
    return WishlistGroup.findById(groupId).populate("packages");
  }

  async findByShareToken(shareToken: string): Promise<IWishlistGroup | null> {
    return WishlistGroup.findOne({ shareToken, isPublic: true }).populate({
      path: "packages",
      populate: {
        path: "destinations",
      },
    });
  }

  async createGroup(
    userId: string,
    dto: ICreateWishlistDTO,
  ): Promise<IWishlistGroup> {
    return WishlistGroup.create({
      userId,
      title: dto.title,
      description: dto.description || "",
      packages: [],
    });
  }

  async addPackageToGroup(
    groupId: string,
    packageId: string,
  ): Promise<IWishlistGroup | null> {
    return WishlistGroup.findByIdAndUpdate(
      groupId,
      {
        $addToSet: { packages: packageId },
      },
      { new: true },
    ).populate("packages");
  }

  async removePackageToGroup(
    groupId: string,
    packageId: string,
  ): Promise<IWishlistGroup | null> {
    return WishlistGroup.findByIdAndUpdate(
      groupId,
      {
        $pull: { packages: packageId },
      },
      { new: true },
    ).populate("packages");
  }

  async addNote(groupId: string, text: string): Promise<IWishlistGroup | null> {
    return WishlistGroup.findByIdAndUpdate(
      groupId,
      {
        $push: { notes: { text, createdAt: new Date() } },
      },
      { new: true },
    );
  }

  async updateShareToken(
    groupId: string,
    token: string,
    isPublic: boolean,
  ): Promise<IWishlistGroup | null> {
    return WishlistGroup.findByIdAndUpdate(
      groupId,
      {
        shareToken: token,
        isPublic,
      },
      { new: true },
    );
  }

  async updateNote(
    groupId: string,
    noteId: string,
    text: string,
  ): Promise<IWishlistGroup | null> {
    return WishlistGroup.findOneAndUpdate(
      { _id: groupId, "notes._id": noteId },
      { $set: { "notes.$.text": text } },
      { new: true },
    );
  }

  async deleteNote(
    groupId: string,
    noteId: string,
  ): Promise<IWishlistGroup | null> {
    return WishlistGroup.findByIdAndUpdate(
      groupId,
      { $pull: { notes: { _id: noteId } } },
      { new: true },
    );
  }
}
