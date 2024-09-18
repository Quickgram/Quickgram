import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/chats/HomeScreen";
import StatusScreen from "../screens/status/StatusScreen";
import ContactsScreen from "../screens/contacts/ContactsScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import BottomTabBar from "../components/navigation/BottomTabBar";
import { MainTabParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
