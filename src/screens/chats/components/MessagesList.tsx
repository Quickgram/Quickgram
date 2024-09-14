import React, { useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { apiServices } from "../../../services/api/apiServices";
import Message from "@/src/models/message";
import User from "@/src/models/user";
import Chat from "@/src/models/chat";
import { localdbServices } from "@/src/services/db/localdbServices";

interface MessagesListProps {
  currentChatUser: User;
  currentUser: User;
  chatId: string;
}

const MessagesList: React.FC<MessagesListProps> = ({
  currentChatUser,
  currentUser,
  chatId,
}) => {
  const [messages, setMessages] = useState<Partial<Message>[]>([]);
  const [currentChat, setCurrentChat] = useState<Partial<Chat> | null>(null);
  const addNewMessage = useCallback((newMessage: Partial<Message>) => {
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const fetchInitialData = async () => {
      const chat = await apiServices.getChatDocumentById(chatId);
      if (chat) {
        setCurrentChat(chat);
        const fetchedMessages = await apiServices.getMessages(
          chat.messageIds || []
        );
        if (fetchedMessages) {
          setMessages(fetchedMessages);
        }
      }
    };

    fetchInitialData();

    if (chatId) {
      unsubscribe = apiServices.subscribeToChatDataChanges(
        chatId,
        async (updatedChat) => {
          setCurrentChat(updatedChat);
          const lastMessageId = updatedChat.lastMessageId;
          if (lastMessageId) {
            const newMessage = await apiServices.getMessageByID(lastMessageId);
            if (newMessage) {
              addNewMessage(newMessage);
            }
          }
        }
      );
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [chatId, addNewMessage]);

  const renderItem = ({ item }: { item: Partial<Message> }) => (
    <View style={styles.item}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <FlashList
      data={messages}
      renderItem={renderItem}
      keyExtractor={(item) => item.messageId || Math.random().toString()}
      estimatedItemSize={100}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 50,
  },
  item: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default React.memo(MessagesList);
