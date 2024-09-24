import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/styles/colors";
import BoxedIcon from "@/src/components/common/BoxedIcon";
import { wp, hp } from "@/src/styles/responsive";

interface SettingItemProps {
  name: string;
  icon: string;
  backgroundColor: string;
  onPress: (item: any) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  name,
  icon,
  backgroundColor,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(name)}>
      <BoxedIcon name={icon} backgroundColor={backgroundColor} />
      <Text style={styles.itemText}>{name}</Text>
      <Ionicons name="chevron-forward" size={wp(5)} color={Colors.grey} />
    </TouchableOpacity>
  );
};

export const profile = [
  {
    name: "My Profile",
    icon: "person-outline",
    backgroundColor: Colors.red,
  },
];

export const subItems = [
  {
    name: "Announcements",
    icon: "megaphone-outline",
    backgroundColor: Colors.blue,
  },
  {
    name: "Devices",
    icon: "phone-portrait-outline",
    backgroundColor: Colors.brightYellow,
  },
];

export const mainItems = [
  {
    name: "Account",
    icon: "key-outline",
    backgroundColor: Colors.primary,
  },
  {
    name: "Privacy & Security",
    icon: "lock-closed-outline",
    backgroundColor: "#33A5D1",
  },
  {
    name: "Chats",
    icon: "chatbubbles-outline",
    backgroundColor: Colors.lightNavy,
  },
  {
    name: "Notifications",
    icon: "notifications-outline",
    backgroundColor: Colors.red,
  },
  {
    name: "Storage",
    icon: "cloud-outline",
    backgroundColor: Colors.lightMaroon,
  },
];

export const support = [
  {
    name: "Help",
    icon: "information-circle-outline",
    backgroundColor: Colors.primary,
  },
  {
    name: "Invite",
    icon: "person-add-outline",
    backgroundColor: Colors.lightNavy,
  },
];

export const renderSettingItems = (
  items: Array<{ name: string; icon: string; backgroundColor: string }>,
  onPress: (item: any) => void
) => (
  <View style={styles.block}>
    {items.map((item, index) => (
      <React.Fragment key={item.name}>
        <SettingItem
          name={item.name}
          icon={item.icon}
          backgroundColor={item.backgroundColor}
          onPress={onPress}
        />
        {index < items.length - 1 && <View style={styles.separator} />}
      </React.Fragment>
    ))}
  </View>
);

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(2.5),
    gap: wp(2.7),
  },
  itemText: {
    fontSize: wp(4.1),
    flex: 1,
  },
  block: {
    backgroundColor: "#fff",
    borderRadius: wp(2.5),
    marginHorizontal: wp(3.4),
    marginTop: hp(2.5),
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.lightGrey,
    marginLeft: wp(12.5),
  },
});

export default SettingItem;
