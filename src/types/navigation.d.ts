import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  Home: undefined;
  Status: undefined;
  Contacts: undefined;
  Settings: undefined;
};

export type AppStackParamList = {
  Welcome: undefined;
  VerifyPhone: undefined;
  VerifyOtp: undefined;
  CreateProfile: undefined;
  EmailAndPassword: undefined;
  Devices: undefined;
  MyProfile: undefined;
  Account: undefined;
  Announcements: undefined;
  SetEmailAndPassword: undefined;
  Chat: undefined;
  ChatUserProfile: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};
