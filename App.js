import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./app/WelcomeScreen";
import VerifyPhoneScreen from "./app/authentication/VerifyPhoneScreen";
import VerifyOtpScreen from "./app/authentication/VerifyOtpScreen";
import CreateProfileScreen from "./app/authentication/CreateProfileScreen";
import EmailAndPassword from "./app/authentication/EmailAndPassword";
import HomeScreen from "./app/screens/HomeScreen";
import SettingScreen from "./app/screens/SettingScreen";
import * as Appwrite from "react-native-appwrite";
import appwriteConfig from "./src/appwrite/AppwriteConfig";
import * as SecureStore from "expo-secure-store";
const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [client, setClient] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const initAppwrite = () => {
      const newClient = new Appwrite.Client();
      newClient
        .setEndpoint(appwriteConfig.config.endpoint)
        .setProject(appwriteConfig.config.project);
      setClient(newClient);
      setAccount(new Appwrite.Account(newClient));
    };

    initAppwrite();

    const checkSignedStatus = async () => {
      try {
        const isSigned = await SecureStore.getItemAsync("isSigned");
        if (isSigned === "true") {
          setInitialRoute("HomeScreen");
        } else {
          setInitialRoute("Welcome");
        }
      } catch (error) {
        setInitialRoute("Welcome");
      }
    };

    checkSignedStatus();
  }, []);

  if (!initialRoute || !client || !account) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyPhoneScreen"
          component={VerifyPhoneScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyOtpScreen"
          component={VerifyOtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateProfileScreen"
          component={CreateProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailAndPassword"
          component={EmailAndPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SettingScreen"
          component={SettingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
