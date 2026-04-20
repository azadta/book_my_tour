import mongoose, { Document, Schema } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user";
  otp?: string;
  otpExpire?: number;
  isEmailVerified?: boolean;
  image?: string;
  isBlocked?: boolean;
  isPremium: boolean;
  mobile?: number;
  coinsEarned?: number;
  referralCode?: string;
  referredBy?: string;
  address: object;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: number | undefined;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    mobile: Number,
    isPremium: {
      type: Boolean,
      default: false,
    },
    coinsEarned: {
      type: Number,
      default: 0,
    },
    referralCode: String,
    referredBy: String,
    address: {
      houseNo: String,
      landmark: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpire: Number,
    resetPasswordToken: String,
    resetPasswordExpire: Number,
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("user", userSchema);
export default User;
