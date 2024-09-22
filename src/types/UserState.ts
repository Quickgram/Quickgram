import User from "@/src/models/User";

export interface UserState {
  currentUser: Partial<User> | null;
}
