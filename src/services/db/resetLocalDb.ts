import database from "../../config/watermelondb";
import User from "@/src/models/User";
import Message from "@/src/models/Message";

const usersCollection = database.get<User>("users");
const messagesCollection = database.get<Message>("messages");

export const resetLocalDb = {
  resetLocalDatabase: async (): Promise<void> => {
    await database.write(async () => {
      await database.unsafeResetDatabase();
    });
  },
};
