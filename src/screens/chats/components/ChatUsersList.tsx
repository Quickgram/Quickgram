import React, { useEffect, useState } from "react";
import ChatUserBox from "./ChatUserBox";
import User from "../../../models/User";
import { FlashList } from "@shopify/flash-list";
import Chat from "@/src/models/Chat";
import { getChatId } from "@/src/utils/getChatId";
import { useGlobalState } from "@/src/contexts/GlobalStateContext";
import { apiServices } from "@/src/services/api/apiServices";

const ChatUsersList = ({
  currentUser,
  navigation,
}: {
  currentUser: User;
  navigation: any;
}) => {
  const { setCurrentChatUser, setCurrentChatId, homeScreenSearchQuery } =
    useGlobalState();
  const [chattedUsers, setChattedUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const chattedUsersIds = currentUser?.chatted_users || [];
  const [chatsData, setChatsData] = useState<Chat[]>([]);

  const updateChatsData = (chatData: Chat) => {
    setChatsData((prevChatsData) => {
      const updatedChatsData = prevChatsData.map((chat) =>
        chat.chatId === chatData.chatId ? chatData : chat
      );
      console.log("updatedChatsData", updatedChatsData);
      return updatedChatsData;
    });
  };

  useEffect(() => {
    const fetchChatsData = async () => {
      const response = await apiServices.getChatsData(
        currentUser.uid,
        chattedUsersIds
      );
      if (response) {
        setChatsData(response as Chat[]);
      }
    };

    const fetchChattedUsers = async () => {
      const chattedUsersData = await apiServices.getChattedUsers(
        chattedUsersIds
      );
      setChattedUsers(chattedUsersData as User[]);
    };

    fetchChatsData();
    fetchChattedUsers();
  }, []);

  useEffect(() => {
    const filtered = chattedUsers.filter((user) =>
      user.name.toLowerCase().startsWith(homeScreenSearchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [homeScreenSearchQuery, chattedUsers]);

  const renderItem = ({ item }: { item: User }) => (
    <ChatUserBox
      user={item}
      chatId={getChatId(currentUser?.uid, item.uid)}
      chatData={chatsData.find(
        (chat) => chat.chatId === getChatId(currentUser?.uid, item.uid)
      )}
      onPress={() => {
        setCurrentChatUser(item);
        setCurrentChatId(getChatId(currentUser?.uid, item.uid));
        navigation.navigate("Chat");
      }}
      updateChatsData={updateChatsData}
    />
  );

  return (
    <FlashList
      data={filteredUsers}
      keyExtractor={(item) => item.uid}
      renderItem={renderItem}
      estimatedItemSize={100}
    />
  );
};

export default React.memo(ChatUsersList);
