import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import User from "../models/User";
import { Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { GlobalStateContextType } from "../types/GlobalStateContextType";

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isiOS, setIsiOS] = useState(Platform.OS === "ios");
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [homeScreenSearchQuery, setHomeScreenSearchQuery] = useState("");
  const [isHomeScreenScrolling, setIsHomeScreenScrolling] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState<User | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [hasInternetConnection, setHasInternetConnection] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setHasInternetConnection(!!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{
        isProfileEditing,
        setIsProfileEditing,
        isProfileUpdating,
        setIsProfileUpdating,
        homeScreenSearchQuery,
        setHomeScreenSearchQuery,
        isHomeScreenScrolling,
        setIsHomeScreenScrolling,
        currentChatUser,
        setCurrentChatUser,
        currentChatId,
        setCurrentChatId,
        hasInternetConnection,
        setHasInternetConnection,
        isiOS,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
