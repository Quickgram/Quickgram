import React from "react";
import Toast from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./src/redux/store/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { toastConfig, toastOptions } from "./src/config/toast";
import { useInternetConnection } from "./src/services/hooks/useInternetConnection";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const AppContent = () => {
  useInternetConnection();
  return <AppNavigator />;
};

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <AppContent />
          <Toast config={toastConfig} {...toastOptions} />
        </Provider>
      </BottomSheetModalProvider>
    </NavigationContainer>
  </GestureHandlerRootView>
);

export default App;
