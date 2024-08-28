import Colors from "@/src/styles/Colors";
import { useState } from "react";
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
import * as Appwrite from "react-native-appwrite";
import appwriteConfig from "../../src/appwrite/AppwriteConfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type EmailAndPasswordProps = NativeStackScreenProps<any, "EmailAndPassword">;
const client = new Appwrite.Client();
client
  .setEndpoint(appwriteConfig.config.endpoint)
  .setProject(appwriteConfig.config.project);
const account = new Appwrite.Account(client);

const EmailAndPassword: React.FC<EmailAndPasswordProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const openLink = () => {
    Linking.openURL("https://quickgram.in");
  };

  const handleNext = async () => {
    try {
      const token = account.createEmailPasswordSession(email, password);
      setLoading(false);
      token.then(function (response) {
        navigation.navigate("NewUserScreen", {
          userId: "66ceafe3002c3d46c2d7",
          phoneNumber: "+911000010000",
        });
      });
    } catch (error) {
      setLoading(false);
      console.error("Login Failed");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={phoneImage} style={styles.logo} />
        <View style={styles.list}>
          <MaskInput
            value={email}
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="#555"
            onChangeText={setEmail}
            style={styles.input}
          />
          <View style={styles.separator} />
          <MaskInput
            value={password}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#555"
            onChangeText={setPassword}
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
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            styles.button,
            email !== "" && password !== "" ? styles.enabled : null,
            { marginBottom: 20, marginTop: 30 },
          ]}
          onPress={handleNext}
          disabled={email === "" || password === ""}
        >
          <Text
            style={[
              styles.buttonText,
              email !== "" && password !== "" ? styles.enabled : null,
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
  input: {
    backgroundColor: "#fff",
    width: "100%",
    fontSize: 17,
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

export default EmailAndPassword;
