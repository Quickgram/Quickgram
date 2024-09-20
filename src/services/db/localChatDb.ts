import { Q } from "@nozbe/watermelondb";
import database from "../../config/watermelondb";
import { filterChatData, filterMessageData } from "../../utils/dataFilters";
import { getChatId } from "../../utils/getChatId";
import { secureStorageService } from "../storage/secureStore";
import Message from "@/src/models/Message";
import Chat from "@/src/models/Chat";
const messagesCollection = database.get<Message>("messages");
const chatsCollection = database.get<Chat>("chats");
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

  getMessagesByChatId: async (chatId: string): Promise<Partial<Message>[]> => {
    try {
      const messages = await messagesCollection
        .query(Q.where("chatId", chatId))
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

  getLastMessageById: async (
    messageId: string,
    chatId: string
  ): Promise<Partial<Message> | null> => {
    const currentUserId = await secureStorageService.getCurrentUserId();

    if (!currentUserId) {
      return null;
    }

    const fetchMessageById = async (
      id: string
    ): Promise<Partial<Message> | null> => {
      try {
        const message = await messagesCollection
          .query(Q.where("messageId", id), Q.where("chatId", chatId))
          .fetch();

        return message.length > 0
          ? (filterMessageData(message[0]) as Partial<Message>)
          : null;
      } catch (error) {
        return null;
      }
    };

    const fetchPreviousMessage = async (
      sentTime: string
    ): Promise<Partial<Message> | null> => {
      try {
        const previousMessages = await messagesCollection
          .query(
            Q.where("chatId", chatId),
            Q.where("sentTime", Q.lt(sentTime)),
            Q.sortBy("sentTime", Q.desc),
            Q.take(1)
          )
          .fetch();

        const filteredPreviousMessage =
          previousMessages.length > 0
            ? (filterMessageData(previousMessages[0]) as Partial<Message>)
            : null;

        console.log(
          "lastMessage in function inside of pre sub function:",
          filteredPreviousMessage?.text
        );

        return filteredPreviousMessage;
      } catch (error) {
        console.error("Error fetching previous message:", error);
        return null;
      }
    };

    let messageData = await fetchMessageById(messageId);
    const deleteMessageFor = messageData?.deleteMessageFor || [];

    if (messageData && !deleteMessageFor.includes(currentUserId)) {
      return filterMessageData(messageData);
    }

    while (messageData && deleteMessageFor.includes(currentUserId)) {
      const sentTime = messageData.sentTime;

      if (sentTime) {
        const previousMessage = await fetchPreviousMessage(sentTime);
        console.log("lastMessage in function:", previousMessage?.text);

        if (previousMessage) {
          messageData = previousMessage;
        } else {
          console.log("No more previous messages found.");
          break;
        }
      } else {
        console.log("Sent time is not available.");
        break;
      }
    }

    if (!messageData) {
      return null;
    }

    return filterMessageData(messageData);
  },

  upsertChatsData: async (chatsData: Partial<Chat>[]): Promise<void> => {
    await database.write(async () => {
      try {
        for (const chat of chatsData) {
          const filteredChatData = filterChatData(chat);
          try {
            const existingChat = await chatsCollection.find(
              filteredChatData.chatId!
            );
            if (existingChat !== filteredChatData) {
              await existingChat.update((chat) => {
                Object.assign(chat, filteredChatData);
              });
            }
          } catch (error) {
            await chatsCollection.create((chat) => {
              chat._raw.id = filteredChatData.chatId!;
              Object.assign(chat, filteredChatData);
            });
          }
        }
      } catch (error) {
        return;
      }
    });
  },

  getChatsData: async (userIds: string[]): Promise<Partial<Chat>[]> => {
    const currentUserId = await secureStorageService.getCurrentUserId();
    try {
      const chatsData: Partial<Chat>[] = [];
      for (const userId of userIds) {
        const chat = await chatsCollection.find(
          getChatId(currentUserId!, userId)
        );
        if (chat) {
          chatsData.push(filterChatData(chat) as Partial<Chat>);
        }
      }
      return chatsData as Partial<Chat>[];
    } catch (error) {
      return [];
    }
  },
};
