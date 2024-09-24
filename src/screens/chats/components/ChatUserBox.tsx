import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../../styles/colors";
import { Image } from "expo-image";
import { wp, hp } from "@/src/styles/responsive";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
import { formatTimeForLastMessage } from "@/src/utils/timeConverter";
import Ionicons from "react-native-vector-icons/Ionicons";
import ChattedUser from "@/src/models/ChattedUser";

const ChatUserBox = ({
  chattedUser,
  chatroomId,
  onPress,
}: {
  chattedUser: Partial<ChattedUser>;
  chatroomId: string;
  onPress: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const { myChatrooms, chattedUsers } = useAppSelector(
    (state) => state.chatroom
  );
  const { hasInternetConnection } = useAppSelector((state) => state.global);

  const onLongPress = () => {};

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.container}>
        <TouchableOpacity>
          <Image
            source={{
              uri: chattedUser.profileAvatarUrl,
            }}
            style={styles.profileImage}
            placeholderContentFit="contain"
            cachePolicy="memory-disk"
          />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{chattedUser.name}</Text>

          {chattedUser.lastMessage ? (
            <View style={styles.lastMessageContainer}>
              <Text style={styles.lastMessage}>{chattedUser.lastMessage}</Text>

              {chattedUser.lastMessageSenderId === currentUser?.userId &&
                (chattedUser.lastMessageIsSeen ? (
                  <Ionicons
                    name="checkmark-done-outline"
                    size={13}
                    color={Colors.primary}
                  />
                ) : (
                  <Ionicons
                    name="checkmark-outline"
                    size={13}
                    color={Colors.black}
                  />
                ))}
            </View>
          ) : (
            <View style={styles.lastMessageContainer}>
              <Text style={styles.lastMessage}> </Text>
            </View>
          )}
        </View>

        {chattedUser.lastMessage ? (
          <Text style={styles.dateText}>
            {formatTimeForLastMessage(chattedUser.lastMessageSentAt!)}
          </Text>
        ) : (
          <Text style={styles.dateText}></Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
    paddingLeft: wp(5),
    paddingVertical: hp(1.1),
  },
  profileImage: {
    width: wp(13.5),
    height: wp(13.5),
    borderRadius: wp(6.75),
  },
  lastMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: wp(4.5),
  },
  lastMessage: {
    fontSize: wp(4),
    color: Colors.grey,
  },
  dateText: {
    color: Colors.grey,
    paddingRight: wp(5),
    alignSelf: "flex-start",
  },
});

export default React.memo(ChatUserBox);
