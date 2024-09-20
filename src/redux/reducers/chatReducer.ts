import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState } from "@/src/types/ChatState";
import User from "@/src/models/User";
import Chat from "@/src/models/Chat";
import Message from "@/src/models/Message";

const initialState: ChatState = {
  currentChatUser: null,
  currentChatId: null,
  chatsData: [],
  lastMessages: [],
  chattedUsers: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChatUser: (
      state,
      action: PayloadAction<Partial<User> | null>
    ) => {
      state.currentChatUser = action.payload;
    },
    setCurrentChatId: (state, action: PayloadAction<string | null>) => {
      state.currentChatId = action.payload;
    },
    setChatsData: (state, action: PayloadAction<Partial<Chat>[]>) => {
      state.chatsData = action.payload;
    },
    setLastMessages: (state, action: PayloadAction<Partial<Message>[]>) => {
      state.lastMessages = action.payload;
    },
    setChattedUsers: (state, action: PayloadAction<Partial<User>[]>) => {
      state.chattedUsers = action.payload;
    },
  },
});

export const {
  setCurrentChatUser,
  setCurrentChatId,
  setChatsData,
  setLastMessages,
  setChattedUsers,
} = chatSlice.actions;
export default chatSlice.reducer;
