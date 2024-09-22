import { Q } from "@nozbe/watermelondb";
import database from "../../config/watermelondb";
import User from "@/src/models/User";
import { filterChattedUserData, filterUserData } from "../../utils/dataFilters";
import { secureStorageService } from "../storage/secureStore";
import ChattedUser from "@/src/models/ChattedUser";
const usersCollection = database.get<User>("users");
const chattedUsersCollection = database.get<ChattedUser>("chattedUsers");

export const localUserDb = {
  upsertUserData: async (userData: Partial<User>): Promise<void> => {
    const filteredUserData = filterUserData(userData);
    await database.write(async () => {
      try {
        const existingUser = await usersCollection.find(
          filteredUserData.userId!
        );
        if (existingUser) {
          await existingUser.update((user) => {
            Object.assign(user, filteredUserData);
          });
        }
      } catch (error) {
        await usersCollection.create((user) => {
          user._raw.id = filteredUserData.userId!;
          Object.assign(user, filteredUserData);
        });
      }
    });
  },

  upsertUsersData: async (usersData: Partial<User>[]): Promise<void> => {
    await database.write(async () => {
      try {
        for (const userData of usersData) {
          const existingUser = await usersCollection.find(userData.userId!);
          if (existingUser) {
            await existingUser.update((user) => {
              Object.assign(user, userData);
            });
          }
        }
      } catch (error) {
        for (const userData of usersData) {
          await usersCollection.create((user) => {
            user._raw.id = userData.userId!;
            Object.assign(user, userData);
          });
        }
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
      const filteredCurrentUserData = filterUserData(
        currentUser
      ) as Partial<User>;
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
      return filterUserData(user) as Partial<User>;
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
      return users.map((user) => filterUserData(user) as Partial<User>);
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
      return users.map((user) => filterUserData(user) as Partial<User>);
    } catch (error) {
      return [];
    }
  },

  upsertChattedUsersData: async (
    chattedUsersData: Partial<ChattedUser>[]
  ): Promise<void> => {
    await database.write(async () => {
      try {
        for (const chattedUserData of chattedUsersData) {
          const existingChattedUser = await chattedUsersCollection.find(
            chattedUserData.userId!
          );
          if (existingChattedUser) {
            await existingChattedUser.update((chattedUser) => {
              Object.assign(chattedUser, chattedUserData);
            });
          }
        }
      } catch (error) {
        for (const chattedUserData of chattedUsersData) {
          await chattedUsersCollection.create((chattedUser) => {
            chattedUser._raw.id = chattedUserData.userId!;
            Object.assign(chattedUser, chattedUserData);
          });
        }
      }
    });
  },

  getChattedUserDataById: async (
    userId: string
  ): Promise<Partial<ChattedUser> | null> => {
    try {
      const chattedUser = await chattedUsersCollection.find(userId);
      if (!chattedUser) {
        return null;
      }
      return filterChattedUserData(chattedUser) as Partial<ChattedUser>;
    } catch (error) {
      return null;
    }
  },
};
