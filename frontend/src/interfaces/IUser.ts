
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  otp?: string;
  otpExpire?: number;
  isEmailVerified?: boolean;
  image: string;
  isBlocked?: boolean;
  isPremium: boolean;
  mobile?: "";
  coinsEarned?: number;
  referralCode?: string;
  referredBy?: string;
  address: {
    houseNo: string;
    landmark: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  resetPasswordToken: string;
  resetPasswordExpire: Date;
}


