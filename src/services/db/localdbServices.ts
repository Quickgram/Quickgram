import { Q } from "@nozbe/watermelondb";
import database from "../../config/watermelondb";
import User from "../../models/user";
import { filterUserData } from "../../utils/filterUserData";
import { apiServices } from "../api/apiServices";
const usersCollection = database.get<User>("users");

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

  deleteAllUsersDataFromLocaldb: async (): Promise<void> => {
    await database.write(async () => {
      await usersCollection.query().destroyAllPermanently();
    });
  },
};
