import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useCallback, useMemo } from "react";
import Colors from "@/src/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface BottomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const icons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  Home: "chatbubbles-outline",
  Status: "logo-web-component",
  Contacts: "people-outline",
  Settings: "settings-outline",
};

const BottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const renderIcon = useCallback(
    (routeName: string, color: string) => (
      <Ionicons name={icons[routeName]} size={wp("6%")} color={color} />
    ),
    []
  );

  const tabBarItems = useMemo(
    () =>
      state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
          >
            {renderIcon(route.name, isFocused ? Colors.primary : Colors.gray)}
            <Text
              style={{
                color: isFocused ? Colors.primary : Colors.gray,
                fontSize: wp("2.75%"),
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      }),
    [state, descriptors, navigation, renderIcon]
  );

  return <View style={styles.tabbar}>{tabBarItems}</View>;
};

export default BottomTabBar;

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: hp("3%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    borderRadius: wp("6%"),
    borderCurve: "continuous",
    shadowColor: "black",
    shadowOffset: { width: 0, height: hp("1.25%") },
    shadowRadius: wp("2.5%"),
    shadowOpacity: 0.1,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
