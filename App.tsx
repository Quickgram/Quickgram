import React from "react";
import Toast from "react-native-toast-message";
import AppProvider from "./AppProvider";
import AppNavigator from "./src/navigation/AppNavigator";
import { toastConfig, toastOptions } from "./src/config/toast";

const App = () => (
  <>
    <AppProvider>
      <AppNavigator />
    </AppProvider>
    <Toast config={toastConfig} {...toastOptions} />
  </>
);

export default App;
