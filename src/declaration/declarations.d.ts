declare module "*.jpg" {
  import { ImageSourcePropType } from "react-native";

  const content: ImageSourcePropType;

  export default content;
}

declare module "*.png" {
  import { ImageSourcePropType } from "react-native";

  const content: ImageSourcePropType;

  export default content;
}

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";

  const content: React.FC<SvgProps>;

  export default content;
}

declare module "react-native-vector-icons/SimpleLineIcons" {
  import { Icon } from "react-native-vector-icons/Icon";
  export default Icon;
}

declare module "react-native-vector-icons/Ionicons" {
  import { Icon } from "react-native-vector-icons/Icon";
  export default Icon;
}
