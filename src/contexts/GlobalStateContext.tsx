import React, { createContext, useState, useContext, ReactNode } from "react";
import User from "../models/user";
import { Platform } from "react-native";

interface GlobalStateContextType {
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
  isIos: boolean;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isIos, setIsIos] = useState(Platform.OS === "ios");
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [homeScreenSearchQuery, setHomeScreenSearchQuery] = useState("");
  const [isHomeScreenScrolling, setIsHomeScreenScrolling] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState<User | null>(null);

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
        isIos,
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
