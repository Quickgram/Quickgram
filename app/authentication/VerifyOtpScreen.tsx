import Colors from "@/src/styles/Colors";
import { useEffect, useState } from "react";
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
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import otpImage from "../../assets/images/otp.png";
import * as Appwrite from "react-native-appwrite";
import appwriteConfig from "../../src/appwrite/AppwriteConfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type VerifyOtpScreenRouteParams = {
  userId: string;
  phoneNumber: string;
};

type VerifyOtpScreenProps = NativeStackScreenProps<any, "VerifyOtpScreen"> & {
  route: {
    params: VerifyOtpScreenRouteParams;
  };
};

const client = new Appwrite.Client();
client
  .setEndpoint(appwriteConfig.config.endpoint)
  .setProject(appwriteConfig.config.project);
const account = new Appwrite.Account(client);
const CELL_COUNT = 6;

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({
  route,
  navigation,
}) => {
  const { userId } = route.params;
  const { phoneNumber } = route.params;
  const [code, setCode] = useState("");

  const handleVerify = async () => {
    try {
      await account.createSession(userId, code);
      navigation.navigate("NewUserScreen", {
        userId: userId,
        phoneNumber: phoneNumber,
      });
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    }
  };

  useEffect(() => {
    if (code.length === CELL_COUNT) {
      handleVerify();
    }
  }, [code]);

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={otpImage} style={styles.logo} />
        <Text style={styles.legal}>
          To complete your phone number verification, please enter the 6-digit
          activation code.
        </Text>
        <CodeField
          ref={ref}
          {...props}
          value={code}
          onChangeText={setCode}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Didn't receive a verification code?
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
    fontSize: 10,
    textAlign: "center",
    color: "#000",
  },
  button: {
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 18,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: 260,
    marginLeft: "auto",
    marginRight: "auto",
    gap: 4,
  },
  logo: {
    alignSelf: "center",
    width: "70%",
    height: 200,
    borderRadius: 60,
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    paddingBottom: 4,
    borderBottomColor: "#000",
    borderBottomWidth: 2,
  },
});

export default VerifyOtpScreen;
