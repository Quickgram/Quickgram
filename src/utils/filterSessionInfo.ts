import { SessionInfo, SessionResponse } from "../types/sessionList";

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
