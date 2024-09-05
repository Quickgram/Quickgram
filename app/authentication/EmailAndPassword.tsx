import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CommonActions } from "@react-navigation/native";
import TextInputBox from "../../components/common/TextInputBox";
import Colors from "@/src/styles/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { apiServices } from "../../src/services/apiServices";
import { RootStackParamList } from "../../types/navigation";

type EmailAndPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "EmailAndPassword"
>;

const EmailAndPassword: React.FC<EmailAndPasswordProps> = ({ navigation }) => {
  const [email, setEmail] = useState("admin@quickgram.in");
  const [password, setPassword] = useState("admin@123");
  const [loading, setLoading] = useState(false);
  const phoneImage = require("../../assets/images/phone.png");

  const openLink = useCallback(() => {
    Linking.openURL("https://quickgram.in");
  }, []);

  const handleNext = useCallback(async () => {
    if (loading || !email || !password) return;

    setLoading(true);
    try {
      await apiServices.createEmailPasswordSession(email, password);
      await apiServices.setSignedStatus("true");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "MainTabs", params: { screen: "Home" } }],
        })
      );
    } catch (error) {
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
  }, [email, password, loading, navigation]);

  const isButtonEnabled = email !== "" && password !== "";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          source={phoneImage}
          style={styles.phoneImage}
          resizeMode="contain"
        />
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={wp("5%")}
              color={Colors.gray}
              style={styles.inputIcon}
            />
            <TextInputBox
              placeholder="Email"
              value={email}
              keyboardType="email-address"
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={wp("5%")}
              color={Colors.gray}
              style={styles.inputIcon}
            />
            <TextInputBox
              placeholder="Password"
              value={password}
              secureTextEntry
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
        </View>

        <TouchableOpacity
          style={[styles.button, isButtonEnabled && styles.enabled]}
          onPress={handleNext}
          disabled={!isButtonEnabled || loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text
              style={[styles.buttonText, isButtonEnabled && styles.enabledText]}
            >
              Next
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp("5%"),
    paddingTop: hp("6%"),
    backgroundColor: Colors.background,
  },
  inputContainer: {
    marginVertical: hp("3%"),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: wp("2.5%"),
    marginVertical: wp("1.5%"),
    height: hp("6%"),
  },
  inputIcon: {
    paddingLeft: wp("3%"),
  },
  input: {
    flex: 1,
    marginLeft: wp("2%"),
    height: "100%",
    paddingVertical: 0,
  },
  legal: {
    fontSize: wp("3%"),
    textAlign: "center",
    color: "#000",
    marginTop: hp("2%"),
  },
  link: {
    color: Colors.primary,
  },
  button: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    padding: wp("2.5%"),
    borderRadius: wp("2.5%"),
    marginTop: hp("3%"),
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: Colors.gray,
    fontSize: wp("5.5%"),
    fontWeight: "500",
  },
  enabledText: {
    color: "#fff",
  },
  phoneImage: {
    alignSelf: "center",
    marginBottom: hp("2%"),
    width: wp("70%"),
    height: hp("25%"),
    borderRadius: wp("15%"),
  },
});

export default EmailAndPassword;
