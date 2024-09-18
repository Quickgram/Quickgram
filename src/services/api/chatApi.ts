import * as Appwrite from "../../config/appwrite";
import { Models } from "../../config/appwrite";
import { filterMessageData, filterChatData } from "../../utils/dataFilters";
import { secureStorageService } from "../storage/secureStore";
import Message from "@/src/models/Message";
import Chat from "@/src/models/Chat";
import { getChatId } from "@/src/utils/getChatId";

export const chatApi = {
  upsertChatDocument: async (chatId: string, messageData: Partial<Message>) => {
    try {
      const chatDoc = await Appwrite.databases.getDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_CHATS_COLLECTION_ID!,
        chatId
      );
      if (chatDoc) {
        await Appwrite.databases.updateDocument(
          process.env.EXPO_PUBLIC_DATABASE_ID!,
          process.env.EXPO_PUBLIC_CHATS_COLLECTION_ID!,
          chatId,
          {
            lastMessageId: messageData.messageId,
          }
        );
      }
    } catch (error) {
      await Appwrite.databases.createDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_CHATS_COLLECTION_ID!,
        chatId,
        {
          chatId: chatId,
          lastMessageId: messageData.messageId,
        }
      );
    }
  },

  sendTextMessage: async (messageData: Partial<Message>) => {
    await Appwrite.databases.createDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
      messageData.messageId!,
      messageData
    );
    await chatApi.upsertChatDocument(messageData.chatId!, messageData);
  },

  fetchInitialMessages: async (chatId: string): Promise<Partial<Message>[]> => {
    const response = await Appwrite.databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
      [
        Appwrite.Query.equal("chatId", chatId),
        Appwrite.Query.orderDesc("sentTime"),
        Appwrite.Query.limit(25),
      ]
    );
    if (response.documents.length === 0) {
      return [];
    }
    const messages = response.documents as Partial<Message>[];
    return messages.map((message) => filterMessageData(message));
  },

  fetchMoreMessages: async (
    chatId: string,
    lastFetchedMessageId: string
  ): Promise<Partial<Message>[]> => {
    const response = await Appwrite.databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
      [
        Appwrite.Query.equal("chatId", chatId),
        Appwrite.Query.orderDesc("sentTime"),
        Appwrite.Query.cursorAfter(lastFetchedMessageId),
        Appwrite.Query.limit(25),
      ]
    );
    if (response.documents.length === 0) {
      return [];
    }
    const messages = response.documents as Partial<Message>[];
    return messages.map((message) => filterMessageData(message));
  },

  fetchMessagesAfterLastFetchedMessageId: async (
    chatId: string,
    lastFetchedMessageId: string
  ): Promise<Partial<Message>[]> => {
    const response = await Appwrite.databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
      [
        Appwrite.Query.equal("chatId", chatId),
        Appwrite.Query.orderAsc("sentTime"),
        Appwrite.Query.cursorAfter(lastFetchedMessageId),
        Appwrite.Query.limit(25),
      ]
    );
    if (response.documents.length === 0) {
      return [];
    }
    const messages = response.documents as Partial<Message>[];
    return messages.map((message) => filterMessageData(message));
  },

  fetchChatsData: async (
    chattedUsersIds: string[]
  ): Promise<Partial<Chat>[]> => {
    const currentUserId = await secureStorageService.getCurrentUserId();
    const chatsData = [];
    for (const userId of chattedUsersIds) {
      const chat = (await Appwrite.databases.getDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_CHATS_COLLECTION_ID!,
        getChatId(currentUserId!, userId)
      )) as Models.Document;
      if (chat) {
        chatsData.push(filterChatData(chat));
      }
    }
    return chatsData;
  },

  fetchChatDataById: async (chatId: string): Promise<Partial<Chat> | null> => {
    const chatData = (await Appwrite.databases.getDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_CHATS_COLLECTION_ID!,
      chatId
    )) as Models.Document;
    if (chatData) {
      return filterChatData(chatData);
    } else {
      return null;
    }
  },

  subscribeToChatDataChanges: (
    chatId: string,
    callback: (chat: Chat) => void
  ) => {
    const unsubscribe = Appwrite.client.subscribe(
      `databases.${process.env.EXPO_PUBLIC_DATABASE_ID}.collections.${process.env.EXPO_PUBLIC_CHATS_COLLECTION_ID}.documents.${chatId}`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          callback(response.payload as unknown as Chat);
        }
      }
    );

    return unsubscribe;
  },
};
