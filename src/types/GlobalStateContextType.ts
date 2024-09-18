import User from "../models/User";

export interface GlobalStateContextType {
  isProfileEditing: boolean;
  setIsProfileEditing: (value: boolean) => void;
  isProfileUpdating: boolean;
  setIsProfileUpdating: (value: boolean) => void;
  homeScreenSearchQuery: string;
  setHomeScreenSearchQuery: (value: string) => void;
  isHomeScreenScrolling: boolean;
  setIsHomeScreenScrolling: (value: boolean) => void;
  currentChatUser: User | null;
  setCurrentChatUser: (value: User | null) => void;
  currentChatId: string | null;
  setCurrentChatId: (value: string | null) => void;
  hasInternetConnection: boolean;
  setHasInternetConnection: (value: boolean) => void;
  isiOS: boolean;
}
