import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "@/src/types/UserState";
import User from "@/src/models/User";

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<Partial<User> | null>) => {
      state.currentUser = action.payload;
    },
    resetUser: (state) => {
      return initialState;
    },
  },
});

export const { setCurrentUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
