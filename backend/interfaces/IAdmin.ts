import { Document, Types } from "mongoose";

interface Address {
  houseNo?: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image: string;
  mobile?: number;
  address?: Address;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IAdminResponse = Omit<IAdmin, "password">;
