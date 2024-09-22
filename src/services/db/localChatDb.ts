import { Q } from "@nozbe/watermelondb";
import database from "../../config/watermelondb";
import {
  filterMyChatroomsData,
  filterMessageData,
} from "../../utils/dataFilters";
import { getChatId } from "../../utils/getChatId";
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

  // getLastMessageById: async (
  //   messageId: string,
  //   chatId: string
  // ): Promise<Partial<Message> | null> => {
  //   const currentUserId = await secureStorageService.getCurrentUserId();

  //   if (!currentUserId) {
  //     return null;
  //   }

  //   const fetchMessageById = async (
  //     id: string
  //   ): Promise<Partial<Message> | null> => {
  //     try {
  //       const message = await messagesCollection
  //         .query(Q.where("messageId", id), Q.where("chatId", chatId))
  //         .fetch();

  //       return message.length > 0
  //         ? (filterMessageData(message[0]) as Partial<Message>)
  //         : null;
  //     } catch (error) {
  //       return null;
  //     }
  //   };

  //   const fetchPreviousMessage = async (
  //     sentTime: string
  //   ): Promise<Partial<Message> | null> => {
  //     try {
  //       const previousMessages = await messagesCollection
  //         .query(
  //           Q.where("chatId", chatId),
  //           Q.where("sentTime", Q.lt(sentTime)),
  //           Q.sortBy("sentTime", Q.desc),
  //           Q.take(1)
  //         )
  //         .fetch();

  //       const filteredPreviousMessage =
  //         previousMessages.length > 0
  //           ? (filterMessageData(previousMessages[0]) as Partial<Message>)
  //           : null;

  //       console.log(
  //         "lastMessage in function inside of pre sub function:",
  //         filteredPreviousMessage?.text
  //       );

  //       return filteredPreviousMessage;
  //     } catch (error) {
  //       console.error("Error fetching previous message:", error);
  //       return null;
  //     }
  //   };

  //   let messageData = await fetchMessageById(messageId);
  //   const deleteMessageFor = messageData?.deleteMessageFor || [];

  //   if (messageData && !deleteMessageFor.includes(currentUserId)) {
  //     return filterMessageData(messageData);
  //   }

  //   while (messageData && deleteMessageFor.includes(currentUserId)) {
  //     const sentTime = messageData.sentTime;

  //     if (sentTime) {
  //       const previousMessage = await fetchPreviousMessage(sentTime);
  //       console.log("lastMessage in function:", previousMessage?.text);

  //       if (previousMessage) {
  //         messageData = previousMessage;
  //       } else {
  //         console.log("No more previous messages found.");
  //         break;
  //       }
  //     } else {
  //       console.log("Sent time is not available.");
  //       break;
  //     }
  //   }

  //   if (!messageData) {
  //     return null;
  //   }

  //   return filterMessageData(messageData);
  // },

  upsertChatroomsData: async (
    chatroomsData: Partial<ChatRooms>
  ): Promise<void> => {
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
