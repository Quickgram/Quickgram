import {
  widthPercentageToDP as originalWp,
  heightPercentageToDP as originalHp,
} from "react-native-responsive-screen";
import { getScreenSizeCategory } from "../utils/getScreenSizeCategory";

// Adjustments based on screen size
const screenSizeAdjustments: { [key: string]: number } = {
  small: 1.2, // Increase size by 20%
  regular: 1, // No change
  large: 0.8, // Decrease size by 20%
  unknown: 1, // Default no change
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
