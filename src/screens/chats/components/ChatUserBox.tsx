import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../../styles/colors";
import User from "../../../models/User";
import { Image } from "expo-image";
import { wp, hp } from "@/src/styles/responsive";
import Chat from "@/src/models/Chat";
import { chatApi } from "@/src/services/api/chatApi";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
import { setChatsData } from "@/src/redux/reducers/chatReducer";

import Message from "@/src/models/Message";
import { formatTimeForLastMessage } from "@/src/utils/timeConverter";
import Ionicons from "react-native-vector-icons/Ionicons";

const ChatUserBox = ({
  user,
  chatId,
  onPress,
}: {
  user: Partial<User>;
  chatId: string;
  onPress: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { currentChatId, chatsData, lastMessages } = useAppSelector(
    (state) => state.chat
  );
  const updateChatsData = (chatData: Chat) => {
    const updatedChatsData = chatsData.map((chat: Chat) =>
      chat.chatId === chatData.chatId ? chatData : chat
    );
    dispatch(setChatsData(updatedChatsData));
  };

  useEffect(() => {
    const unsubscribe = chatApi.subscribeToChatDataChanges(
      currentChatId,
      (updatedChatData) => {
        updateChatsData(updatedChatData);
      }
    );
    return () => unsubscribe();
  }, [currentChatId, updateChatsData]);

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

          {lastMessages.map((lastMessage: Message) =>
            lastMessage.chatId === chatId ? (
              <View
                key={lastMessage.chatId}
                style={styles.lastMessageContainer}
              >
                <Text style={styles.lastMessage}>{lastMessage.text}</Text>

                {lastMessage.is_seen ? (
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
                )}
              </View>
            ) : (
              <View
                key={`empty-${lastMessage.chatId}`}
                style={styles.lastMessageContainer}
              >
                <Text style={styles.lastMessage}> </Text>
              </View>
            )
          )}
        </View>
        <Text style={styles.dateText}>
          {lastMessages.map((lastMessage: Message) =>
            lastMessage.chatId === chatId
              ? formatTimeForLastMessage(lastMessage.sentTime)
              : ""
          )}
        </Text>
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
    color: Colors.gray,
  },
  dateText: {
    color: Colors.gray,
    paddingRight: wp(5),
    alignSelf: "flex-start",
  },
});

export default React.memo(ChatUserBox);
