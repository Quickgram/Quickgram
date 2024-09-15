import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import Colors from "../../../styles/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import User from "@/src/models/user";

interface ChatUserProfileHeaderProps {
  navigation: any;
  currentChatUser: User;
}

const ChatUserProfileHeader: React.FC<ChatUserProfileHeaderProps> = ({
  navigation,
  currentChatUser,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={wp("9%")} color={Colors.primary} />
      </TouchableOpacity>
      <Image
        source={{
          uri: currentChatUser.profile_picture_url,
        }}
        placeholderContentFit="contain"
        cachePolicy="memory-disk"
        style={styles.profilePic}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{currentChatUser.name}</Text>
        <Text style={styles.userStatus}>
          {currentChatUser.is_online ? "Online" : "Offline"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    paddingTop: Platform.OS === "ios" ? hp("1%") : hp("5%"),
  },
  profilePic: {
    width: wp("11%"),
    height: wp("11%"),
    borderRadius: wp("6%"),
    marginHorizontal: wp("2%"),
  },
  userInfo: {
    flex: 1,
    paddingHorizontal: wp("2%"),
  },
  userName: {
    fontWeight: "bold",
    fontSize: wp("4.2%"),
  },
  userStatus: {
    fontSize: wp("3.2%"),
    color: Colors.gray,
  },
});

export default ChatUserProfileHeader;
