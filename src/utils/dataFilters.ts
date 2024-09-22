import { SessionInfo, SessionResponse } from "../types/SessionTypes";
import User from "../models/User";
import Message from "../models/Message";
import ChatRooms from "../models/ChatRooms";
import ChattedUser from "../models/ChattedUser";

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
    userId: userData.$id || userData.userId,
    name: userData.name,
    about: userData.about,
    phoneNumber: userData.phoneNumber,
    createdAt: userData.createdAt,
    lastSeenAt: userData.lastSeenAt,
    email: userData.email || null,
    username: userData.username,
    profileAvatarUrl: userData.profileAvatarUrl,
    isOnline: userData.isOnline,
    isVerified: userData.isVerified,
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
    sentAt: messageData.sentAt,
    fileUrl: messageData.fileUrl || null,
    chatroomId: messageData.chatroomId,
    deleteMessageFor: messageData.deleteMessageFor || [],
    isSeen: messageData.isSeen,
    isEdited: messageData.isEdited,
  };
}

export function filterMyChatroomsData(
  myChatRoomsData: any
): Partial<ChatRooms> {
  return {
    userId: myChatRoomsData.userId || myChatRoomsData.$id,
    chattedUsers: myChatRoomsData.chattedUsers || [],
  };
}

export function filterChattedUserData(
  chattedUserData: any
): Partial<ChattedUser> {
  return {
    userId: chattedUserData.userId || chattedUserData.$id,
    lastMessage: chattedUserData.lastMessage,
    lastMessageSentAt: chattedUserData.lastMessageSentAt,
    lastMessageId: chattedUserData.lastMessageId,
    name: chattedUserData.name,
    about: chattedUserData.about,
    phoneNumber: chattedUserData.phoneNumber,
    createdAt: chattedUserData.createdAt,
    lastSeenAt: chattedUserData.lastSeenAt,
    email: chattedUserData.email || null,
    username: chattedUserData.username,
    profileAvatarUrl: chattedUserData.profileAvatarUrl,
    isOnline: chattedUserData.isOnline,
    isVerified: chattedUserData.isVerified,
  };
}
