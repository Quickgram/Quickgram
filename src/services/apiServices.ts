import * as Appwrite from "../appwrite/appwrite-config";
import * as SecureStore from "expo-secure-store";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "../firebase/firebase-config";
import { User } from "../../types/user";
import { Models } from "../appwrite/appwrite-config";

export const apiServices = {
  createPhoneToken: async (userId: string, phoneNumber: string) => {
    return await Appwrite.account.createPhoneToken(userId, phoneNumber);
  },

  createSession: async (userId: string, code: string) => {
    return await Appwrite.account.createSession(userId, code);
  },

  createEmailPasswordSession: async (email: string, password: string) => {
    return await Appwrite.account.createEmailPasswordSession(email, password);
  },

  getUserDocumentByID: async (userId: string): Promise<User> => {
    const document = (await Appwrite.databases.getDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
      userId
    )) as Models.Document;
    return document as unknown as User;
  },

  getCurrentUserDocument: async (): Promise<User> => {
    const currentUser = await Appwrite.account.get();
    const document = (await Appwrite.databases.getDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
      currentUser.$id
    )) as Models.Document;
    return document as unknown as User;
  },

  updateUserOnline: async (userId: string): Promise<User> => {
    const document = (await Appwrite.databases.updateDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
      userId,
      {
        isOnline: true,
        lastActive: Date.now().toString(),
      }
    )) as Models.Document;
    return document as unknown as User;
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

  createNewUser: async (
    userId: string,
    userData: Partial<User>
  ): Promise<User> => {
    const document = (await Appwrite.databases.createDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID!,
      process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
      userId,
      userData
    )) as Models.Document;
    return document as unknown as User;
  },

  updateAccountName: async (name: string) => {
    return await Appwrite.account.updateName(name);
  },

  uploadProfilePicture: async (userId: string, localUri: string) => {
    const response = await fetch(localUri);
    const blob = await response.blob();

    const storageRef = ref(firebaseStorage, `profile_pictures/${userId}`);

    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  },

  subscribeToUserChanges: (userId: string, callback: (user: User) => void) => {
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
};
