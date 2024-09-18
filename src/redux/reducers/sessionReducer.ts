import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SessionState } from "@/src/types/SessionState";
import { SessionResponse } from "@/src/types/SessionTypes";

const initialState: SessionState = {
  activeSessionsData: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setActiveSessionsData: (state, action: PayloadAction<SessionResponse>) => {
      state.activeSessionsData = action.payload;
    },
  },
});

export const { setActiveSessionsData } = sessionSlice.actions;
export default sessionSlice.reducer;
