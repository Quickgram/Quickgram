import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Appwrite from "react-native-appwrite";
import appwriteConfig from "../../src/appwrite/AppwriteConfig";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import MaskInput from "react-native-mask-input";
import phoneImage from "../../assets/images/phone.png";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type VerifyPhoneScreenProps = NativeStackScreenProps<any, "VerifyPhoneScreen">;
const client = new Appwrite.Client();
client
  .setEndpoint(appwriteConfig.config.endpoint)
  .setProject(appwriteConfig.config.project);
const account = new Appwrite.Account(client);

const IN_PHONE = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

const VerifyPhoneScreen: React.FC<VerifyPhoneScreenProps> = ({
  navigation,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const openLink = () => {
    Linking.openURL("https://quickgram.in");
  };

  const handlePhoneNumberChange = (masked: string, unmasked: string) => {
    setPhoneNumber(masked);
    if (masked.length === 10) {
      Keyboard.dismiss();
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      const token = await account.createPhoneToken(
        Appwrite.ID.unique(),
        `+91${phoneNumber}`
      );
      const userId = token.userId;
      setLoading(false);
      navigation.navigate("VerifyOtpScreen", {
        sessionId: userId,
      });
    } catch (error) {
      setLoading(false);
      console.error("Failed to send OTP:");
    }
  };

  const handleEmailNext = async () => {
    navigation.navigate("EmailAndPassword");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={phoneImage} style={styles.logo}></Image>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>India</Text>
          </View>
          <View style={styles.separator} />
          <MaskInput
            value={phoneNumber}
            keyboardType="numeric"
            autoFocus
            placeholder="Phone Number"
            placeholderTextColor="#555"
            onChangeText={handlePhoneNumberChange}
            mask={IN_PHONE}
            style={styles.input}
          />
        </View>
        <Text style={styles.legal}>
          You must be{" "}
          <Text style={styles.link} onPress={openLink}>
            at least 16 years old
          </Text>{" "}
          to register. Learn how Quickgram{" "}
          <Text style={styles.link} onPress={openLink}>
            works.
          </Text>
        </Text>

        <TouchableOpacity style={styles.emailButton} onPress={handleEmailNext}>
          <Text style={styles.emailButtonText}>Continue with Email</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            styles.button,
            phoneNumber !== "" ? styles.enabled : null,
            { marginBottom: 20, marginTop: 30 },
          ]}
          onPress={handleNext}
        >
          <Text
            style={[
              styles.buttonText,
              phoneNumber !== "" ? styles.enabled : null,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    backgroundColor: Colors.background,
    gap: 20,
  },
  legal: {
    fontSize: 12,
    textAlign: "center",
    color: "#000",
  },
  link: {
    color: Colors.primary,
  },
  button: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    padding: 10,
    borderRadius: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
    color: "#fff",
  },
  buttonText: {
    color: Colors.gray,
    fontSize: 22,
    fontWeight: "500",
  },
  list: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 10,
    padding: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 6,
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 18,
    color: Colors.primary,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.gray,
    opacity: 0.2,
  },
  emailButton: {
    marginTop: 1,
    padding: 10,
    backgroundColor: "#007BFF",
    alignItems: "center",
    borderRadius: 6,
  },
  emailButtonText: {
    color: "white",
    fontSize: 12,
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    fontSize: 16,
    padding: 6,
    marginTop: 10,
  },
  logo: {
    alignSelf: "center",
    marginBottom: 20,
    width: "70%",
    height: 200,
    borderRadius: 60,
  },
  loading: {
    zIndex: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VerifyPhoneScreen;
