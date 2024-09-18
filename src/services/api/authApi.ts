import * as Appwrite from "../../config/appwrite";
import { filterSessionInfo } from "../../utils/dataFilters";

export const authApi = {
  createPhoneToken: async (userId: string, phoneNumber: string) => {
    return await Appwrite.account.createPhoneToken(userId, phoneNumber);
  },

  createSession: async (userId: string, code: string) => {
    return await Appwrite.account.createSession(userId, code);
  },

  createEmailPasswordSession: async (email: string, password: string) => {
    return await Appwrite.account.createEmailPasswordSession(email, password);
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
};
