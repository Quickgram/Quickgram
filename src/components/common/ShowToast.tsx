import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

export const ShowToast = (type: ToastType, header: string, text: string) => {
  Toast.show({
    type: type,
    text1: header,
    text2: text,
  });
};
