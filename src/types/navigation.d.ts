import { NavigatorScreenParams } from "@react-navigation/native";
import User from "@/src/model/User";

import WelcomeScreen from "./app/welcome/WelcomeScreen";
import VerifyPhoneScreen from "./app/authentication/VerifyPhoneScreen";
import VerifyOtpScreen from "./app/authentication/VerifyOtpScreen";
import CreateProfileScreen from "./app/authentication/CreateProfileScreen";
import EmailAndPassword from "./app/authentication/EmailAndPassword";
import HomeScreen from "./app/screens/HomeScreen";
import SplashScreen from "./app/welcome/SplashScreen";
import SettingScreen from "./app/screens/SettingScreen";
import StatusScreen from "./app/screens/StatusScreen";
import MyContactsScreen from "./app/screens/MyContactsScreen";

export type MainTabParamList = {
  Home: undefined;
  Status: undefined;
  Contacts: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  WelcomeScreen: undefined;
  VerifyPhoneScreen: undefined;
  VerifyOtpScreen: {
    userId: string;
    phoneNumber: string;
  };
  CreateProfileScreen: {
    userId: string;
    phoneNumber: string;
  };
  EmailAndPassword: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};
