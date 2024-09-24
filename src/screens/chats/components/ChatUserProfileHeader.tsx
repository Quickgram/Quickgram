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
import { Colors } from "../../../styles/colors";
import { wp, hp } from "@/src/styles/responsive";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";

interface ChatUserProfileHeaderProps {
  navigation: any;
}

const ChatUserProfileHeader: React.FC<ChatUserProfileHeaderProps> = ({
  navigation,
}) => {
  const { currentChatroomUser } = useAppSelector((state) => state.chatroom);
  const { hasInternetConnection } = useAppSelector((state) => state.global);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={wp(9)} color={Colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ChatUserProfile");
        }}
      >
        <View style={styles.userInfoContainer}>
          <Image
            source={{
              uri: currentChatroomUser.profileAvatarUrl,
            }}
            placeholderContentFit="contain"
            cachePolicy="memory-disk"
            style={styles.profilePic}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentChatroomUser.name}</Text>
            {hasInternetConnection && (
              <Text style={styles.userStatus}>
                {currentChatroomUser.isOnline ? "Online" : "Offline"}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    paddingTop: Platform.OS === "ios" ? hp(0) : hp(5),
  },
  userInfoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(6),
    marginHorizontal: wp(2),
  },
  userInfo: {
    paddingHorizontal: wp(2),
  },
  userName: {
    fontWeight: "bold",
    fontSize: wp(4.2),
  },
  userStatus: {
    fontSize: wp(3.2),
    color: Colors.grey,
  },
});

export default ChatUserProfileHeader;
