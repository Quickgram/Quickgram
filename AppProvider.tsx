import React, { PropsWithChildren } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SnackbarProvider } from "./src/components/common/Snackbar";
import { AuthProvider } from "./src/contexts/AuthContext";
import { GlobalStateProvider } from "./src/contexts/GlobalStateContext";

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <NavigationContainer>
    <SnackbarProvider>
      <AuthProvider>
        <GlobalStateProvider>{children}</GlobalStateProvider>
      </AuthProvider>
    </SnackbarProvider>
  </NavigationContainer>
);

export default AppProvider;
