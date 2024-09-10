export type SessionInfo = {
  sessionId: string;
  updatedAt: string;
  countryName: string;
  isCurrent: boolean;
  deviceBrand: string;
  deviceModel: string;
  deviceName: string;
  osVersion: string;
  ip: string;
  osCode: string;
  osName: string;
};

export type SessionResponse = {
  sessions: SessionInfo[];
  totalSessions: number;
};
