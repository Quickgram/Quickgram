import React, { useEffect, useState } from "react";
import ChatUserBox from "./ChatUserBox";
import User from "../../../models/User";
import { FlashList } from "@shopify/flash-list";
import { getChatId } from "@/src/utils/getChatId";
import { chatApi } from "@/src/services/api/chatApi";
import { userApi } from "@/src/services/api/userApi";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
import { localUserDb } from "@/src/services/db/localUserDb";
import { localChatDb } from "@/src/services/db/localChatDb";
import {
  setCurrentChatUser,
  setCurrentChatId,
  setChatsData,
  setLastMessages,
  setChattedUsers,
} from "@/src/redux/reducers/chatReducer";
import Message from "@/src/models/Message";

const ChatUsersList = ({ navigation }: { navigation: any }) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const { homeScreenSearchQuery, hasInternetConnection } = useAppSelector(
    (state) => state.global
  );
  const { lastMessages, chattedUsers } = useAppSelector((state) => state.chat);
  const chattedUsersIds = currentUser?.chatted_users || [];
  const [filteredUsers, setFilteredUsers] = useState<Partial<User>[]>([]);

  useEffect(() => {
    const fetchChatsData = async () => {
      const chatsDataLocal = await localChatDb.getChatsData(chattedUsersIds);
      if (chatsDataLocal) {
        const lastMessagesLocal = [];
        for (const chat of chatsDataLocal) {
          const lastMessageLocal = await localChatDb.getLastMessageById(
            chat.lastMessageId!,
            chat.chatId!
          );
          if (lastMessageLocal) {
            console.log("lastmessage:", lastMessageLocal.text);
            lastMessagesLocal.push(lastMessageLocal);
          }
        }
        dispatch(setLastMessages(lastMessagesLocal));
        dispatch(setChatsData(chatsDataLocal));
      }

      if (hasInternetConnection) {
        const chatsDataApi = await chatApi.fetchChatsData(chattedUsersIds);
        if (chatsDataApi) {
          const lastMessagesApi = [];
          for (const chat of chatsDataApi) {
            const lastMessageApi = await chatApi.fetchLastMessageById(
              chat?.lastMessageId,
              chat?.chatId
            );
            if (lastMessageApi) {
              lastMessagesApi.push(lastMessageApi);
              await localChatDb.upsertMessages([lastMessageApi]);
            }
          }
          dispatch(setLastMessages(lastMessagesApi));
          dispatch(setChatsData(chatsDataApi));
          await localChatDb.upsertChatsData(chatsDataApi);
        }
      }
    };

    const fetchChattedUsers = async () => {
      const chattedUsersDataLocal = await localUserDb.getUserDataByIds(
        chattedUsersIds
      );

      if (chattedUsersDataLocal) {
        dispatch(setChattedUsers(chattedUsersDataLocal));
      }
      if (hasInternetConnection) {
        const chattedUsersDataApi =
          await userApi.fetchChattedUsersDocumentsByIds(chattedUsersIds);
        if (chattedUsersDataApi) {
          dispatch(setChattedUsers(chattedUsersDataApi));
          await localUserDb.upsertUsersData(chattedUsersDataApi);
        }
      }
    };

    fetchChatsData();
    fetchChattedUsers();
  }, [chattedUsersIds]);

  useEffect(() => {
    const filtered = chattedUsers
      .map((user: Partial<User>) => {
        const chatId = getChatId(currentUser?.uid, user.uid!);
        const lastMessage = lastMessages.find(
          (message: Partial<Message>) => message.chatId === chatId
        );
        return { user, lastMessage };
      })
      .filter(({ user }: { user: Partial<User> }) =>
        user.name?.toLowerCase().startsWith(homeScreenSearchQuery.toLowerCase())
      )
      .sort(
        (
          a: { lastMessage: Partial<Message> },
          b: { lastMessage: Partial<Message> }
        ) => {
          const timeA = Number(a.lastMessage?.sentTime) || 0;
          const timeB = Number(b.lastMessage?.sentTime) || 0;
          return timeB - timeA;
        }
      )
      .map(({ user }: { user: Partial<User> }) => user);

    setFilteredUsers(filtered);
  }, [homeScreenSearchQuery, chattedUsers, lastMessages]);

  const renderItem = ({ item }: { item: User }) => (
    <ChatUserBox
      user={item}
      chatId={getChatId(currentUser?.uid, item.uid)}
      onPress={() => {
        dispatch(setCurrentChatUser(item));
        dispatch(setCurrentChatId(getChatId(currentUser?.uid, item.uid)));
        navigation.navigate("Chat");
      }}
    />
  );

  return (
    <FlashList
      data={filteredUsers as User[]}
      keyExtractor={(item) => item.uid}
      renderItem={renderItem}
      estimatedItemSize={100}
    />
  );
};

export default React.memo(ChatUsersList);
