import { Model } from "@nozbe/watermelondb";
import { field, date, text } from "@nozbe/watermelondb/decorators";

export default class Message extends Model {
  static table = "messages";

  @field("senderId") senderId!: string;
  @field("receiverId") receiverId!: string;
  @field("type") type!: string;
  @field("messageId") messageId!: string;
  @field("text") text!: string;
  @field("repliedMessage") repliedMessage!: string | null;
  @field("repliedMessageId") repliedMessageId!: string | null;
  @field("repliedTo") repliedTo!: string | null;
  @field("seenAt") seenAt!: string | null;
  @field("is_seen") is_seen!: boolean;
  @field("is_edited") is_edited!: boolean;
  @field("is_deleted") is_deleted!: boolean;
  @field("sentTime") sentTime!: string;
  @field("file_url") file_url!: string;
}
