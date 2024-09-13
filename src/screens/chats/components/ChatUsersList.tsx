import React from "react";
import { FlatList } from "react-native";
import ChatUserBox from "./ChatUserBox";
import User from "../../../models/user";

const ChatUsersList = ({
  chattedUsers,
  setCurrentChatUser,
  navigation,
}: {
  chattedUsers: User[];
  setCurrentChatUser: (user: User) => void;
  navigation: any;
}) => {
  const renderItem = ({ item }: { item: User }) => (
    <ChatUserBox
      user={item}
      onPress={() => {
        setCurrentChatUser(item);
        navigation.navigate("Chat");
      }}
    />
  );

  return (
    <FlatList
      data={chattedUsers}
      keyExtractor={(item) => item.uid}
      renderItem={renderItem}
    />
  );
};

export default ChatUsersList;
