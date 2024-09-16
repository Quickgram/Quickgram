import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/src/styles/colors";
import BoxedIcon from "../common/BoxedIcon";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";

interface AccountSettingItemProps {
  name: string;
  icon: string;
  backgroundColor: string;
  onPress: (item: any) => void;
}

const AccountSettingItem: React.FC<AccountSettingItemProps> = ({
  name,
  icon,
  backgroundColor,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(name)}>
      <BoxedIcon name={icon} backgroundColor={backgroundColor} />
      <Text style={styles.itemText}>{name}</Text>
      <Ionicons name="chevron-forward" size={wp("5%")} color={Colors.gray} />
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

export const mainItems = [
  {
    name: "Email & Password",
    icon: "mail-outline",
    backgroundColor: Colors.brightYellow,
  },
  {
    name: "Change Number",
    icon: "call-outline",
    backgroundColor: Colors.lightNavy,
  },
];

export const subItems = [
  {
    name: "Request Account Info",
    icon: "information-circle-outline",
    backgroundColor: Colors.navy,
  },
  {
    name: "Delete My Account",
    icon: "trash-outline",
    backgroundColor: Colors.red,
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

export const renderAccountSettingItems = (
  items: Array<{ name: string; icon: string; backgroundColor: string }>,
  onPress: (item: any) => void
) => (
  <View style={styles.block}>
    {items.map((item, index) => (
      <React.Fragment key={item.name}>
        <AccountSettingItem
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
    padding: wp("2.5%"),
    gap: wp("2.7%"),
  },
  itemText: {
    fontSize: wp("4.1%"),
    flex: 1,
  },
  block: {
    backgroundColor: "#fff",
    borderRadius: wp("2.5%"),
    marginHorizontal: wp("3.4%"),
    marginTop: hp("2.5%"),
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.lightGray,
    marginLeft: wp("12.5%"),
  },
});

export default AccountSettingItem;
