import { Colors } from "@/src/styles/colors";
import React from "react";
import { Animated, TextInput, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalState } from "@/src/contexts/GlobalStateContext";
import { wp, hp } from "@/src/styles/responsive";

const SearchBox = () => {
  const { homeScreenSearchQuery, setHomeScreenSearchQuery } = useGlobalState();

  return (
    <Animated.View style={[styles.container]}>
      <Ionicons name="search" size={wp(5)} style={styles.icon} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor={Colors.gray}
          value={homeScreenSearchQuery}
          onChangeText={setHomeScreenSearchQuery}
          numberOfLines={1}
          multiline={false}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
    padding: wp(2),
    height: hp(5),
    marginHorizontal: wp(3),
    marginVertical: hp(1),
    borderRadius: wp(3),
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    overflow: "hidden",
  },
  input: {
    fontSize: wp(4),
    flex: 1,
    padding: 0,
  },
  icon: {
    color: Colors.gray,
    marginRight: wp(2),
  },
});

export default SearchBox;
