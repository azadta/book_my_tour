import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  currentUser: IUser | null;
  error: string | null;
  loading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  error: null,
  loading: false,
};

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  otp?: string;
  otpExpire?: number;
  isEmailVerified?: boolean;
  image?: string;
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logInStart: (state) => {
      state.loading = true;
    },
    logInSuccess: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload
        state.error = null
        state.loading = false
    },
    logInFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logoutUserStart: (state) => {
      state.loading = true;
    },
    logoutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    logoutUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  logInStart,
  logInFailure,
  logInSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logoutUserStart,
  logoutUserSuccess,
  logoutUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
