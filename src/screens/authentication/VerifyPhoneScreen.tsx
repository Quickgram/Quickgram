import Colors from "@/src/styles/colors";
import { useState, useCallback, useMemo } from "react";
import * as Appwrite from "../../config/appwrite";
import { apiServices } from "../../services/api/apiServices";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import MaskInput from "react-native-mask-input";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { showSnackbar } from "../../components/common/Snackbar";
import { AppStackParamList } from "../../types/navigation";
import { useAuth } from "../../contexts/AuthContext";

type VerifyPhoneScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "VerifyPhone"
>;

const VerifyPhoneScreen: React.FC<VerifyPhoneScreenProps> = ({
  navigation,
}) => {
  const phoneImage = require("../../../assets/images/phone.png");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { setUserId, setPhoneNumber: setAuthPhoneNumber } = useAuth();
  const IN_PHONE = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  const [loading, setLoading] = useState(false);
  const openLink = useCallback(() => {
    Linking.openURL("https://quickgram.in");
  }, []);

  const handlePhoneNumberChange = useCallback(
    (masked: string, unmasked: string) => {
      setPhoneNumber(masked);
      if (masked.length === 10) {
        Keyboard.dismiss();
      }
    },
    []
  );

  const handleNext = async () => {
    if (phoneNumber.length !== 10 || loading) return;

    setLoading(true);
    try {
      const { userId } = await apiServices.createPhoneToken(
        Appwrite.ID.unique(),
        `+91${phoneNumber}`
      );
      setUserId(userId);
      setAuthPhoneNumber(`+91${phoneNumber}`);
      setLoading(false);
      navigation.navigate("VerifyOtp");
    } catch (error) {
      showSnackbar("Failed to send OTP. Please try again.");
      setLoading(false);
    }
  };

  const handleEmailNext = () => {
    navigation.navigate("EmailAndPassword");
  };

  const isButtonEnabled = useMemo(
    () => phoneNumber.length === 10,
    [phoneNumber]
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          source={phoneImage}
          style={styles.phoneImage}
          resizeMode="contain"
        />
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
          <Text style={styles.emailButtonText}>Login with Email</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            styles.button,
            isButtonEnabled && styles.enabled,
            { marginBottom: 20, marginTop: 30 },
          ]}
          onPress={handleNext}
          disabled={!isButtonEnabled || loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text
              style={[styles.buttonText, isButtonEnabled && styles.enabled]}
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
  link: {
    color: Colors.primary,
  },
  button: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    padding: wp("2.5%"),
    borderRadius: wp("2.5%"),
  },
  enabled: {
    backgroundColor: Colors.primary,
    color: "#fff",
  },
  buttonText: {
    color: Colors.gray,
    fontSize: wp("5.5%"),
    fontWeight: "500",
  },
  list: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: wp("2.5%"),
    padding: wp("2.5%"),
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp("1.5%"),
    marginBottom: hp("1%"),
  },
  listItemText: {
    fontSize: wp("4.5%"),
    color: Colors.primary,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.gray,
    opacity: 0.2,
  },
  emailButton: {
    marginTop: hp("0.5%"),
    padding: wp("2.5%"),
    backgroundColor: Colors.secondary,
    alignItems: "center",
    borderRadius: wp("1.5%"),
  },
  emailButtonText: {
    color: "white",
    fontSize: wp("3%"),
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    fontSize: wp("4%"),
    padding: wp("1.5%"),
    marginTop: hp("1%"),
  },
  phoneImage: {
    alignSelf: "center",
    marginBottom: hp("2%"),
    width: wp("70%"),
    height: hp("25%"),
    borderRadius: wp("15%"),
  },
});

export default VerifyPhoneScreen;
