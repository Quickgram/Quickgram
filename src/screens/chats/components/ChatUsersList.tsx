import React, { useEffect, useState } from "react";
import ChatUserBox from "./ChatUserBox";
import User from "../../../models/User";
import { FlashList } from "@shopify/flash-list";
import Chat from "@/src/models/Chat";
import { getChatId } from "@/src/utils/getChatId";
import { chatApi } from "@/src/services/api/chatApi";
import { userApi } from "@/src/services/api/userApi";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
import {
  setCurrentChatUser,
  setCurrentChatId,
  setChatsData,
  setLastMessages,
} from "@/src/redux/reducers/chatReducer";

const ChatUsersList = ({ navigation }: { navigation: any }) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const chattedUsersIds = currentUser?.chatted_users || [];
  const [chattedUsers, setChattedUsers] = useState<Partial<User>[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Partial<User>[]>([]);
  const { homeScreenSearchQuery } = useAppSelector((state) => state.global);

  useEffect(() => {
    const fetchChatsData = async () => {
      const response = await chatApi.fetchChatsData(chattedUsersIds);
      if (response) {
        dispatch(setChatsData(response));
        for (const chat of response) {
          const lastMessage = await chatApi.fetchMessageById(
            chat.lastMessageId!
          );
          if (lastMessage) {
            dispatch(setLastMessages([lastMessage]));
          }
        }
      }
    };

    const fetchChattedUsers = async () => {
      const chattedUsersData = await userApi.fetchChattedUsersDocumentsByIds(
        chattedUsersIds
      );
      if (chattedUsersData) {
        setChattedUsers(chattedUsersData);
      }
    };

    fetchChatsData();
    fetchChattedUsers();
  }, []);

  useEffect(() => {
    const filtered = chattedUsers.filter((user) =>
      user.name?.toLowerCase().startsWith(homeScreenSearchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [homeScreenSearchQuery, chattedUsers]);

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
