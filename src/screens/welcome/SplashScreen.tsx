import { Colors } from "@/src/styles/colors";
import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { wp, hp } from "@/src/styles/responsive";

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
    backgroundColor: Colors.background,
  },
  icon: {
    width: wp(50),
    height: wp(50),
  },
});

export default SplashScreen;
