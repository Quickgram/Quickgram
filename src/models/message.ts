import { Model } from "@nozbe/watermelondb";
import { field, json } from "@nozbe/watermelondb/decorators";

export default class Message extends Model {
  static table = "messages";

  @field("sender_id") senderId!: string;
  @field("receiver_id") receiverId!: string;
  @field("type") type!: string;
  @field("message_id") messageId!: string;
  @field("text") text!: string;
  @field("replied_message") repliedMessage?: string | null;
  @field("replied_message_id") repliedMessageId?: string | null;
  @field("replied_to") repliedTo?: string | null;
  @field("seenAt") seenAt?: string | null;
  @field("sentAt") sentAt!: string;
  @field("file_url") fileUrl?: string | null;
  @field("chatroom_id") chatroomId!: string;
  @json("delete_message_for", sanitizeDeleteMessageFor)
  deleteMessageFor?: string[] | [];
  @field("is_seen") isSeen!: boolean;
  @field("is_edited") isEdited!: boolean;
}

function sanitizeDeleteMessageFor(rawDeleteMessageFor: any): string[] {
  return Array.isArray(rawDeleteMessageFor)
    ? rawDeleteMessageFor.map(String)
    : [];
}
