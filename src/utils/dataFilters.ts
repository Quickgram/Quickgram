import {
  AnnouncementInfo,
  AnnouncementResponse,
} from "../types/announcementInfo";
import { SessionInfo, SessionResponse } from "../types/sessionInfo";
import User from "../models/user";
import { convertTimestampToReadableFormatForAnnouncements } from "./timeConverter";

export function filterAnnouncementInfo(response: any[]): AnnouncementResponse {
  const announcements: AnnouncementInfo[] = response.map(
    (announcement: any) => ({
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      createdAt: convertTimestampToReadableFormatForAnnouncements(
        announcement.createdAt
      ),
      expiryDate: convertTimestampToReadableFormatForAnnouncements(
        announcement.expiryDate
      ),
      priority: announcement.priority,
      imageUrl: announcement.imageUrl,
      category: announcement.category,
      link: announcement.link,
      tags: announcement.tags,
    })
  );

  return {
    announcements,
    totalAnnouncements: announcements.length,
  };
}

export function filterSessionInfo(response: any[]): SessionResponse {
  const sessions: SessionInfo[] = response.map((session: any) => ({
    sessionId: session.$id,
    updatedAt: session.$updatedAt,
    countryName: session.countryName,
    isCurrent: session.current,
    deviceBrand: session.deviceBrand,
    deviceModel: session.deviceModel,
    deviceName: session.deviceName,
    osVersion: session.osVersion,
    ip: session.ip,
    osCode: session.osCode,
    osName: session.osName,
  }));

  return {
    sessions,
    totalSessions: sessions.length,
  };
}

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
