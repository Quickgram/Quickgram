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
import { setChattedUsers } from "@/src/redux/reducers/chatReducer";
import {
  setChatsData,
  setLastMessages,
} from "@/src/redux/reducers/chatReducer";
import Message from "@/src/models/Message";
import { formatTimeForLastMessage } from "@/src/utils/timeConverter";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  filterChatData,
  filterMessageData,
  filterUserData,
} from "@/src/utils/dataFilters";
import { localChatDb } from "@/src/services/db/localChatDb";
import { userApi } from "@/src/services/api/userApi";
import { localUserDb } from "@/src/services/db/localUserDb";

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
  const { currentUser } = useAppSelector((state) => state.user);
  const { chatsData, lastMessages, chattedUsers } = useAppSelector(
    (state) => state.chat
  );
  const { hasInternetConnection } = useAppSelector((state) => state.global);
  const [lastMessage, setLastMessage] = useState<Partial<Message> | null>(null);

  useEffect(() => {
    const lastMessage = lastMessages.find(
      (message: Partial<Message>) => message.chatId === chatId
    );
    if (lastMessage) {
      setLastMessage(lastMessage);
    }
  }, [chatId, lastMessages]);

  const updateChatData = async (updatedChatData: Partial<Chat>) => {
    dispatch(
      setChatsData(
        chatsData.map((chat: Partial<Chat>) =>
          chat.chatId === updatedChatData.chatId
            ? filterChatData(updatedChatData)
            : chat
        )
      )
    );

    const updatedLastMessage = await chatApi.fetchMessageById(
      updatedChatData.lastMessageId!
    );
    if (updatedLastMessage) {
      dispatch(
        setLastMessages(
          lastMessages.map((lastMessage: Partial<Message>) =>
            lastMessage.chatId === updatedLastMessage.chatId
              ? filterMessageData(updatedLastMessage)
              : lastMessage
          )
        )
      );
      await localChatDb.upsertMessages([updatedLastMessage]);
    }
    await localChatDb.upsertChatsData([updatedChatData]);
  };

  useEffect(() => {
    if (hasInternetConnection) {
      const unsubscribe = chatApi.subscribeToChatDataChanges(
        chatId,
        (updatedChatData) => {
          updateChatData(updatedChatData);
        }
      );
      return () => unsubscribe();
    }
  }, [chatId, updateChatData]);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (user?.uid) {
      unsubscribe = userApi.subscribeToUserDataChanges(
        user.uid,
        async (updatedChatUser) => {
          dispatch(
            setChattedUsers(
              chattedUsers.map((chatUser: Partial<User>) =>
                chatUser.uid === updatedChatUser.uid
                  ? filterUserData(updatedChatUser)
                  : chatUser
              )
            )
          );
          await localUserDb.upsertUserData(updatedChatUser);
        }
      );
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid]);

  const onLongPress = () => {};

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.container}>
        <TouchableOpacity>
          <Image
            source={{
              uri: user.profile_picture_url,
            }}
            style={styles.profileImage}
            placeholderContentFit="contain"
            cachePolicy="memory-disk"
          />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{user.name}</Text>

          {lastMessage ? (
            <View style={styles.lastMessageContainer}>
              <Text style={styles.lastMessage}>{lastMessage.text}</Text>

              {lastMessage.senderId === currentUser?.uid &&
                (lastMessage.is_seen ? (
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

        {lastMessage ? (
          <Text style={styles.dateText}>
            {formatTimeForLastMessage(lastMessage.sentTime!)}
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
    color: Colors.gray,
  },
  dateText: {
    color: Colors.gray,
    paddingRight: wp(5),
    alignSelf: "flex-start",
  },
});

export default React.memo(ChatUserBox);
