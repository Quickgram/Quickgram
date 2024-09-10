import React, { PropsWithChildren } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/contexts/AuthContext";
import { GlobalStateProvider } from "./src/contexts/GlobalStateContext";

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <NavigationContainer>
    <AuthProvider>
      <GlobalStateProvider>{children}</GlobalStateProvider>
    </AuthProvider>
  </NavigationContainer>
);

export default AppProvider;
