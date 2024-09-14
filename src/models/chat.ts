import { Model } from "@nozbe/watermelondb";
import { field, json } from "@nozbe/watermelondb/decorators";

export default class Chat extends Model {
  static table = "chats";

  @field("chatId") chatId!: string;
  @json("messageIds", sanitizeMessageIds) messageIds!: string[] | [];
  @field("lastMessageId") lastMessageId!: string;
}

function sanitizeMessageIds(rawChattedUsers: any): string[] {
  return Array.isArray(rawChattedUsers) ? rawChattedUsers.map(String) : [];
}
