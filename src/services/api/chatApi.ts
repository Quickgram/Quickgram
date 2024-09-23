import * as Appwrite from "../../config/appwrite";
import { Models } from "../../config/appwrite";
import {
  filterMessageData,
  filterMyChatroomsData,
} from "../../utils/dataFilters";
import { secureStorageService } from "../storage/secureStore";
import Message from "@/src/models/Message";
import ChatRooms from "@/src/models/ChatRooms";

export const chatApi = {
  sendTextMessage: async (messageData: Partial<Message>) => {
    if (!messageData) {
      return;
    }
    await Appwrite.databases.createDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
      messageData.messageId!,
      messageData
    );
    await chatApi.upsertChatRoomDocument(messageData);
  },

  fetchMessageById: async (
    messageId: string
  ): Promise<Partial<Message> | null> => {
    if (!messageId) {
      return null;
    }
    const response = await Appwrite.databases.getDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
      messageId
    );
    if (response) {
      return filterMessageData(response) as Partial<Message>;
    }
    return null;
  },

  fetchInitialMessages: async (
    chatroomId: string
  ): Promise<Partial<Message>[]> => {
    if (!chatroomId) {
      return [];
    }
    const response = await Appwrite.databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
      [
        Appwrite.Query.equal("chatroomId", chatroomId),
        Appwrite.Query.orderDesc("sentAt"),
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
    chatroomId: string,
    lastFetchedMessageId: string
  ): Promise<Partial<Message>[]> => {
    if (!chatroomId || !lastFetchedMessageId) {
      return [];
    }
    const response = await Appwrite.databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
      [
        Appwrite.Query.equal("chatroomId", chatroomId),
        Appwrite.Query.orderDesc("sentAt"),
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
    chatroomId: string,
    lastFetchedMessageId: string
  ): Promise<Partial<Message>[]> => {
    if (!chatroomId || !lastFetchedMessageId) {
      return [];
    }
    const response = await Appwrite.databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
      [
        Appwrite.Query.equal("chatroomId", chatroomId),
        Appwrite.Query.orderAsc("sentAt"),
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

  subscribeToMyChatroomsDocumentChanges: (
    currentUserId: string,
    callback: (chatrooms: ChatRooms) => void
  ) => {
    const unsubscribe = Appwrite.client.subscribe(
      `databases.${process.env.EXPO_PUBLIC_DATABASE_ID}.collections.${process.env.EXPO_PUBLIC_CHATROOMS_COLLECTION_ID}.documents.${currentUserId}`,
      (response) => {
        if (response.events.includes("databases.*.collections.*.documents.*")) {
          callback(response.payload as unknown as ChatRooms);
        }
      }
    );

    return unsubscribe;
  },

  upsertChatRoomDocument: async (messageData: Partial<Message>) => {
    if (
      messageData.chatroomId &&
      messageData.senderId &&
      messageData.receiverId
    ) {
      let newEntry = "";

      const updateOrAddEntry = async (userId: string) => {
        if (userId === messageData.senderId) {
          newEntry = [
            messageData.receiverId,
            messageData.text,
            messageData.sentAt,
            messageData.messageId,
            messageData.senderId,
            messageData.isSeen,
          ].join("|_+_|");
        } else {
          newEntry = [
            messageData.senderId,
            messageData.text,
            messageData.sentAt,
            messageData.messageId,
            messageData.receiverId,
            messageData.isSeen,
          ].join("|_+_|");
        }
        try {
          const existingDoc = await Appwrite.databases.getDocument(
            process.env.EXPO_PUBLIC_DATABASE_ID!,
            process.env.EXPO_PUBLIC_CHATROOMS_COLLECTION_ID!,
            userId
          );

          let chattedUsers = existingDoc.chattedUsers || [];
          const existingIndex = chattedUsers.findIndex(
            (entry: string) =>
              entry.split("|_+_|")[0] === messageData.receiverId
          );

          if (existingIndex !== -1) {
            chattedUsers[existingIndex] = newEntry;
          } else {
            chattedUsers.push(newEntry);
          }

          await Appwrite.databases.updateDocument(
            process.env.EXPO_PUBLIC_DATABASE_ID!,
            process.env.EXPO_PUBLIC_CHATROOMS_COLLECTION_ID!,
            userId,
            {
              userId: userId,
              chattedUsers: chattedUsers,
            }
          );
        } catch (error) {
          await Appwrite.databases.createDocument(
            process.env.EXPO_PUBLIC_DATABASE_ID!,
            process.env.EXPO_PUBLIC_CHATROOMS_COLLECTION_ID!,
            userId,
            {
              userId: userId,
              chattedUsers: [newEntry],
            }
          );
        }
      };

      await updateOrAddEntry(messageData.senderId);

      await updateOrAddEntry(messageData.receiverId);
    }
  },

  fetchMyChatRoomsDocument: async (): Promise<Partial<ChatRooms> | null> => {
    const currentUserId = await secureStorageService.getCurrentUserId();
    if (!currentUserId) {
      return null;
    }
    try {
      const response = await Appwrite.databases.getDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_CHATROOMS_COLLECTION_ID!,
        currentUserId
      );
      return filterMyChatroomsData(response) as Partial<ChatRooms>;
    } catch (error) {
      return null;
    }
  },
};
