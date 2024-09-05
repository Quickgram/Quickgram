import {
  Client,
  Account,
  Databases,
  Functions,
  Teams,
  Storage,
  Avatars,
  Locale,
  Graphql,
  ID,
  AppwriteException,
  Models,
  Query,
  Permission,
  Role,
} from "react-native-appwrite";

const API_ENDPOINT = process.env.EXPO_PUBLIC_API_ENDPOINT!;
const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID!;
const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!;
const PROFILE_PIC_BUCKET_ID = process.env.EXPO_PUBLIC_PROFILE_PIC_BUCKET_ID!;

const client = new Client().setEndpoint(API_ENDPOINT).setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const functions = new Functions(client);
const teams = new Teams(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const locale = new Locale(client);
const graphql = new Graphql(client);

export {
  API_ENDPOINT,
  PROJECT_ID,
  DATABASE_ID,
  USERS_COLLECTION_ID,
  PROFILE_PIC_BUCKET_ID,
  client,
  account,
  databases,
  functions,
  teams,
  storage,
  avatars,
  locale,
  graphql,
  ID,
  AppwriteException,
  Models,
  Query,
  Permission,
  Role,
};

export default client;
