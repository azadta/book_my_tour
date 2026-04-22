import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AdminAddress {
  houseNo?: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface IAdmin {
  _id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  mobile?: string;
  address: AdminAddress;
  cretedAt: string;
  updatedAt: string;
}

interface AdminState {
  currentAdmin: IAdmin | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  currentAdmin: null,
  error: null,
  loading: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminLoginStart: (state) => {
      state.loading = true;
    },
    adminLoginSuccess: (state, action: PayloadAction<IAdmin>) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = null;
    },
    adminLoginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    adminLogoutStart: (state) => {
      state.loading = true;
    },
    adminLogoutSuccess: (state) => {
      state.currentAdmin = null;
      state.loading = false;
      state.error = null;
    },
    adminLogoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateAdminStart: (state) => {
      state.loading = true;
    },
    updateAdminSuccess: (state, action: PayloadAction<IAdmin>) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateAdminFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  adminLoginStart,
  adminLoginSuccess,
  adminLoginFailure,
  adminLogoutStart,
  adminLogoutSuccess,
  adminLogoutFailure,
  updateAdminStart,
  updateAdminSuccess,
  updateAdminFailure,
} = adminSlice.actions;

export default adminSlice.reducer;
