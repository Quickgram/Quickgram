import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../../models/User";
import { Platform } from "react-native";
import { GlobalState } from "@/src/types/GlobalState";
import ChatRoom from "@/src/models/ChatRoom";
import Message from "@/src/models/Message";

const initialState: GlobalState = {
  isIos: Platform.OS === "ios",
  isProfileEditing: false,
  isProfileUpdating: false,
  homeScreenSearchQuery: "",
  hasInternetConnection: true,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsProfileEditing: (state, action: PayloadAction<boolean>) => {
      state.isProfileEditing = action.payload;
    },
    setIsProfileUpdating: (state, action: PayloadAction<boolean>) => {
      state.isProfileUpdating = action.payload;
    },
    setHomeScreenSearchQuery: (state, action: PayloadAction<string>) => {
      state.homeScreenSearchQuery = action.payload;
    },
    setHasInternetConnection: (state, action: PayloadAction<boolean>) => {
      state.hasInternetConnection = action.payload;
    },
    resetGlobal: (state) => {
      return initialState;
    },
  },
});

export const {
  setIsProfileEditing,
  setIsProfileUpdating,
  setHomeScreenSearchQuery,
  setHasInternetConnection,
  resetGlobal,
} = globalSlice.actions;

export default globalSlice.reducer;
