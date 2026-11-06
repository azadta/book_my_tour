// import {
//   createAsyncThunk,
//   createSlice,
//   type PayloadAction,
// } from "@reduxjs/toolkit";

// import { APP_ROUTES } from "@/constants/AppRoutes";
// import type { IPackage } from "@/interfaces/IPackage";
// import { handleApiError } from "@/utils/axiosErrorHandler";
// import { axiosInstance } from "../../api/axiosInstance";

// interface PackageState {
//   data: IPackage[];
//   totalCount: number;
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error?: string;
// }

// export const fetchPackages = createAsyncThunk<
//   { packages: IPackage[]; totalCount: number },
//   { page: number; limit: number },
//   { rejectValue: string }
// >("package/fetch", async ({ page, limit }, { rejectWithValue }) => {
//   try {
//     const res = await axiosInstance.get(APP_ROUTES.USER.PACKAGES_HOME, {
//       params: {
//         page,
//         limit,
//       },
//     });

//     return res.data;
//   } catch (error) {
//     const errorMessage = handleApiError(error);
//     if (errorMessage) return rejectWithValue(errorMessage);
//   }
// });

// const initialState: PackageState = {
//   data: [],
//   totalCount: 0,
//   status: "idle",
// };

// const packageSlice = createSlice({
//   name: "package",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPackages.pending, (state) => {
//         state.status = "loading";
//         state.error = "undefined";
//       })
//       .addCase(
//         fetchPackages.fulfilled,
//         (
//           state,
//           action: PayloadAction<{ packages: IPackage[]; totalCount: number }>,
//         ) => {
//           state.status = "succeeded";
//           state.data = action.payload.packages;
//           state.totalCount = action.payload.totalCount;
//         },
//       )
//       .addCase(fetchPackages.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       });
//   },
// });

// export default packageSlice.reducer;
