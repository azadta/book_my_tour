import type { IPackage } from "./IPackage";

export interface INote {
  _id:string;
  text: string;
  createdAt: string;
}

export interface IWishlistGroup  {
  _id:string;
  userId: string;
  title: string;
  description: string;
  packages: IPackage[];
  notes: INote[];
  shareToken?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}