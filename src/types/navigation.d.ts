import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  Home: undefined;
  Status: undefined;
  Contacts: undefined;
  Settings: undefined;
};

export type AppStackParamList = {
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
