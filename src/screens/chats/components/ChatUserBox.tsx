import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../../styles/colors";
import User from "../../../models/User";
import { Image } from "expo-image";
import { wp, hp } from "@/src/styles/responsive";
import Chat from "@/src/models/Chat";
import { apiServices } from "@/src/services/api/apiServices";
import Message from "@/src/models/Message";

const ChatUserBox = ({
  user,
  chatId,
  chatData,
  onPress,
  updateChatsData,
}: {
  user: User;
  chatId: string;
  chatData?: Chat;
  onPress: () => void;
  updateChatsData: (chatData: Chat) => void;
}) => {
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  useEffect(() => {
    const unsubscribe = apiServices.subscribeToChatDataChanges(
      chatId,
      (updatedChatData) => {
        updateChatsData(updatedChatData as Chat);
      }
    );
    return () => unsubscribe();
  }, [chatId, updateChatsData]);

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
          <Text style={styles.lastMessage}>
            {chatData?.lastMessageId || ""}
          </Text>
        </View>
        <Text style={styles.dateText}>{lastMessage?.sentTime || ""}</Text>
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
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: wp(4.5),
  },
  lastMessage: {
    fontSize: wp(4),
    color: Colors.gray,
  },
  dateText: {
    color: Colors.gray,
    paddingRight: wp(5),
    alignSelf: "flex-start",
  },
});

export default React.memo(ChatUserBox);
