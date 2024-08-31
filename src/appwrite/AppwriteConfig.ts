import {
  Client,
  Account,
  Databases,
  Functions,
  Teams,
  ID,
  Storage,
  Avatars,
  Locale,
  Query,
  Permission,
  Role,
  AppwriteException,
} from "react-native-appwrite";

export const API_ENDPOINT = process.env.EXPO_PUBLIC_API_ENDPOINT!;
export const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID!;

const client = new Client().setEndpoint(API_ENDPOINT).setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const teams = new Teams(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export const locale = new Locale(client);

export { ID, Query, Permission, Role, AppwriteException };

export default client;
