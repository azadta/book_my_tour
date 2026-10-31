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
} from "../../dto/wishlist/wishlistRequestDTO";

export class WishlistRequestMapper {
  static toCreateGroupReqDTO(
    body: CreateWishlistGroupInput,
  ): CreateWishlistGroupRequestDTO {
    return {
      title: body.title,
      ...(body.description && { description: body.description }),
    };
  }
  static toEditGroupReqDTO(
    body: EditWishlistGroupInput,
  ): EditWishlistGroupRequestDTO {
    return {
      ...(body.title && { title: body.title }),
      ...(body.description && { description: body.description }),
    };
  }
  static toTogglePackageReqDTO(
    body: ToggleWishlistPackageInput,
  ): ToggleWishlistPackageRequestDTO {
    return {
      groupId: body.groupId,
      packageId: body.packageId,
    };
  }
  static toAddNoteReqDTO(
    body: AddWishlistNoteInput,
  ): AddWishlistNoteRequestDTO {
    return {
      text: body.text,
    };
  }
  static toEditNoteReqDTO(body: EditWishlistNoteInput): EditWishlistNoteRequestDTO {
    return {
      text: body.text,
    };
  }
}
