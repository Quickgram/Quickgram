import { Model } from "@nozbe/watermelondb";
import { field, json } from "@nozbe/watermelondb/decorators";

export default class User extends Model {
  static table = "users";

  @field("user_id") userId!: string;
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
