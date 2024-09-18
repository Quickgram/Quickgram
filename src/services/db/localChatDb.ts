import { Q } from "@nozbe/watermelondb";
import database from "../../config/watermelondb";
import { filterMessageData } from "../../utils/dataFilters";
import { secureStorageService } from "../storage/secureStore";
import Message from "@/src/models/Message";
const messagesCollection = database.get<Message>("messages");

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
      return messages;
    } catch (error) {
      return [];
    }
  },
};
