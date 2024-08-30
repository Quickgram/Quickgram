import * as Appwrite from "react-native-appwrite";
import appwriteConfig from "../../src/appwrite/AppwriteConfig";

const client = new Appwrite.Client();
client
  .setEndpoint(appwriteConfig.config.endpoint)
  .setProject(appwriteConfig.config.project);
const account = new Appwrite.Account(client);
