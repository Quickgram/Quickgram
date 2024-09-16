import { Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

//iPhone Screen Sizes
const isSmallScreenIOS = width < 360 && height < 640;
const isRegularScreenIOS =
  width >= 360 && width < 400 && height >= 640 && height < 900;
const isLargeScreenIOS = width >= 400 && height >= 900;

//Android Screen Sizes
const isSmallScreenAndroid = width < 360 || height < 640;
const isRegularScreenAndroid =
  width >= 360 && width <= 412 && height >= 640 && height <= 847;
const isLargeScreenAndroid = width > 412 || height > 847;

//Get Screen Size Category
export const getScreenSizeCategory = () => {
  if (Platform.OS === "ios") {
    if (isSmallScreenIOS) return "small";
    if (isRegularScreenIOS) return "regular";
    if (isLargeScreenIOS) return "large";
  } else if (Platform.OS === "android") {
    if (isSmallScreenAndroid) return "small";
    if (isRegularScreenAndroid) return "regular";
    if (isLargeScreenAndroid) return "large";
  }
  return "unknown";
};
