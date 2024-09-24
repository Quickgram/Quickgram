import { Colors } from "@/src/styles/colors";
import React from "react";
import { Animated, TextInput, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { wp, hp } from "@/src/styles/responsive";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
import { setHomeScreenSearchQuery } from "@/src/redux/reducers/globalReducer";

const SearchBox = () => {
  const dispatch = useAppDispatch();
  const { homeScreenSearchQuery } = useAppSelector((state) => state.global);

  return (
    <Animated.View style={[styles.container]}>
      <Ionicons name="search" size={wp(5)} style={styles.icon} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor={Colors.grey}
          value={homeScreenSearchQuery}
          onChangeText={(text) => dispatch(setHomeScreenSearchQuery(text))}
          numberOfLines={1}
          multiline={false}
          keyboardType="default"
          returnKeyType="done"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGrey,
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
    color: Colors.grey,
    marginRight: wp(2),
  },
});

export default React.memo(SearchBox);
