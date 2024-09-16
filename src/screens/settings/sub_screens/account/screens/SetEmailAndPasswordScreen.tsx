import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/src/types/navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Colors } from "@/src/styles/colors";

type SetEmailAndPasswordProps = NativeStackScreenProps<
  AppStackParamList,
  "SetEmailAndPassword"
>;

const SetEmailAndPassword: React.FC<SetEmailAndPasswordProps> = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        overScrollMode="always"
        bounces={true}
      >
        <Text>SetEmailAndPassword</Text>
        {/* Add your content here */}
      </ScrollView>
    </View>
  );
};

export default SetEmailAndPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: wp("2%"),
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: hp("10%"),
    paddingHorizontal: wp("2.2%"),
  },
});
