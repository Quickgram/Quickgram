import * as Appwrite from "../../config/appwrite";
import { Models } from "../../config/appwrite";
import {
  filterMessageData,
  filterMyChatroomsData,
} from "../../utils/dataFilters";
import { secureStorageService } from "../storage/secureStore";
import Message from "@/src/models/Message";
import ChatRooms from "@/src/models/ChatRooms";
import { getChatId } from "@/src/utils/getChatId";

export const chatApi = {
  sendTextMessage: async (messageData: Partial<Message>) => {
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

  // fetchLastMessageById: async (
  //   messageId?: string,
  //   chatroomId?: string
  // ): Promise<Partial<Message> | null> => {
  //   const currentUserId = await secureStorageService.getCurrentUserId();

  //   if (!messageId || !chatroomId || !currentUserId) {
  //     return null;
  //   }

  //   const fetchMessageById = async (id: string) => {
  //     const response = await Appwrite.databases.listDocuments(
  //       process.env.EXPO_PUBLIC_DATABASE_ID!,
  //       process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
  //       [
  //         Appwrite.Query.equal("messageId", id),
  //         Appwrite.Query.equal("chatroomId", chatroomId),
  //         Appwrite.Query.limit(1),
  //       ]
  //     );
  //     if (response.documents.length === 0) {
  //       return null;
  //     }
  //     return response.documents[0];
  //   };

  //   const fetchPreviousMessage = async (lastFetchedMessageId: string) => {
  //     const response = await Appwrite.databases.listDocuments(
  //       process.env.EXPO_PUBLIC_DATABASE_ID!,
  //       process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
  //       [
  //         Appwrite.Query.equal("chatId", chatId),
  //         Appwrite.Query.orderAsc("sentTime"),
  //         Appwrite.Query.cursorBefore(lastFetchedMessageId),
  //         Appwrite.Query.limit(1),
  //       ]
  //     );
  //     if (response.documents.length === 0) {
  //       return null;
  //     }
  //     return response.documents[0];
  //   };

  //   let messageData = await fetchMessageById(messageId);

  //   if (messageData && !messageData.deleteMessageFor.includes(currentUserId)) {
  //     return filterMessageData(messageData) as Partial<Message>;
  //   }

  //   while (
  //     messageData &&
  //     messageData.deleteMessageFor.includes(currentUserId)
  //   ) {
  //     const lastFetchedMessageId = messageData.messageId;
  //     messageData = await fetchPreviousMessage(lastFetchedMessageId);
  //   }

  //   if (!messageData) {
  //     return null;
  //   }

  //   const filteredLastMessageData = filterMessageData(
  //     messageData
  //   ) as Partial<Message>;

  //   return filteredLastMessageData;
  // },

  fetchInitialMessages: async (
    chatroomId: string
  ): Promise<Partial<Message>[]> => {
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

  // subscribeToChatDataChanges: (
  //   chatId: string,
  //   callback: (chat: Chat) => void
  // ) => {
  //   const unsubscribe = Appwrite.client.subscribe(
  //     `databases.${process.env.EXPO_PUBLIC_DATABASE_ID}.collections.${process.env.EXPO_PUBLIC_CHATS_COLLECTION_ID}.documents.${chatId}`,
  //     (response) => {
  //       if (
  //         response.events.includes(
  //           "databases.*.collections.*.documents.*.update"
  //         )
  //       ) {
  //         callback(response.payload as unknown as Chat);
  //       }
  //     }
  //   );

  //   return unsubscribe;
  // },

  upsertChatRoomDocument: async (messageData: Partial<Message>) => {
    if (
      messageData.chatroomId &&
      messageData.senderId &&
      messageData.receiverId
    ) {
      try {
        await Appwrite.databases.updateDocument(
          process.env.EXPO_PUBLIC_DATABASE_ID!,
          process.env.EXPO_PUBLIC_CHATROOMS_COLLECTION_ID!,
          messageData.senderId,
          {
            userId: messageData.senderId,
            chattedUsers: [
              [
                messageData.receiverId,
                messageData.text,
                messageData.sentAt,
                messageData.messageId,
                messageData.senderId,
                messageData.isSeen,
              ].join("|_+_|"),
            ],
          }
        );
      } catch (error) {
        await Appwrite.databases.createDocument(
          process.env.EXPO_PUBLIC_DATABASE_ID!,
          process.env.EXPO_PUBLIC_CHATROOMS_COLLECTION_ID!,
          messageData.senderId,
          {
            userId: messageData.senderId,
            chattedUsers: [
              [
                messageData.receiverId,
                messageData.text,
                messageData.sentAt,
                messageData.messageId,
                messageData.senderId,
                messageData.isSeen,
              ].join("|_+_|"),
            ],
          }
        );
      }

      try {
        await Appwrite.databases.updateDocument(
          process.env.EXPO_PUBLIC_DATABASE_ID!,
          process.env.EXPO_PUBLIC_CHATROOMS_COLLECTION_ID!,
          messageData.receiverId,
          {
            userId: messageData.receiverId,
            chattedUsers: [
              [
                messageData.receiverId,
                messageData.text,
                messageData.sentAt,
                messageData.messageId,
                messageData.senderId,
                messageData.isSeen,
              ].join("|_+_|"),
            ],
          }
        );
      } catch (error) {
        await Appwrite.databases.createDocument(
          process.env.EXPO_PUBLIC_DATABASE_ID!,
          process.env.EXPO_PUBLIC_CHATROOMS_COLLECTION_ID!,
          messageData.receiverId,
          {
            userId: messageData.receiverId,
            chattedUsers: [
              [
                messageData.receiverId,
                messageData.text,
                messageData.sentAt,
                messageData.messageId,
                messageData.senderId,
                messageData.isSeen,
              ].join("|_+_|"),
            ],
          }
        );
      }
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
