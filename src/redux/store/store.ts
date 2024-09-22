import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/authReducer";
import userReducer from "../reducers/userReducer";
import sessionReducer from "../reducers/sessionReducer";
import globalReducer from "../reducers/globalReducer";
import chatroomReducer from "../reducers/chatroomReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    session: sessionReducer,
    global: globalReducer,
    chatroom: chatroomReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
