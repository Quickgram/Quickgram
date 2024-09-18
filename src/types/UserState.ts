import User from "@/src/models/User";

export interface UserState {
  currentUser: User | null;
}
