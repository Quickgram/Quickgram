import {
  AnnouncementInfo,
  AnnouncementResponse,
} from "../types/announcementInfo";
import { SessionInfo, SessionResponse } from "../types/sessionInfo";
import User from "../models/user";
import { convertTimestampToReadableFormatForAnnouncements } from "./timeConverter";
import Message from "../models/message";
import { ChatInfo } from "../types/chatInfo";

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
    email: userData.email || null,
    username: userData.username,
    profile_picture_url: userData.profile_picture_url,
    chatted_users: userData.chatted_users || [],
  };
}

export function filterMessageData(messageData: any): Partial<Message> {
  return {
    senderId: messageData.senderId,
    receiverId: messageData.receiverId,
    type: messageData.type,
    messageId: messageData.messageId,
    text: messageData.text,
    repliedMessage: messageData.repliedMessage || null,
    repliedMessageId: messageData.repliedMessageId || null,
    repliedTo: messageData.repliedTo || null,
    seenAt: messageData.seenAt || null,
    is_seen: messageData.is_seen,
    is_edited: messageData.is_edited,
    is_deleted: messageData.is_deleted,
    sentTime: messageData.sentTime,
  };
}

export function filterChatInfo(chatData: any): Partial<ChatInfo> {
  return {
    id: chatData.id,
    messageIds: chatData.messageIds,
    lastMessageId: chatData.lastMessageId,
  };
}
