import {
  widthPercentageToDP as originalWp,
  heightPercentageToDP as originalHp,
} from "react-native-responsive-screen";

import { getScreenSizeCategory } from "../utils/getScreenSizeCategory";

const screenSizeAdjustments: { [key: string]: number } = {
  small: 1.2,
  regular: 1,
  large: 0.8,
};

export const wp = (percentage: number) => {
  if (typeof percentage !== "number" || isNaN(percentage)) {
    console.error("Invalid percentage value passed to wp:", percentage);
    return 0;
  }

  const screenSize = getScreenSizeCategory();
  const adjustmentFactor = screenSizeAdjustments[screenSize] || 1;
  return originalWp(percentage * adjustmentFactor);
};

export const hp = (percentage: number) => {
  if (typeof percentage !== "number" || isNaN(percentage)) {
    console.error("Invalid percentage value passed to hp:", percentage);
    return 0;
  }

  const screenSize = getScreenSizeCategory();
  const adjustmentFactor = screenSizeAdjustments[screenSize] || 1;
  return originalHp(percentage * adjustmentFactor);
};
