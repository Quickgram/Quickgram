import { Q } from "@nozbe/watermelondb";
import database from "../../config/watermelondb";
import {
  filterMyChatroomsData,
  filterMessageData,
} from "../../utils/dataFilters";
import { secureStorageService } from "../storage/secureStore";
import Message from "@/src/models/Message";
import ChatRooms from "@/src/models/ChatRooms";
const messagesCollection = database.get<Message>("messages");
const chatRoomsCollection = database.get<ChatRooms>("chatrooms");

export const localChatDb = {
  upsertMessages: async (messages: Partial<Message>[]): Promise<void> => {
    await database.write(async () => {
      try {
        for (const message of messages) {
          const filteredMessageData = filterMessageData(message);
          try {
            const existingMessage = await messagesCollection.find(
              filteredMessageData.messageId!
            );
            if (existingMessage !== filteredMessageData) {
              await existingMessage.update((message) => {
                Object.assign(message, filteredMessageData);
              });
            }
          } catch (error) {
            await messagesCollection.create((message) => {
              message._raw.id = filteredMessageData.messageId!;
              Object.assign(message, filteredMessageData);
            });
          }
        }
      } catch (error) {
        return;
      }
    });
  },

  getMessagesByChatroomId: async (
    chatroomId: string
  ): Promise<Partial<Message>[]> => {
    try {
      const messages = await messagesCollection
        .query(Q.where("chatroomId", chatroomId))
        .fetch();

      if (messages.length === 0) {
        return [];
      }

      const filteredMessages = messages.map((message) =>
        filterMessageData(message)
      );
      return filteredMessages as Partial<Message>[];
    } catch (error) {
      return [];
    }
  },

  getMessageById: async (
    messageId: string
  ): Promise<Partial<Message> | null> => {
    try {
      const message = await messagesCollection.find(messageId);

      if (!message) {
        return null;
      }
      return filterMessageData(message) as Partial<Message>;
    } catch (error) {
      return null;
    }
  },

  upsertChatroomsData: async (
    chatroomsData: Partial<ChatRooms>
  ): Promise<void> => {
    try {
      await database.write(async () => {
        const filteredChatroomsData = filterMyChatroomsData(chatroomsData);
        if (!filteredChatroomsData.userId) {
          return;
        }
        try {
          try {
            const existingChatrooms = await chatRoomsCollection.find(
              filteredChatroomsData.userId
            );
            if (existingChatrooms !== filteredChatroomsData) {
              await existingChatrooms.update((chatrooms) => {
                Object.assign(chatrooms, filteredChatroomsData);
              });
            }
          } catch (error) {
            await chatRoomsCollection.create((chatrooms) => {
              chatrooms._raw.id = filteredChatroomsData.userId!;
              Object.assign(chatrooms, filteredChatroomsData);
            });
          }
        } catch (error) {
          return;
        }
      });
    } catch (error) {
      console.error("Error upserting chatrooms data", error);
    }
  },

  getMyChatroomsData: async (): Promise<Partial<ChatRooms> | null> => {
    const currentUserId = await secureStorageService.getCurrentUserId();
    if (!currentUserId) {
      return null;
    }
    try {
      const chatRooms = await chatRoomsCollection.find(currentUserId);
      return filterMyChatroomsData(chatRooms) as Partial<ChatRooms>;
    } catch (error) {
      return null;
    }
  },
};
