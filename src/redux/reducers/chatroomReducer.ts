import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatRoomState } from "@/src/types/ChatRoomState";
import User from "@/src/models/User";
import ChatRooms from "@/src/models/ChatRooms";
import Message from "@/src/models/Message";
import ChattedUser from "@/src/models/ChattedUser";

const initialState: ChatRoomState = {
  currentChatroomUser: null,
  currentChatroomId: null,
  myChatrooms: null,
  chattedUsers: [],
};

const chatroomSlice = createSlice({
  name: "chatroom",
  initialState,
  reducers: {
    setCurrentChatroomUser: (
      state,
      action: PayloadAction<Partial<User> | null>
    ) => {
      state.currentChatroomUser = action.payload;
    },
    setCurrentChatroomId: (state, action: PayloadAction<string | null>) => {
      state.currentChatroomId = action.payload;
    },
    setMyChatrooms: (
      state,
      action: PayloadAction<Partial<ChatRooms> | null>
    ) => {
      state.myChatrooms = action.payload;
    },
    setChattedUsers: (state, action: PayloadAction<Partial<ChattedUser>[]>) => {
      state.chattedUsers = action.payload;
    },
    resetChatroom: (state) => {
      return initialState;
    },
  },
});

export const {
  setCurrentChatroomUser,
  setCurrentChatroomId,
  setMyChatrooms,
  setChattedUsers,
  resetChatroom,
} = chatroomSlice.actions;
export default chatroomSlice.reducer;
