import {
  AddWishlistNoteRequestDTO,
  CreateWishlistGroupRequestDTO,
  EditWishlistGroupRequestDTO,
  EditWishlistNoteRequestDTO,
  ToggleWishlistPackageRequestDTO,
} from "../../dto/wishlist/wishlistRequestDTO";

export class WishlistRequestMapper {
  static toCreateGroupReqDTO(body: any): CreateWishlistGroupRequestDTO {
    return {
      title: body.title,
      description: body.description,
    };
  }
  static toEditGroupReqDTO(body: any): EditWishlistGroupRequestDTO {
    return {
      title: body.title,
      description: body.description,
    };
  }
  static toTogglePackageReqDTO(body: any): ToggleWishlistPackageRequestDTO {
    return {
      groupId: body.groupId,
      packageId: body.packageId,
    };
  }
  static toAddNoteReqDTO(body: any): AddWishlistNoteRequestDTO {
    return {
      text: body.text,
    };
  }
  static toEditNoteReqDTO(body: any): EditWishlistNoteRequestDTO {
    return {
      text: body.text,
    };
  }
}
