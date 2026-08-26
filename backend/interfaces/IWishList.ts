import { Types } from "mongoose";

export interface INote {
  _id?: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IWishlistGroup  {
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



export interface ITogglePackageDTO {
  groupId: string;
  packageId: string;
}

export interface IAddNoteDTO {
  text: string;
}
