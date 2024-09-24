import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/welcome/WelcomeScreen";
import VerifyPhoneScreen from "../screens/authentication/VerifyPhoneScreen";
import VerifyOtpScreen from "../screens/authentication/VerifyOtpScreen";
import CreateProfileScreen from "../screens/authentication/CreateProfileScreen";
import EmailAndPasswordScreen from "../screens/authentication/EmailAndPasswordScreen";
import MainTabs from "./MainTabs";
import { AppStackParamList } from "../types/navigation";
import SplashScreen from "../screens/welcome/SplashScreen";
import { Alert, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { wp } from "@/src/styles/responsive";
import MyProfileScreen from "../screens/settings/sub_screens/profile/MyProfileScreen";
import AccountScreen from "../screens/settings/sub_screens/account/AccountScreen";
import AnnouncementsScreen from "../screens/settings/sub_screens/announcements/AnnouncementsScreen";
import DevicesScreen from "../screens/settings/sub_screens/devices/DevicesScreen";
import SetEmailAndPasswordScreen from "../screens/settings/sub_screens/account/sub_screens/SetEmailAndPasswordScreen";
import ChatScreen from "../screens/chats/sub_screens/ChatScreen";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
import { checkAuthStatus } from "@/src/redux/actions/authActions";
import { initiateLogout } from "@/src/redux/actions/authActions";
import ChatUserProfile from "@/src/screens/chats/sub_screens/ChatUserProfileScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { currentUser } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(checkAuthStatus());
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="ChatUserProfile" component={ChatUserProfile} />
          <Stack.Screen
            name="MyProfile"
            component={MyProfileScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitleAlign: "center",
              headerTitle: currentUser?.name,
              headerStyle: {
                backgroundColor: Colors.background,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons
                    name="chevron-back"
                    size={wp(7)}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ),
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Logout?",
                      "Are you sure you want to logout?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => dispatch(initiateLogout()),
                          style: "destructive",
                        },
                      ],
                      { cancelable: true }
                    );
                  }}
                >
                  <Feather name="log-out" size={wp(7)} color={Colors.red} />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Devices"
            component={DevicesScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: Colors.background,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons
                    name="chevron-back"
                    size={wp(7)}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Account"
            component={AccountScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: Colors.background,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons
                    name="chevron-back"
                    size={wp(7)}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Announcements"
            component={AnnouncementsScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: Colors.background,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons
                    name="chevron-back"
                    size={wp(7)}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="SetEmailAndPassword"
            component={SetEmailAndPasswordScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: Colors.background,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons
                    name="chevron-back"
                    size={wp(7)}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              ),
            })}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="VerifyPhone" component={VerifyPhoneScreen} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
          <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
          <Stack.Screen
            name="EmailAndPassword"
            component={EmailAndPasswordScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
