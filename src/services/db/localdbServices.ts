import { Q } from "@nozbe/watermelondb";
import database from "../../config/watermelondb";
import User from "../../models/user";
import {
  filterChatData,
  filterMessageData,
  filterUserData,
} from "../../utils/dataFilters";
import { apiServices } from "../api/apiServices";
import Message from "@/src/models/message";
import Chat from "@/src/models/chat";

const usersCollection = database.get<User>("users");
const messagesCollection = database.get<Message>("messages");
const chatsCollection = database.get<Chat>("chats");

export const localdbServices = {
  createUserDataInLocaldb: async (userData: Partial<User>): Promise<void> => {
    const filteredUserData = filterUserData(userData);

    await database.write(async () => {
      await usersCollection.create((user) => {
        user._raw.id = filteredUserData.uid!;
        Object.assign(user, filteredUserData);
      });
    });
  },

  updateUserDataInLocaldb: async (userData: Partial<User>) => {
    const filteredUserData = filterUserData(userData);

    await database.write(async () => {
      try {
        const existingUser = await usersCollection.find(filteredUserData.uid!);
        await existingUser.update((user) => {
          Object.assign(user, filteredUserData);
        });
      } catch (error) {
        await usersCollection.create((user) => {
          user._raw.id = filteredUserData.uid!;
          Object.assign(user, filteredUserData);
        });
      }
    });
  },

  getCurrentUserDataFromLocaldb: async (): Promise<User | null> => {
    try {
      const currentUserId = await apiServices.getDataFromSecureStore(
        "currentUserId"
      );
      const user = await usersCollection.find(currentUserId!);
      return user;
    } catch (error) {
      return null;
    }
  },

  getUserDataFromLocaldbByID: async (userId: string): Promise<User | null> => {
    try {
      const user = await usersCollection.find(userId);
      return user;
    } catch (error) {
      return null;
    }
  },

  getUserDataFromLocaldbByIDs: async (userIds: string[]): Promise<User[]> => {
    try {
      const users = await usersCollection
        .query(Q.where("uid", Q.oneOf(userIds)))
        .fetch();
      return users;
    } catch (error) {
      return [];
    }
  },

  checkUserExistsInLocaldb: async (userId: string): Promise<boolean> => {
    try {
      const user = await usersCollection.find(userId);
      return user !== null;
    } catch (error) {
      return false;
    }
  },

  deleteUserDataFromLocaldb: async (userId: string): Promise<void> => {
    await database.write(async () => {
      const user = await usersCollection.find(userId);
      await user.destroyPermanently();
    });
  },

  getAllUsersDataFromLocaldb: async (): Promise<User[]> => {
    try {
      const users = await usersCollection.query().fetch();
      return users;
    } catch (error) {
      return [];
    }
  },

  createMessageInLocaldb: async (
    messageData: Partial<Message>
  ): Promise<void> => {
    await database.write(async () => {
      try {
        const filteredMessageData = filterMessageData(messageData);
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
      } catch (error) {
        console.log("error updating/creating single message", error);
      }
    });
  },

  createMessagesInLocaldb: async (
    messages: Partial<Message>[]
  ): Promise<void> => {
    await database.write(async () => {
      try {
        for (const message of messages) {
          const filteredMessageData = filterMessageData(message);
          try {
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
              console.log(
                "error updating message // message data same  -> creating new message ",
                filteredMessageData.messageId,
                "error is:",
                error
              );

              await messagesCollection.create((message) => {
                message._raw.id = filteredMessageData.messageId!;
                Object.assign(message, filteredMessageData);
              });
            }
          } catch (error) {
            console.log(
              "error for this message",
              filteredMessageData.messageId
            );
          }
        }
      } catch (error) {
        console.log("error creating messages in local db", error);
      }
    });
  },

  getMessagesFromLocaldb: async (messageIds: string[]): Promise<Message[]> => {
    const messages = [];
    try {
      for (const messageId of messageIds) {
        const message = await messagesCollection.find(messageId);
        messages.push(message);
      }
      return messages;
    } catch (error) {
      return [];
    }
  },

  getAllMessagesFromLocaldb: async (): Promise<Message[]> => {
    try {
      const messages = await messagesCollection.query().fetch();
      return messages;
    } catch (error) {
      return [];
    }
  },

  getChatDataFromLocaldbByID: async (chatId: string): Promise<Chat | null> => {
    try {
      const chat = await chatsCollection.find(chatId);
      return chat;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  },

  updateChatDataInLocaldb: async (chatData: Partial<Chat>) => {
    try {
      const filteredChatData = filterChatData(chatData);
      await database.write(async () => {
        try {
          const existingChat = await chatsCollection.find(
            filteredChatData.chatId!
          );

          await existingChat.update((chat) => {
            Object.assign(chat, filteredChatData);
          });
        } catch (error) {
          await chatsCollection.create((chat) => {
            chat._raw.id = filteredChatData.chatId!;
            Object.assign(chat, filteredChatData);
          });
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  },

  deleteAllUsersDataFromLocaldb: async (): Promise<void> => {
    await database.write(async () => {
      await usersCollection.query().destroyAllPermanently();
    });
  },

  resetLocalDatabase: async (): Promise<void> => {
    await database.write(async () => {
      await database.unsafeResetDatabase();
    });
  },
};
