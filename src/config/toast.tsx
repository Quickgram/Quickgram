import React from "react";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastProps,
} from "react-native-toast-message";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Colors } from "../styles/colors";

const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.primary, width: wp("90%") }}
      contentContainerStyle={{ paddingHorizontal: wp("4%") }}
      text1Style={{
        fontSize: wp("5%"),
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: wp("4%"),
      }}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{ width: wp("90%"), borderLeftColor: Colors.brightRed }}
      contentContainerStyle={{ paddingHorizontal: wp("4%") }}
      text1Style={{
        fontSize: wp("5%"),
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: wp("4%"),
      }}
    />
  ),
  info: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.darkGreen, width: wp("90%") }}
      contentContainerStyle={{ paddingHorizontal: wp("4%") }}
      text1Style={{
        fontSize: wp("5%"),
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: wp("4%"),
      }}
    />
  ),
};

const toastOptions = {
  topOffset: hp("7.2%"),
};

export { toastConfig, toastOptions };
