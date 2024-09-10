import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Colors from "@/src/styles/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Appwrite from "../../config/appwrite";
import { AppStackParamList } from "../../types/navigation";
import { apiServices } from "@/src/services/api/apiServices";

type WelcomeScreenProps = NativeStackScreenProps<AppStackParamList, "Welcome">;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const welcome_image = require("../../../assets/images/icon.png");

  const openPrivacyPolicy = useCallback(() => {
    Linking.openURL("https://quickgram.in");
  }, []);

  const openTermsOfService = useCallback(() => {
    Linking.openURL("https://quickgram.in");
  }, []);

  const handleAgreeAndContinue = useCallback(async () => {
    navigation.navigate("VerifyPhone");
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={welcome_image}
        style={styles.welcomeImage}
        resizeMode="contain"
      />
      <Text style={styles.headline}>Welcome to Quickgram</Text>
      <Text style={styles.description}>
        Read our{" "}
        <Text style={styles.link} onPress={openPrivacyPolicy}>
          Privacy Policy
        </Text>
        . {'Tap "Agree & Continue" to accept the '}
        <Text style={styles.link} onPress={openTermsOfService}>
          Terms of Service
        </Text>
        .
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleAgreeAndContinue}>
        <Text style={styles.buttonText}>Agree & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp("5%"),
    backgroundColor: "#fff",
  },
  welcomeImage: {
    width: wp("80%"),
    height: hp("35%"),
    borderRadius: wp("15%"),
    marginBottom: hp("10%"),
  },
  headline: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    marginVertical: hp("2%"),
  },
  description: {
    fontSize: wp("3.5%"),
    textAlign: "center",
    marginBottom: hp("10%"),
    color: Colors.gray,
  },
  link: {
    color: Colors.primary,
  },
  button: {
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.primary,
    fontSize: wp("5.5%"),
    fontWeight: "500",
  },
});

export default WelcomeScreen;
