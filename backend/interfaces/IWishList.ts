import { Types } from "mongoose";

export interface INote {
  _id?: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IWishlistGroup extends Document {
  userId: Types.ObjectId;
  title: string;
  description: string;
  packages: Types.ObjectId[];
  notes: INote[];
  shareToken: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateWishlistDTO {
  title: string;
  description?: string;
}

export interface ITogglePackageDTO {
  groupId: string;
  packageId: string;
}

export interface IAddNoteDTO {
  text: string;
}
