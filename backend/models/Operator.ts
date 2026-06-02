import mongoose, { Document } from "mongoose";
export interface IBusinessAddress {
  buildingNo?: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface IVerificationDetails {
  companyName?: string;
  licenseNo?: string;
  businessAddress?: IBusinessAddress;
  submittedAt?: Date;
}

export interface IOperator extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  mobile: number;
  isEmailVerified: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  isPremium: boolean;
  otp: string | undefined;
  otpExpire: number | undefined;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: number | undefined;
  createdAt: Date;
  updatedAt: Date;
  verificationDetails: IVerificationDetails;
  referralCode: string;
  referredBy: string;
  role: string;
}

const operatorSchema = new mongoose.Schema(
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
    referralCode: String,
    referredBy: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpire: Number,
    resetPasswordToken: String,
    resetPasswordExpire: Number,
    isVerified: { type: Boolean, default: false },
    verificationDetails: {
      companyName: String,
      licenseNo: String,
      businessAddress: {
        buildingNo: String,
        landmark: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
      },
      submittedAt: Date,
    },
    role: { type: String, default: "operator" },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model<IOperator>("Operator", operatorSchema);
