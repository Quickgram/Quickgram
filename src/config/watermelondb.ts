import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import schema from "../models/schema";
import migrations from "../models/migrations";
import User from "../models/User";
import Message from "../models/Message";
import Chat from "../models/Chat";

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: true,
  onSetUpError: (error) => {
    console.error("Database setup error:", error);
  },
});

const database = new Database({
  adapter,
  modelClasses: [User, Message, Chat],
});

export default database;
