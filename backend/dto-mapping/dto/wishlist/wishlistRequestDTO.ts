export interface CreateWishlistGroupRequestDTO {
  title: string;
  description?: string;
}

export interface CreateWishlistGroupInput {
  title: string;
  description?: string;
}

export interface EditWishlistGroupRequestDTO {
  title?: string;
  description?: string;
}
export interface EditWishlistGroupInput {
  title?: string;
  description?: string;
}

export interface ToggleWishlistPackageRequestDTO {
  groupId: string;
  packageId: string;
}
export interface ToggleWishlistPackageInput {
  groupId: string;
  packageId: string;
}

export interface AddWishlistNoteRequestDTO {
  text: string;
}
export interface AddWishlistNoteInput {
  text: string;
}
export interface EditWishlistNoteRequestDTO {
  text: string;
}
export interface EditWishlistNoteInput {
  text: string;
}
