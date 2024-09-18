import User from "@/src/models/User";

export interface GlobalState {
  isiOS: boolean;
  isProfileEditing: boolean;
  isProfileUpdating: boolean;
  homeScreenSearchQuery: string;
  currentChatUser: User | null;
  currentChatId: string | null;
  hasInternetConnection: boolean;
}
