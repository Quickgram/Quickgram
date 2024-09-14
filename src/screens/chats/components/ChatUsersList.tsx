import React from "react";
import ChatUserBox from "./ChatUserBox";
import User from "../../../models/user";
import { FlashList } from "@shopify/flash-list";
import Chat from "@/src/models/chat";
import { getChatId } from "@/src/utils/getChatId";

const ChatUsersList = ({
  currentUser,
  chattedUsers,
  setCurrentChatUser,
  setCurrentChatId,
  navigation,
}: {
  currentUser: User;
  chattedUsers: User[];
  setCurrentChatUser: (user: User) => void;
  navigation: any;
  setCurrentChatId: (chatId: string) => void;
}) => {
  const renderItem = ({ item }: { item: User }) => (
    <ChatUserBox
      user={item}
      onPress={() => {
        setCurrentChatUser(item);
        setCurrentChatId(getChatId(currentUser?.uid, item.uid));
        navigation.navigate("Chat");
      }}
    />
  );

  return (
    <FlashList
      data={chattedUsers}
      keyExtractor={(item) => item.uid}
      renderItem={renderItem}
      estimatedItemSize={100}
    />
  );
};

export default ChatUsersList;
