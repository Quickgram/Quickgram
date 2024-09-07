import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  RootStackParamList,
  MainTabParamList,
} from "../../src/types/navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/src/styles/colors";
import { Platform } from "react-native";

type MyContactsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Contacts">,
  NativeStackScreenProps<RootStackParamList>
>;

const MyContactsScreen: React.FC<MyContactsScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>MyContactsScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: wp("2%"),
    paddingTop: hp("6%"),
    backgroundColor: Colors.background,
    gap: hp("2%"),
  },
});

export default MyContactsScreen;
