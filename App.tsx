import React from "react";
import AppProvider from "./AppProvider";
import AppNavigator from "./src/navigation/AppNavigator";

const App = () => (
  <AppProvider>
    <AppNavigator />
  </AppProvider>
);

export default App;
