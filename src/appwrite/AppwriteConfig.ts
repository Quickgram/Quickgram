import {
  Client,
  Account,
  Databases,
  Functions,
  Teams,
} from "react-native-appwrite";

export const API_ENDPOINT = process.env.EXPO_PUBLIC_API_ENDPOINT!;
export const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID!;

const client = new Client().setEndpoint(API_ENDPOINT).setProject(PROJECT_ID);

export const account = new Account(client);

export default client;
