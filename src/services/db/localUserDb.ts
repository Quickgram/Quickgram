import { Q } from "@nozbe/watermelondb";
import database from "../../config/watermelondb";
import User from "@/src/models/User";
import { filterUserData } from "../../utils/dataFilters";
import { secureStorageService } from "../storage/secureStore";
const usersCollection = database.get<User>("users");

export const localUserDb = {
  upsertUserData: async (userData: Partial<User>): Promise<void> => {
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

  getCurrentUserData: async (): Promise<Partial<User> | null> => {
    try {
      const currentUserId = await secureStorageService.getCurrentUserId();
      if (!currentUserId) {
        return null;
      }
      const currentUser = await usersCollection.find(currentUserId);
      const filteredCurrentUserData = filterUserData(currentUser);
      return filteredCurrentUserData;
    } catch (error) {
      return null;
    }
  },

  getUserDataById: async (userId: string): Promise<Partial<User> | null> => {
    try {
      const user = await usersCollection.find(userId);
      if (!user) {
        return null;
      }
      return filterUserData(user);
    } catch (error) {
      return null;
    }
  },

  getUserDataByIds: async (userIds: string[]): Promise<Partial<User>[]> => {
    try {
      const users = await usersCollection
        .query(Q.where("uid", Q.oneOf(userIds)))
        .fetch();
      if (!users) {
        return [];
      }
      return users.map((user) => filterUserData(user));
    } catch (error) {
      return [];
    }
  },

  checkUserExists: async (userId: string): Promise<boolean> => {
    try {
      const user = await usersCollection.find(userId);
      return user !== null;
    } catch (error) {
      return false;
    }
  },

  deleteUserDataFromLocaldb: async (userId: string): Promise<void> => {
    try {
      await database.write(async () => {
        const user = await usersCollection.find(userId);
        await user.destroyPermanently();
      });
    } catch (error) {
      return;
    }
  },

  getAllUsersData: async (): Promise<Partial<User>[]> => {
    try {
      const users = await usersCollection.query().fetch();
      if (!users) {
        return [];
      }
      return users.map((user) => filterUserData(user));
    } catch (error) {
      return [];
    }
  },
};
