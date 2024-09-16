import {
  widthPercentageToDP as originalWp,
  heightPercentageToDP as originalHp,
} from "react-native-responsive-screen";
import { getScreenSizeCategory } from "../utils/getScreenSizeCategory";

const screenSizeAdjustments: { [key: string]: number } = {
  small: 1.2,
  regular: 1,
  large: 0.8,
  unknown: 1,
};

export const wp = (percentage: number) => {
  const screenSize = getScreenSizeCategory();
  const adjustmentFactor = screenSizeAdjustments[screenSize];
  return originalWp(percentage * adjustmentFactor);
};

export const hp = (percentage: number) => {
  const screenSize = getScreenSizeCategory();
  const adjustmentFactor = screenSizeAdjustments[screenSize];
  return originalHp(percentage * adjustmentFactor);
};
