import User from "@/src/models/User";
import Chat from "../models/Chat";

export interface UserState {
  currentUser: Partial<User> | null;
}
