export interface CreateWishlistGroupRequestDTO {
  title: string;
  description?: string;
}

export interface EditWishlistGroupRequestDTO {
  title?: string;
  description?: string;
}

export interface ToggleWishlistPackageRequestDTO {
  groupId: string;
  packageId: string;
}

export interface AddWishlistNoteRequestDTO {
  text: string;
}
export interface EditWishlistNoteRequestDTO {
  text: string;
}
