import { Colors } from "@/src/styles/colors";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../types/navigation";
import { wp, hp } from "@/src/styles/responsive";
import Entypo from "@expo/vector-icons/Entypo";
import { ShowToast } from "@/src/components/common/ShowToast";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
import { verifyOtp } from "@/src/redux/actions/authActions";
import { authApi } from "@/src/services/api/authApi";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";

type VerifyOtpScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "VerifyOtp"
>;

const CELL_COUNT = 6;
const RESEND_COOLDOWN = 30;

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({ navigation }) => {
  const otpImage = require("../../../assets/images/otp.png");
  const [code, setCode] = useState("");
  const dispatch = useAppDispatch();
  const { userId, phoneNumber, isAuthenticated, isNewUser } = useAppSelector(
    (state) => state.auth
  );
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      await dispatch(verifyOtp(code));
      setLoading(false);
      if (isNewUser && !isAuthenticated) {
        navigation.navigate("CreateProfile");
      }
    } catch (error) {
      setLoading(false);
    }
  };

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

  const isButtonEnabled = useMemo(() => code.length === CELL_COUNT, [code]);

  const handleResendCode = useCallback(async () => {
    if (canResend) {
      try {
        await authApi.createPhoneToken(userId!, phoneNumber!);
        setResendTimer(RESEND_COOLDOWN);
        setCanResend(false);
        ShowToast("info", "Success", "OTP resent successfully");
      } catch (error) {
        ShowToast("error", "Failed", "Failed to resend OTP");
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
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendCode}
          >
            <Text style={styles.resendButtonText}>
              Didn't receive a verification code?
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.timerContainer}>
            <Entypo name="stopwatch" size={wp(4)} color={Colors.darkGray} />
            <Text style={styles.timerText}>Resend code in {resendTimer}s</Text>
          </View>
        )}
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            styles.button,
            isButtonEnabled && styles.enabled,
            { marginBottom: 20, marginTop: 30 },
          ]}
          onPress={handleVerify}
          disabled={!isButtonEnabled || loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text
              style={[styles.buttonText, isButtonEnabled && styles.enabled]}
            >
              Verify
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
    alignItems: "center",
    padding: wp(5),
    paddingTop: hp(6),
    backgroundColor: Colors.background,
    gap: hp(2),
  },
  legal: {
    fontSize: wp(3),
    textAlign: "center",
    color: "#000",
  },
  resendButton: {
    width: "100%",
    alignItems: "center",
  },
  resendButtonText: {
    color: Colors.primary,
    fontSize: wp(4.5),
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    color: Colors.darkGray,
    fontSize: wp(3),
    marginLeft: wp(1),
  },
  codeFieldRoot: {
    marginTop: hp(2),
    width: wp(65),
    marginLeft: "auto",
    marginRight: "auto",
    gap: wp(1),
  },
  otpImage: {
    alignSelf: "center",
    width: wp(70),
    height: hp(25),
    borderRadius: wp(15),
  },
  cellRoot: {
    width: wp(10),
    height: hp(5),
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: wp(9),
    textAlign: "center",
  },
  focusCell: {
    paddingBottom: hp(0.5),
    borderBottomColor: "#000",
    borderBottomWidth: 2,
  },
  button: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    padding: wp(2.5),
    borderRadius: wp(2.5),
  },
  enabled: {
    backgroundColor: Colors.primary,
    color: "#fff",
  },
  buttonText: {
    color: Colors.gray,
    fontSize: wp(5.5),
    fontWeight: "500",
  },
});

export default VerifyOtpScreen;
