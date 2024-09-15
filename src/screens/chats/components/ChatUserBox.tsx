import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../../styles/colors";
import User from "../../../models/user";
import { Image } from "expo-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ChatUserBox = ({
  user,
  onPress,
}: {
  user: User;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image
          source={{
            uri: user.profile_picture_url,
          }}
          style={styles.profileImage}
          placeholderContentFit="contain"
          cachePolicy="memory-disk"
        />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.lastMessage}>This is the last message</Text>
        </View>
        <Text style={styles.dateText}>12/12/2024</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
    paddingLeft: wp("5%"),
    paddingVertical: hp("1.1%"),
  },
  profileImage: {
    width: wp("13.5%"),
    height: wp("13.5%"),
    borderRadius: wp("6.75%"),
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: wp("4.5%"),
  },
  lastMessage: {
    fontSize: wp("4%"),
    color: Colors.gray,
  },
  dateText: {
    color: Colors.gray,
    paddingRight: wp("5%"),
    alignSelf: "flex-start",
  },
});

export default ChatUserBox;
