import { Q } from "@nozbe/watermelondb";
import database from "../db/localdb";
import User from "../model/User";
import { filterUserData } from "../helper/filterUserData";

export const localdbServices = {
  createUserDataInLocalDb: async (userData: Partial<User>) => {
    try {
      const usersCollection = database.get<User>("users");
      const filteredUserData = filterUserData(userData);

      await database.write(async () => {
        await usersCollection.create((user) => {
          Object.assign(user, filteredUserData);
        });
      });
      console.log("User data created in local database:", filteredUserData.uid);
    } catch (error) {
      console.error("Error creating user data in local DB:", error);
      throw error;
    }
  },

  updateUserDataInLocalDb: async (userData: Partial<User>) => {
    try {
      const usersCollection = database.get<User>("users");
      const filteredUserData = filterUserData(userData);
      console.log("Filtered User ID:", filteredUserData.uid);

      await database.write(async () => {
        const existingUsers = await usersCollection
          .query(Q.where("uid", filteredUserData.uid!))
          .fetch();

        if (existingUsers.length > 0) {
          const existingUser = existingUsers[0];
          await existingUser.update((user) => {
            Object.assign(user, filteredUserData);
          });
          console.log(`User ${filteredUserData.uid} updated successfully`);
        } else {
          await usersCollection.create((user) => {
            Object.assign(user, filteredUserData);
          });
          console.log(`User ${filteredUserData.uid} created successfully`);
        }
      });
    } catch (error) {
      console.error("Error updating/creating user data in local DB:", error);
      throw error;
    }
  },

  getUserDataFromLocalDbByUid: async (uid: string): Promise<User | null> => {
    try {
      const usersCollection = database.get<User>("users");
      const user = await usersCollection.find(uid);
      return user;
    } catch (error) {
      console.error("Error retrieving user data from local DB:", error);
      return null;
    }
  },

  getUserDataFromLocalDbByIds: async (uids: string[]): Promise<User[]> => {
    try {
      const usersCollection = database.get<User>("users");
      const users = await usersCollection
        .query(Q.where("uid", Q.oneOf(uids)))
        .fetch();
      return users;
    } catch (error) {
      console.error("Error retrieving user data from local DB:", error);
      return [];
    }
  },

  checkUserExistsInLocalDb: async (uid: string): Promise<boolean> => {
    try {
      const usersCollection = database.get<User>("users");
      const users = await usersCollection.query(Q.where("uid", uid)).fetch();
      return users.length > 0;
    } catch (error) {
      console.error("Error checking user existence in local DB:", error);
      return false;
    }
  },

  deleteUserFromLocalDb: async (uid: string): Promise<void> => {
    try {
      const usersCollection = database.get<User>("users");
      await database.write(async () => {
        const user = await usersCollection.find(uid);
        await user.destroyPermanently();
      });
      console.log(`User ${uid} deleted successfully from local DB`);
    } catch (error) {
      console.error("Error deleting user from local DB:", error);
      throw error;
    }
  },

  getAllUsersFromLocalDb: async (): Promise<User[]> => {
    try {
      const usersCollection = database.get<User>("users");
      const users = await usersCollection.query().fetch();
      return users;
    } catch (error) {
      console.error("Error retrieving all users from local DB:", error);
      return [];
    }
  },

  deleteAllUsersFromLocalDb: async (): Promise<void> => {
    try {
      const usersCollection = database.get<User>("users");
      await database.write(async () => {
        await usersCollection.query().destroyAllPermanently();
      });
      console.log("All users deleted successfully from local DB");
    } catch (error) {
      console.error("Error deleting all users from local DB:", error);
      throw error;
    }
  },
};
