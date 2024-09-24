import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppStackParamList, MainTabParamList } from "../../types/navigation";
import { wp, hp } from "@/src/styles/responsive";
import { Colors } from "@/src/styles/colors";

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
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
});

export default ContactsScreen;
