import mongoose, { Document, Schema } from "mongoose";

interface Address {
  houseNo?: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  mobile?: string;
  address?: Address;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema: Schema<IAdmin> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    mobile: Number,

    role: { type: String, default: "admin" },
    address: {
      houseNo: String,
      landmark: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
export default Admin;
