import * as Appwrite from "../../config/appwrite";
import User from "../../models/User";
import { Models } from "../../config/appwrite";
import { filterUserData } from "../../utils/dataFilters";
import { secureStorageService } from "../storage/secureStore";

export const userApi = {
  updateName: async (name: string) => {
    const currentUserId = await secureStorageService.getCurrentUserId();
    if (currentUserId) {
      await Appwrite.account.updateName(name);
      await Appwrite.databases.updateDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        currentUserId,
        {
          name: name,
        }
      );
    }
  },

  updateUsername: async (username: string) => {
    const currentUserId = await secureStorageService.getCurrentUserId();
    if (currentUserId) {
      await Appwrite.databases.updateDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        currentUserId,
        {
          username: username,
        }
      );
    }
  },

  updateAbout: async (about: string) => {
    const currentUserId = await secureStorageService.getCurrentUserId();
    if (currentUserId) {
      await Appwrite.databases.updateDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        currentUserId,
        {
          about: about,
        }
      );
    }
  },

  updateNameAndUsernameAndAbout: async (
    name: string,
    username: string,
    about: string
  ) => {
    const currentUserId = await secureStorageService.getCurrentUserId();
    if (currentUserId) {
      await Appwrite.databases.updateDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        currentUserId,
        {
          name: name,
          username: username,
          about: about,
        }
      );
    }
  },

  fetchUserLabels: async () => {
    try {
      const response = await Appwrite.account.get();
      return response.labels ?? null;
    } catch (error) {
      return null;
    }
  },

  updateProfileAvatar: async (url: string) => {
    const currentUserId = await secureStorageService.getCurrentUserId();
    if (currentUserId) {
      await Appwrite.databases.updateDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        currentUserId,
        {
          profileAvatarUrl: url,
        }
      );
    }
  },

  createNewUser: async (
    userId: string,
    userData: Partial<User>
  ): Promise<Partial<User> | null> => {
    try {
      const document = (await Appwrite.databases.createDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        userId,
        userData
      )) as Models.Document;
      return filterUserData(document) as Partial<User>;
    } catch (error) {
      return null;
    }
  },

  fetchUserDocumentById: async (
    userId: string
  ): Promise<Partial<User> | null> => {
    try {
      const response = (await Appwrite.databases.getDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        userId
      )) as Models.Document;

      return filterUserData(response) as Partial<User>;
    } catch (error) {
      return null;
    }
  },

  fetchUserDocumentByEmail: async (
    email: string
  ): Promise<Partial<User> | null> => {
    try {
      const response = await Appwrite.databases.listDocuments(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        [Appwrite.Query.equal("email", email)]
      );
      if (response.documents.length > 0) {
        const document = response.documents[0] as Models.Document;
        return filterUserData(document) as Partial<User>;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  fetchUserDocumentByUsername: async (
    username: string
  ): Promise<Partial<User> | null> => {
    try {
      const response = await Appwrite.databases.listDocuments(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        [Appwrite.Query.equal("username", username)]
      );
      if (response.documents.length > 0) {
        const document = response.documents[0] as Models.Document;
        return filterUserData(document) as Partial<User>;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  fetchCurrentUserDocument: async (): Promise<Partial<User> | null> => {
    const currentUserId = await secureStorageService.getCurrentUserId();
    if (currentUserId) {
      try {
        const response = (await Appwrite.databases.getDocument(
          process.env.EXPO_PUBLIC_DATABASE_ID!,
          process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
          currentUserId
        )) as Models.Document;

        return filterUserData(response) as Partial<User>;
      } catch (error) {
        return null;
      }
    }
    return null;
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

  updateUserActiveStatus: async (isOnline: boolean) => {
    const currentUserId = await secureStorageService.getCurrentUserId();
    if (currentUserId) {
      await Appwrite.databases.updateDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        currentUserId,
        {
          isOnline: isOnline,
          lastSeenAt: Date.now().toString(),
        }
      );
    }
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

  subscribeToMyUserDocumentChanges: (
    currentUserId: string,
    callback: (user: User) => void
  ) => {
    const unsubscribe = Appwrite.client.subscribe(
      `databases.${process.env.EXPO_PUBLIC_DATABASE_ID}.collections.${process.env.EXPO_PUBLIC_USERS_COLLECTION_ID}.documents.${currentUserId}`,
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
