import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "@/src/types/AuthState";

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  phoneNumber: null,
  isNewUser: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string | null>) => {
      state.phoneNumber = action.payload;
    },
    setIsNewUser: (state, action: PayloadAction<boolean>) => {
      state.isNewUser = action.payload;
    },
    resetAuth: (state) => {
      return initialState;
    },
  },
});

export const {
  setIsAuthenticated,
  setUserId,
  setPhoneNumber,
  setIsNewUser,
  resetAuth,
} = authSlice.actions;
export default authSlice.reducer;
