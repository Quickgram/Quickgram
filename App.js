import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./app/WelcomeScreen";
import VerifyPhoneScreen from "./app/authentication/VerifyPhoneScreen";
import VerifyOtpScreen from "./app/authentication/VerifyOtpScreen";
import NewUserScreen from "./app/authentication/NewUserScreen";
import EmailAndPassword from "./app/authentication/EmailAndPassword";
import * as Appwrite from "react-native-appwrite";
import appwriteConfig from "./src/appwrite/AppwriteConfig";

const client = new Appwrite.Client();
client
  .setEndpoint(appwriteConfig.config.endpoint)
  .setProject(appwriteConfig.config.project);
const account = new Appwrite.Account(client);
const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get();
        if (session) {
          setInitialRoute("NewUserScreen");
        }
      } catch (error) {
        setInitialRoute("Welcome");
      }
    };

    checkSession();
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
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
          name="NewUserScreen"
          component={NewUserScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailAndPassword"
          component={EmailAndPassword}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
