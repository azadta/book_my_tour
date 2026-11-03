import { Types } from "mongoose";
import { INote } from "../../../interfaces/IWishList";
import { PackageWithDestinations } from "../../dto/package/packageResponseDTO";
import {
  ShareLinkResponseDTO,
  WishlistGroupMapperInput,
  WishlistGroupResponseDTO,
  WishlistNoteResponseDTO,
  WishlistPackageResponseDTO,
} from "../../dto/wishlist/wishlistResponseDTO";
import { PackageDestinationResponseMapper } from "../package-destination/PackageDestinationResponseMapper";

export class WishlistResponseMapper {
  static toNoteResponseDTO(note: INote): WishlistNoteResponseDTO {
    return {
      _id: note._id.toString(),
      text: note.text || "",
      createdAt: note.createdAt
        ? new Date(note.createdAt).toISOString()
        : new Date().toISOString(),
    };
  }
  static toPackageResponseDTO(
    pkg: PackageWithDestinations,
  ): WishlistPackageResponseDTO {
    return {
      _id: pkg._id.toString(),
      name: pkg.name,
      amount: pkg.amount,
      discount: pkg.discount ?? 0,
      duration: pkg.duration,
      images: pkg.images,
      category: pkg.category.toString(),
      destinations: PackageDestinationResponseMapper.toSummaryDTOList(
        pkg.destinations,
      ),
      availableSlots: pkg.availableSlots,
    };
  }
  static toGroupResponseDTO(
    group: WishlistGroupMapperInput,
  ): WishlistGroupResponseDTO {
    return {
      _id: group._id.toString(),
      userId: group.userId.toString(),
      title: group.title || "",
      description: group.description || "",
      isPublic: group.isPublic ?? false,
      ...(group.shareToken && { shareToken: group.shareToken }),
      packages:
        group.packages.length > 0 && group.packages[0] instanceof Types.ObjectId
          ? group.packages.map((pkg) => pkg.toString())
          : group.packages.map((pkg) =>
              this.toPackageResponseDTO(pkg as PackageWithDestinations),
            ),
      notes: group.notes ? group.notes.map(this.toNoteResponseDTO) : [],
      createdAt: new Date(group.createdAt).toISOString(),
      updatedAt: new Date(group.updatedAt).toISOString(),
    };
  }
  static toGroupResponseListDTO(
    groups: WishlistGroupMapperInput[],
  ): WishlistGroupResponseDTO[] {
    return groups.map((group) => this.toGroupResponseDTO(group));
  }
  static toShareLinkDTO(data: { shareToken: string }): ShareLinkResponseDTO {
    return { shareToken: data.shareToken };
  }
}
