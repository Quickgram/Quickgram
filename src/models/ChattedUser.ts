import { Model } from "@nozbe/watermelondb";
import { field, json } from "@nozbe/watermelondb/decorators";

export default class ChattedUser extends Model {
  static table = "chattedUsers";

  @field("user_id") userId!: string;
  @field("last_message") lastMessage!: string;
  @field("lastMessageSentAt") lastMessageSentAt!: string;
  @field("last_message_id") lastMessageId!: string;
  @field("last_message_sender_id") lastMessageSenderId!: string;
  @field("last_message_is_seen") lastMessageIsSeen!: boolean;
  @field("name") name!: string;
  @field("about") about!: string;
  @field("phone_number") phoneNumber!: string;
  @field("createdAt") createdAt!: string;
  @field("lastSeenAt") lastSeenAt!: string;
  @field("email") email?: string | null;
  @field("username") username!: string;
  @field("profile_avatar_url") profileAvatarUrl!: string;
  @field("is_online") isOnline!: boolean;
  @field("is_verified") isVerified!: boolean;
}
