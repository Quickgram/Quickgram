import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../../models/User";
import { Platform } from "react-native";
import { GlobalState } from "@/src/types/GlobalState";

const initialState: GlobalState = {
  isiOS: Platform.OS === "ios",
  isProfileEditing: false,
  isProfileUpdating: false,
  homeScreenSearchQuery: "",
  currentChatUser: null,
  currentChatId: null,
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
    setCurrentChatUser: (state, action: PayloadAction<User | null>) => {
      state.currentChatUser = action.payload;
    },
    setCurrentChatId: (state, action: PayloadAction<string | null>) => {
      state.currentChatId = action.payload;
    },
    setHasInternetConnection: (state, action: PayloadAction<boolean>) => {
      state.hasInternetConnection = action.payload;
    },
  },
});

export const {
  setIsProfileEditing,
  setIsProfileUpdating,
  setHomeScreenSearchQuery,
  setCurrentChatUser,
  setCurrentChatId,
  setHasInternetConnection,
} = globalSlice.actions;

export default globalSlice.reducer;
