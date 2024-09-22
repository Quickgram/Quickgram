import User from "@/src/models/User";
import ChatRooms from "@/src/models/ChatRooms";
import ChattedUser from "@/src/models/ChattedUser";

export interface ChatRoomState {
  currentChatroomUser: Partial<User> | null;
  currentChatroomId: string | null;
  myChatrooms: Partial<ChatRooms> | null;
  chattedUsers: Partial<ChattedUser>[];
}
