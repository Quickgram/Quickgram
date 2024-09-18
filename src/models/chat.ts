import { Model } from "@nozbe/watermelondb";
import { field, json } from "@nozbe/watermelondb/decorators";

export default class Chat extends Model {
  static table = "chats";

  @field("chatId") chatId!: string;
  @field("lastMessageId") lastMessageId!: string;
}
