import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppStackParamList, MainTabParamList } from "../../types/navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/src/styles/colors";

type ContactsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Contacts">,
  NativeStackScreenProps<AppStackParamList>
>;

const ContactsScreen: React.FC<ContactsScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>ContactsScreen</Text>
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

export default ContactsScreen;
