import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppStackParamList, MainTabParamList } from "../../types/navigation";
import { wp, hp } from "@/src/styles/responsive";
import { Colors } from "@/src/styles/colors";

type StatusScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Status">,
  NativeStackScreenProps<AppStackParamList>
>;

const StatusScreen: React.FC<StatusScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>StatusScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: wp(2),
    paddingTop: hp(6),
    backgroundColor: Colors.background,
    gap: hp(2),
  },
});

export default StatusScreen;
