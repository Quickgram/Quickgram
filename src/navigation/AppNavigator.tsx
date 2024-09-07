import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import WelcomeScreen from "../screens/welcome/WelcomeScreen";
import VerifyPhoneScreen from "../screens/authentication/VerifyPhoneScreen";
import VerifyOtpScreen from "../screens/authentication/VerifyOtpScreen";
import CreateProfileScreen from "../screens/authentication/CreateProfileScreen";
import EmailAndPassword from "../screens/authentication/EmailAndPassword";
import MainTabs from "./MainTabs";
import { AppStackParamList } from "../types/navigation";
import SplashScreen from "../screens/welcome/SplashScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="VerifyPhone" component={VerifyPhoneScreen} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
          <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
          <Stack.Screen name="EmailAndPassword" component={EmailAndPassword} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
