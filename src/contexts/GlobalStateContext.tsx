import React, { createContext, useState, useContext, ReactNode } from "react";

interface GlobalStateContextType {
  isProfileEditing: boolean;
  setIsProfileEditing: (value: boolean) => void;
  isProfileUpdating: boolean;
  setIsProfileUpdating: (value: boolean) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);

  return (
    <GlobalStateContext.Provider
      value={{
        isProfileEditing,
        setIsProfileEditing,
        isProfileUpdating,
        setIsProfileUpdating,
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
