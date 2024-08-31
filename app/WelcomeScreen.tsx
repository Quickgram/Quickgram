import React, { useEffect } from "react";
import * as Appwrite from "react-native-appwrite";
import appwriteConfig from "../src/appwrite/AppwriteConfig";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Colors from "@/src/styles/Colors";
import welcomeImage from "../assets/images/icon.png";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type WelcomeScreenProps = NativeStackScreenProps<any, "WelcomeScreen">;
const welcome_image = Image.resolveAssetSource(welcomeImage).uri;
const client = new Appwrite.Client();
client
  .setEndpoint(appwriteConfig.config.endpoint)
  .setProject(appwriteConfig.config.project);
const account = new Appwrite.Account(client);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const deleteSession = async () => {
      await account.deleteSession("current");
    };
    deleteSession();
  }, []);

  const openPrivacyPolicy = () => {
    Linking.openURL("https://quickgram.in");
  };
  const openTermsOfService = () => {
    Linking.openURL("https://quickgram.in");
  };

  const handleAgreeAndContinue = async () => {
    navigation.navigate("VerifyPhoneScreen");
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: welcome_image }} style={styles.welcome} />
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
    padding: 20,
    backgroundColor: "#fff",
  },
  welcome: {
    width: "80%",
    height: 280,
    borderRadius: 60,
    marginBottom: 80,
  },
  headline: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 80,
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
    fontSize: 22,
    fontWeight: "500",
  },
});

export default WelcomeScreen;
