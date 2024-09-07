import React, { PropsWithChildren } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SnackbarProvider } from "./src/components/common/Snackbar";
import { AuthProvider } from "./src/contexts/AuthContext";

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <NavigationContainer>
    <SnackbarProvider>
      <AuthProvider>{children}</AuthProvider>
    </SnackbarProvider>
  </NavigationContainer>
);

export default AppProvider;
