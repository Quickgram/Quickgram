import { Model } from "@nozbe/watermelondb";
import { field, json } from "@nozbe/watermelondb/decorators";

export default class Chatrooms extends Model {
  static table = "chatrooms";

  @field("user_id") userId!: string;
  @json("chatted_users", sanitizeChattedUsers) chattedUsers?: string[] | [];
}

function sanitizeChattedUsers(rawChattedUsers: any): string[] {
  return Array.isArray(rawChattedUsers) ? rawChattedUsers.map(String) : [];
}
