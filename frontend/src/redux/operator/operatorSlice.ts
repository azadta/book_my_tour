import type { IOperator } from "@/interfaces/IOperator";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface OperatorState {
  currentOperator: IOperator | null;
  loading: boolean;
  error: string | null;
}
const initialState: OperatorState = {
  currentOperator: null,
  loading: false,
  error: null,
};

const operatorSlice = createSlice({
  name: "operator",
  initialState,
  reducers: {
    operatorLoginStart: (state) => {
      state.loading = true;
    },
    operatorLoginSuccess: (state, action: PayloadAction<IOperator>) => {
      state.currentOperator = action.payload;
      state.loading = false;
      state.error = null;
    },
    operatorLoginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    updateOperatorStart: (state) => {
      state.loading = true;
    },
    updateOperatorSuccess: (state, action: PayloadAction<IOperator>) => {
      state.currentOperator = action.payload
        state.loading = false
        state.error = null
    },
    updateOperatorFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logoutOperatorStart: (state) => {
      state.loading = true;
    },
    logoutOperatorSuccess: (state) => {
      state.currentOperator = null;
      state.error = null;
      state.loading = false;
    },
    logoutOperatorFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  operatorLoginStart,
  operatorLoginSuccess,
  operatorLoginFailure,

  updateOperatorStart,
  updateOperatorSuccess,
  updateOperatorFailure,
  logoutOperatorStart,
  logoutOperatorSuccess,
  logoutOperatorFailure,
} = operatorSlice.actions;

export default operatorSlice.reducer;
