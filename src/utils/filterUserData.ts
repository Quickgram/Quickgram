import User from "../model/user";

export function filterUserData(userData: any): Partial<User> {
  return {
    uid: userData.$id || userData.uid,
    name: userData.name,
    about: userData.about,
    phone_number: userData.phone_number,
    createdAt: userData.createdAt,
    is_online: userData.is_online,
    is_verified: userData.is_verified,
    lastSeenAt: userData.lastSeenAt,
    email: userData.email,
    username: userData.username,
    profile_picture_url: userData.profile_picture_url,
  };
}
