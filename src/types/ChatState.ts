import User from "@/src/models/User";
import Chat from "../models/Chat";
import Message from "../models/Message";

export interface ChatState {
  currentChatUser: Partial<User> | null;
  currentChatId: string | null;
  chatsData: Partial<Chat>[];
  lastMessages: Partial<Message>[];
  chattedUsers: Partial<User>[];
}
