import {
  ShareLinkResponseDTO,
  WishlistGroupResponseDTO,
  WishlistNoteResponseDTO,
  WishlistPackageResponseDTO,
} from "../../dto/wishlist/wishlistResponseDTO";

export class WishlistResponseMapper {
  static toNoteResponseDTO(note: any): WishlistNoteResponseDTO {
    return {
      _id: note._id.toString(),
      text: note.text || "",
      createdAt: note.createdAt
        ? new Date(note.createdAt).toISOString()
        : new Date().toISOString(),
    };
  }
  static toPackageResponseDTO(pkg: any): WishlistPackageResponseDTO {
    return {
      _id: pkg._id.toString(),
      name: pkg.name,
      amount: pkg.amount,
      discount: pkg.discount ?? 0,
      duration: pkg.duration,
      images: pkg.images,
      category: pkg.category,
      destinations: pkg.destinations?.map((dest: any) =>
        typeof dest === "object" && dest !== null
          ? { _id: dest._id.toString(), name: dest.name }
          : dest.toString(),
      ),
      isCustomizable: pkg.isCustomizable,
      availableSlots: pkg.availableSlots,
    };
  }
  static toGroupResponseDTO(group: any): WishlistGroupResponseDTO {
    return {
      _id: group._id.toString(),
      userId: group.userId.toString(),
      title: group.title || "",
      description: group.description || "",
      isPublic: group.isPublic ?? false,
      shareToken: group.shareToken,
      packages: group.packages
        ? group.packages.map(this.toPackageResponseDTO)
        : [],
      notes: group.notes ? group.notes.map(this.toNoteResponseDTO) : [],
      createdAt: new Date(group.createdAt).toISOString(),
      updatedAt: new Date(group.updatedAt).toISOString(),
    };
  }
  static toGroupResponseListDTO(groups: any[]): WishlistGroupResponseDTO[] {
    return groups.map((group) => this.toGroupResponseDTO(group));
  }
  static toShareLinkDTO(data: { shareToken: string }): ShareLinkResponseDTO {
    return { shareToken: data.shareToken };
  }
}
