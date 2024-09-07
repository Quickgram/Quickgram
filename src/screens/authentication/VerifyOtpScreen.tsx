import Colors from "@/src/styles/colors";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
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
import { apiServices } from "../../services/api/apiServices";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CommonActions } from "@react-navigation/native";
import { AppStackParamList } from "../../types/navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { showSnackbar } from "../../components/common/Snackbar";
import Entypo from "@expo/vector-icons/Entypo";

type VerifyOtpScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "VerifyOtpScreen"
>;

const CELL_COUNT = 6;
const RESEND_COOLDOWN = 30;

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({
  route,
  navigation,
}) => {
  const { userId, phoneNumber } = route.params;
  const [code, setCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const handleVerify = useCallback(async () => {
    try {
      await apiServices.createSession(userId, code);

      try {
        await apiServices.getUserDocumentByID(userId);

        await Promise.all([
          apiServices.updateUserOnline(userId),
          apiServices.setSignedStatus("true"),
        ]);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "MainTabs", params: { screen: "Home" } }],
          })
        );
      } catch (error) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "CreateProfileScreen",
                params: { userId: userId, phoneNumber: phoneNumber },
              },
            ],
          })
        );
      }
    } catch (error) {
      showSnackbar("Incorrect OTP. Please try again.");
    }
  }, [userId, phoneNumber, code, navigation]);

  useEffect(() => {
    if (code.length === CELL_COUNT) {
      handleVerify().catch((error) =>
        console.error("Error verifying OTP:", error)
      );
    }
  }, [code, handleVerify]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  const handleResendCode = useCallback(async () => {
    if (canResend) {
      try {
        await apiServices.createPhoneToken(userId, phoneNumber);
        setResendTimer(RESEND_COOLDOWN);
        setCanResend(false);
        showSnackbar("OTP resent successfully");
      } catch (error) {
        console.error("Error resending OTP:", error);
        showSnackbar("Failed to resend OTP. Please try again");
      }
    }
  }, [canResend]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={otpImage} style={styles.otpImage} resizeMode="contain" />
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
        {canResend ? (
          <TouchableOpacity style={styles.button} onPress={handleResendCode}>
            <Text style={styles.buttonText}>
              Didn't receive a verification code?
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.timerContainer}>
            <Entypo name="stopwatch" size={wp("4%")} color={Colors.darkGray} />
            <Text style={styles.timerText}>Resend code in {resendTimer}s</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: wp("5%"),
    paddingTop: hp("6%"),
    backgroundColor: Colors.background,
    gap: hp("2%"),
  },
  legal: {
    fontSize: wp("3%"),
    textAlign: "center",
    color: "#000",
  },
  button: {
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.primary,
    fontSize: wp("4.5%"),
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    color: Colors.darkGray,
    fontSize: wp("3%"),
    marginLeft: wp("1%"),
  },
  codeFieldRoot: {
    marginTop: hp("2%"),
    width: wp("65%"),
    marginLeft: "auto",
    marginRight: "auto",
    gap: wp("1%"),
  },
  otpImage: {
    alignSelf: "center",
    width: wp("70%"),
    height: hp("25%"),
    borderRadius: wp("15%"),
  },
  cellRoot: {
    width: wp("10%"),
    height: hp("5%"),
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: wp("9%"),
    textAlign: "center",
  },
  focusCell: {
    paddingBottom: hp("0.5%"),
    borderBottomColor: "#000",
    borderBottomWidth: 2,
  },
});

export default VerifyOtpScreen;
