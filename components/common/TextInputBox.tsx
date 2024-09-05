import { TextInput, TextInputProps } from "react-native";
import React from "react";
import Colors from "@/src/styles/colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const TextInputBox: React.FC<TextInputProps> = ({ style, ...otherProps }) => {
  return (
    <TextInput
      placeholderTextColor={Colors.darkGray}
      style={[
        {
          fontSize: wp("4%"),
          padding: wp("5%"),
          backgroundColor: Colors.white,
          borderRadius: wp("2.5%"),
          marginVertical: wp("2.5%"),
        },
        style,
      ]}
      {...otherProps}
    />
  );
};

export default TextInputBox;
