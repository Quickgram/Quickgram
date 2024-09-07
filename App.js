import React, { useEffect, useState, useMemo, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Appwrite from "./src/config/appwrite";
import BottomTabBar from "./src/components/navigation/BottomTabBar";
import { SnackbarProvider } from "./src/components/common/Snackbar";
import { localdbServices } from "./src/services/db/localdbServices";
import { apiServices } from "./src/services/api/apiServices";
import { CurrentUserContext } from "./src/contexts/CurrentUserContext";
import SplashScreen from "./src/screens/welcome/SplashScreen";
import WelcomeScreen from "./src/screens/welcome/WelcomeScreen";
import VerifyPhoneScreen from "./src/screens/authentication/VerifyPhoneScreen";
import VerifyOtpScreen from "./src/screens/authentication/VerifyOtpScreen";
import CreateProfileScreen from "./src/screens/authentication/CreateProfileScreen";
import EmailAndPassword from "./src/screens/authentication/EmailAndPassword";
import HomeScreen from "./src/screens/main/HomeScreen";
import StatusScreen from "./src/screens/main/StatusScreen";
import MyContactsScreen from "./src/screens/main/MyContactsScreen";
import SettingScreen from "./src/screens/main/SettingScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const screenOptions = useMemo(() => ({ headerShown: false }), []);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleUserDataChange = useCallback(async (user) => {
    setCurrentUser(user);
    await localdbServices.updateUserDataInLocaldb(user);
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await localdbServices.getCurrentUserDataFromLocaldb();
      setCurrentUser(user);
      setIsLoading(false);
    };

    fetchCurrentUser();

    const unsubscribe = apiServices.subscribeToUserDataChanges(
      currentUser?.uid,
      handleUserDataChange
    );

    return () => unsubscribe();
  }, [handleUserDataChange, currentUser?.uid]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={screenOptions}
        />
        <Tab.Screen
          name="Status"
          component={StatusScreen}
          options={screenOptions}
        />
        <Tab.Screen
          name="Contacts"
          component={MyContactsScreen}
          options={screenOptions}
        />
        <Tab.Screen
          name="Settings"
          component={SettingScreen}
          options={screenOptions}
        />
      </Tab.Navigator>
    </CurrentUserContext.Provider>
  );
};

const MainApp = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [appwriteClient, setAppwriteClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAppwrite = async () => {
      const client = Appwrite.client;
      setAppwriteClient(client);

      try {
        const isSigned = await apiServices.getSignedStatus();
        setInitialRoute(isSigned === "true" ? "MainTabs" : "WelcomeScreen");
      } catch (error) {
        setInitialRoute("WelcomeScreen");
      }
    };

    const minSplashTime = 2000;
    const startTime = Date.now();

    Promise.all([
      initAppwrite(),
      new Promise((resolve) => setTimeout(resolve, minSplashTime)),
    ]).then(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minSplashTime - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    });
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!initialRoute || !appwriteClient) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="VerifyPhoneScreen" component={VerifyPhoneScreen} />
        <Stack.Screen name="VerifyOtpScreen" component={VerifyOtpScreen} />
        <Stack.Screen
          name="CreateProfileScreen"
          component={CreateProfileScreen}
        />
        <Stack.Screen name="EmailAndPassword" component={EmailAndPassword} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SnackbarProvider>
      <MainApp />
    </SnackbarProvider>
  );
}
