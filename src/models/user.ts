import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export default class User extends Model {
  static table = "users";

  @field("uid") uid!: string;
  @field("name") name!: string;
  @field("about") about!: string;
  @field("phone_number") phone_number!: string;
  @field("createdAt") createdAt!: string;
  @field("is_online") is_online!: boolean;
  @field("is_verified") is_verified!: boolean;
  @field("lastSeenAt") lastSeenAt!: string;
  @field("email") email?: string;
  @field("username") username!: string;
  @field("profile_picture_url") profile_picture_url!: string;
}
