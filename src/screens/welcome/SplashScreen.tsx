import colors from "@/src/styles/colors";
import React from "react";
import { StyleSheet, View, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SplashScreen = () => {
  const iconImage = require("../../../assets/images/icon.png");
  return (
    <View style={styles.container}>
      <Image source={iconImage} style={styles.icon} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  icon: {
    width: wp("50%"),
    height: wp("50%"),
  },
});

export default SplashScreen;
