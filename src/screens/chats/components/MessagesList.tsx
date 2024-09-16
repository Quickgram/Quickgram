import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { apiServices } from "../../../services/api/apiServices";
import Message from "@/src/models/Message";
import User from "@/src/models/User";
import { localdbServices } from "@/src/services/db/localdbServices";
import * as Appwrite from "@/src/config/appwrite";
import { useGlobalState } from "@/src/contexts/GlobalStateContext";
import { ShowToast } from "@/src/components/common/ShowToast";
import { hp, wp } from "@/src/styles/responsive";
import { MessageBubble } from "./MessageBubble";
import { Colors } from "@/src/styles/colors";

interface MessagesListProps {
  currentChatUser: User;
  currentUser: User;
  chatId: string;
  bottomPadding: number;
}

const MessagesList: React.FC<MessagesListProps> = ({
  currentChatUser,
  currentUser,
  chatId,
  bottomPadding,
}) => {
  const [messages, setMessages] = useState<Partial<Message>[]>([]);
  const lastFetchedMessageId = useRef<string | null>(null);
  const subscription = useRef<any>(null);
  const { hasInternetConnection } = useGlobalState();
  const prevInternetConnection = useRef<boolean | null>(null);

  const shortingMessagesByTime = (messages: Partial<Message>[]) => {
    const messageMap = new Map<string, Partial<Message>>();
    messages.forEach((msg) => messageMap.set(msg.messageId!, msg));
    return Array.from(messageMap.values()).sort((a, b) =>
      b.sentTime! > a.sentTime! ? 1 : -1
    );
  };

  const fetchInitialMessages = async () => {
    const localMessages = await localdbServices.getMessagesFromLocaldbByChatId(
      chatId
    );
    const shortedLocalMessages = shortingMessagesByTime(localMessages);
    setMessages(shortedLocalMessages as Partial<Message>[]);

    const apiMessages = await apiServices.getInitialMessages(chatId);
    const mergedMessages = mergeMessages(localMessages, apiMessages);
    setMessages(mergedMessages);
    await localdbServices.saveMessagesInLocaldb(apiMessages);
    lastFetchedMessageId.current =
      apiMessages[apiMessages.length - 1]?.messageId ?? null;
  };

  const fetchNextMessages = async () => {
    console.log("fetchNextMessages");
    if (!lastFetchedMessageId.current) return;
    const nextMessages = await apiServices.getNextMessages(
      chatId,
      lastFetchedMessageId.current
    );
    console.log("nextMessages", nextMessages);
    setMessages((prevMessages) => mergeMessages(prevMessages, nextMessages));
    console.log("success");
    await localdbServices.saveMessagesInLocaldb(nextMessages);
    lastFetchedMessageId.current =
      nextMessages[nextMessages.length - 1]?.messageId ?? null;
  };

  const fetchMissedMessages = async () => {
    ShowToast("error", "fetchMissedMessages", "fetchMissedMessages");
    if (lastFetchedMessageId.current) {
      const missedMessages = await apiServices.getMessagesAfterMessageId(
        chatId,
        lastFetchedMessageId.current
      );
      console.log("missedMessages", missedMessages);
      setMessages((prevMessages) =>
        mergeMessages(prevMessages, missedMessages)
      );
      await localdbServices.saveMessagesInLocaldb(missedMessages);
      if (missedMessages.length > 0) {
        lastFetchedMessageId.current =
          missedMessages[missedMessages.length - 1]?.messageId ?? null;
      }
    }
  };

  const mergeMessages = (
    localMessages: Partial<Message>[],
    apiMessages: Partial<Message>[]
  ) => {
    const messageMap = new Map<string, Partial<Message>>();
    localMessages.forEach((msg) => messageMap.set(msg.messageId!, msg));
    apiMessages.forEach((msg) => messageMap.set(msg.messageId!, msg));
    return Array.from(messageMap.values()).sort((a, b) =>
      b.sentTime! > a.sentTime! ? 1 : -1
    );
  };

  const handleRealTimeUpdate = useCallback(
    async (event: any) => {
      const updatedMessage = event.payload;
      if (updatedMessage.chatId === chatId) {
        setMessages((prevMessages) => {
          const messageIndex = prevMessages.findIndex(
            (msg) => msg.messageId === updatedMessage.messageId
          );
          if (messageIndex >= 0) {
            const updatedMessages = [...prevMessages];
            updatedMessages[messageIndex] = updatedMessage;
            return updatedMessages;
          } else {
            return [updatedMessage, ...prevMessages];
          }
        });
        await localdbServices.saveMessagesInLocaldb([updatedMessage]);
      }
    },
    [chatId]
  );

  useEffect(() => {
    fetchInitialMessages();

    subscription.current = Appwrite.client.subscribe(
      `databases.${process.env.EXPO_PUBLIC_DATABASE_ID}.collections.${process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID}.documents`,
      (event) => handleRealTimeUpdate(event)
    );

    return () => {
      if (subscription.current) {
        subscription.current();
      }
    };
  }, [chatId, handleRealTimeUpdate]);

  useEffect(() => {
    if (prevInternetConnection.current === false && hasInternetConnection) {
      fetchMissedMessages();
    }
    prevInternetConnection.current = hasInternetConnection;
  }, [hasInternetConnection]);

  const renderItem = ({ item }: { item: Partial<Message> }) => (
    <MessageBubble message={item} currentUserId={currentUser.uid} />
  );

  return (
    <FlashList
      data={messages}
      renderItem={renderItem}
      keyExtractor={(item) => item.messageId || Math.random().toString()}
      estimatedItemSize={100}
      onEndReached={fetchNextMessages}
      onEndReachedThreshold={0.2}
      inverted
      contentContainerStyle={{
        paddingTop: bottomPadding,
        paddingHorizontal: wp("1%"),
      }}
    />
  );
};

export default React.memo(MessagesList);
