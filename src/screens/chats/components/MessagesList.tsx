import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { apiServices } from "../../../services/api/apiServices";
import Message from "@/src/models/message";
import User from "@/src/models/user";
import Chat from "@/src/models/chat";
import { localdbServices } from "@/src/services/db/localdbServices";
import * as Appwrite from "@/src/config/appwrite";

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
  const lastFetchedMessageId = useRef<string | null>(null);
  const subscription = useRef<any>(null);

  const fetchInitialMessages = async () => {
    const initialMessages = await apiServices.getInitialMessages(chatId);
    setMessages(initialMessages as Partial<Message>[]);
    lastFetchedMessageId.current =
      initialMessages[initialMessages.length - 1]?.messageId;
  };

  const fetchNextMessages = async () => {
    if (!lastFetchedMessageId.current) return;
    const nextMessages = await apiServices.getNextMessages(
      chatId,
      lastFetchedMessageId.current
    );
    setMessages((prevMessages) => [
      ...(prevMessages as Partial<Message>[]),
      ...(nextMessages as Partial<Message>[]),
    ]);

    lastFetchedMessageId.current =
      nextMessages[nextMessages.length - 1]?.messageId;
  };

  // Handle real-time updates
  const handleRealTimeUpdate = useCallback(
    (event: any) => {
      const updatedMessage = event.payload;
      // Check if the update pertains to the specific chatId
      if (updatedMessage.chatId === chatId) {
        setMessages((prevMessages) => {
          // Check if message exists and update or add
          const messageIndex = prevMessages.findIndex(
            (msg) => msg.messageId === updatedMessage.messageId
          );
          if (messageIndex >= 0) {
            // Update existing message
            const updatedMessages = [...prevMessages];
            updatedMessages[messageIndex] = updatedMessage;
            return updatedMessages;
          } else {
            // Add new message
            return [updatedMessage, ...prevMessages];
          }
        });
      }
    },
    [chatId]
  );

  useEffect(() => {
    fetchInitialMessages();

    // Subscribe to the entire messages collection
    subscription.current = Appwrite.client.subscribe(
      `databases.${process.env.EXPO_PUBLIC_DATABASE_ID}.collections.${process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID}.documents`,
      (event) => handleRealTimeUpdate(event)
    );

    return () => {
      // Unsubscribe on unmount
      if (subscription.current) {
        subscription.current();
      }
    };
  }, [chatId, handleRealTimeUpdate]);

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
      onEndReached={fetchNextMessages}
      onEndReachedThreshold={0.2}
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
