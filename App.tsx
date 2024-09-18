import React from "react";
import Toast from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./src/redux/store/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { toastConfig, toastOptions } from "./src/config/toast";
import { useInternetConnection } from "./src/services/hooks/useInternetConnection";

const AppContent = () => {
  useInternetConnection();
  return <AppNavigator />;
};

const App = () => (
  <NavigationContainer>
    <Provider store={store}>
      <AppContent />
      <Toast config={toastConfig} {...toastOptions} />
    </Provider>
  </NavigationContainer>
);

export default App;
