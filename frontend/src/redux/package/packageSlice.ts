import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { axiosInstance } from "../../api/axiosInstance";

interface Destination {
  name: string;
  _id: string;
}

export interface IPackage {
  _id: string;
  name: string;
  amount: number;
  destinations: Destination[];
  duration: {
    day: number;
    night: number;
  };
  specifications?: string[];
  expiryDate?: string;
  operatorId?: string;
  remark?: string;
  createdAt?: string;
  isCustomizable?: boolean;
  discount?: number;
  availableSlots?: string[];
  images: string[];
  category?: string | { [key: string]: any };
}

interface PackageState {
  data: IPackage[];
  totalCount: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

export const fetchPackages = createAsyncThunk<
  { packages: IPackage[]; totalCount: number },
  { page: number; limit: number },
  { rejectValue: string }
>("package/fetch", async ({ page, limit }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(
      `/user/packages/home?page=${page}&limit=${limit}`,
    );

    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "failed to fetch packages";
    return rejectWithValue(message);
  }
});

const initialState: PackageState = {
  data: [],
  totalCount: 0,
  status: "idle",
};

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.status = "loading";
        state.error = "undefined";
      })
      .addCase(
        fetchPackages.fulfilled,
        (
          state,
          action: PayloadAction<{ packages: IPackage[]; totalCount: number }>,
        ) => {
          state.status = "succeeded";
          state.data = action.payload.packages;
          state.totalCount = action.payload.totalCount;
        },
      )
      .addCase(fetchPackages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default packageSlice.reducer;
