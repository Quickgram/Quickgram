import * as Appwrite from "../../config/appwrite";
import * as SecureStore from "expo-secure-store";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "../../config/firebase";
import User from "../../models/user";
import { Models } from "../../config/appwrite";
import {
  filterUserData,
  filterSessionInfo,
  filterAnnouncementInfo,
} from "../../utils/dataFilters";
import Message from "@/src/models/message";

export const apiServices = {
  createPhoneToken: async (userId: string, phoneNumber: string) => {
    return await Appwrite.account.createPhoneToken(userId, phoneNumber);
  },

  createSession: async (userId: string, code: string) => {
    return await Appwrite.account.createSession(userId, code);
  },

  getAllActiveSessions: async () => {
    const sessions = await Appwrite.account.listSessions();
    const filteredSessionsData = filterSessionInfo(sessions.sessions);
    return filteredSessionsData;
  },

  terminateAllActiveSessions: async () => {
    return await Appwrite.account.deleteSessions();
  },

  terminateSession: async (sessionId: string) => {
    return await Appwrite.account.deleteSession(sessionId);
  },

  terminateCurrentSession: async () => {
    return await Appwrite.account.deleteSession("current");
  },

  createEmailPasswordSession: async (email: string, password: string) => {
    return await Appwrite.account.createEmailPasswordSession(email, password);
  },

  getUserDocumentByID: async (
    userId: string
  ): Promise<Partial<User> | null> => {
    try {
      const response = (await Appwrite.databases.getDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        userId
      )) as Models.Document;

      return filterUserData(response);
    } catch (error) {
      return null;
    }
  },

  getUserDocumentByEmail: async (
    email: string
  ): Promise<Partial<User> | null> => {
    try {
      const response = await Appwrite.databases.listDocuments(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        [Appwrite.Query.equal("email", email)]
      );
      const document = response.documents[0] as Models.Document;
      return filterUserData(document);
    } catch (error) {
      return null;
    }
  },

  getCurrentUserDocument: async (): Promise<Partial<User> | null> => {
    const currentUserId = await apiServices.getDataFromSecureStore(
      "currentUserId"
    );

    try {
      const response = (await Appwrite.databases.getDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        currentUserId!
      )) as Models.Document;

      return filterUserData(response);
    } catch (error) {
      return null;
    }
  },

  checkIfUserExists: async (userId: string): Promise<boolean> => {
    try {
      const response = await Appwrite.databases.getDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        userId
      );
      return response !== null;
    } catch (error) {
      return false;
    }
  },

  updateUserOnline: async (userId: string) => {
    return await Appwrite.databases.updateDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
      userId,
      {
        is_online: true,
        lastSeenAt: Date.now().toString(),
      }
    );
  },

  updateUserOffline: async (userId: string) => {
    return await Appwrite.databases.updateDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
      userId,
      {
        is_online: false,
        lastSeenAt: Date.now().toString(),
      }
    );
  },

  setSignedStatus: async (value: string) => {
    return await SecureStore.setItemAsync("isSigned", value);
  },

  setDataToSecureStore: async (key: string, value: string) => {
    return await SecureStore.setItemAsync(key, value);
  },

  getDataFromSecureStore: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },

  getSignedStatus: async () => {
    return await SecureStore.getItemAsync("isSigned");
  },

  checkUsernameAvailability: async (username: string) => {
    try {
      const response = await Appwrite.databases.listDocuments(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        [Appwrite.Query.equal("username", username)]
      );
      return response.documents.length === 0;
    } catch (error) {
      return false;
    }
  },

  createNewUser: async (userId: string, userData: Partial<User>) => {
    await Appwrite.databases.createDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
      userId,
      userData
    );
  },

  updateAccountName: async (name: string) => {
    await Appwrite.account.updateName(name);
  },

  uploadProfilePicture: async (userId: string, localUri: string) => {
    const response = await fetch(localUri);
    const blob = await response.blob();

    const storageRef = ref(firebaseStorage, `profile_pictures/${userId}`);

    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  },

  updateProfilePicture: async (userId: string, photoUrl: string) => {
    return await Appwrite.databases.updateDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
      userId,
      {
        profile_picture_url: photoUrl,
      }
    );
  },

  updateName: async (userId: string, name: string) => {
    await Appwrite.account.updateName(name);
    return await Appwrite.databases.updateDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
      userId,
      {
        name: name,
      }
    );
  },

  updateUsername: async (userId: string, username: string) => {
    return await Appwrite.databases.updateDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
      userId,
      {
        username: username,
      }
    );
  },

  updateAbout: async (userId: string, about: string) => {
    return await Appwrite.databases.updateDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
      userId,
      {
        about: about,
      }
    );
  },

  updateNameAndUsernameAndAbout: async (
    userId: string,
    name: string,
    username: string,
    about: string
  ) => {
    return await Appwrite.databases.updateDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
      userId,
      {
        name: name,
        username: username,
        about: about,
      }
    );
  },

  getAnnouncements: async () => {
    const response = await Appwrite.databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_ANNOUNCEMENTS_COLLECTION_ID!
    );
    const filteredAnnouncements = filterAnnouncementInfo(response.documents);
    return filteredAnnouncements;
  },

  getUserLabels: async () => {
    const response = await Appwrite.account.get();
    console.log(response.labels);
    return response.labels;
  },

  getChattedUsers: async (chattedUsersIds: string[]) => {
    const users = [];
    for (const userId of chattedUsersIds) {
      const user = await apiServices.getUserDocumentByID(userId);
      if (user) {
        users.push(user);
      }
    }
    return users;
  },

  subscribeToUserDataChanges: (
    userId: string,
    callback: (user: User) => void
  ) => {
    const unsubscribe = Appwrite.client.subscribe(
      `databases.${process.env.EXPO_PUBLIC_DATABASE_ID}.collections.${process.env.EXPO_PUBLIC_USERS_COLLECTION_ID}.documents.${userId}`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          callback(response.payload as unknown as User);
        }
      }
    );

    return unsubscribe;
  },

  updateChatDoc: async (chatId: string, messageData: Partial<Message>) => {
    try {
      const chatDoc = await Appwrite.databases.getDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_CHATS_COLLECTION_ID!,
        chatId
      );

      const existingMessageIds = chatDoc.messageIds || [];

      const updatedMessageIds = [...existingMessageIds, messageData.messageId!];

      await Appwrite.databases.updateDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_CHATS_COLLECTION_ID!,
        chatId,
        {
          chatId: chatId,
          lastMessageId: messageData.messageId,
          messageIds: updatedMessageIds,
        }
      );
    } catch (error) {
      await Appwrite.databases.createDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_CHATS_COLLECTION_ID!,
        chatId,
        {
          chatId: chatId,
          lastMessageId: messageData.messageId,
          messageIds: [messageData.messageId!],
        }
      );
    }
  },

  sendTextMessage: async (messageData: Partial<Message>, chatId: string) => {
    try {
      await Appwrite.databases.createDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
        messageData.messageId!,
        messageData
      );
      await apiServices.updateChatDoc(chatId, messageData);
    } catch (error) {
      console.log("error while sending message", error);
    }
  },

  getMessages: async (currentUserId: string, chattedUserId: string) => {
    const response = await Appwrite.databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID!,
      [
        Appwrite.Query.equal("senderId", currentUserId),
        Appwrite.Query.equal("receiverId", chattedUserId),
      ]
    );
    return response.documents;
  },

  getChats: async (currentUserId: string) => {
    const response = await Appwrite.databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_CHATS_COLLECTION_ID!,
      [Appwrite.Query.equal("userId", currentUserId)]
    );
    return response.documents;
  },

  getChatInfo: async () => {},
};
