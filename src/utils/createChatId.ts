const createChatIdForMe = (
  currentUserId: string,
  currentChatUserId: string
): string => {
  const trimmedCurrentUserId = currentUserId.slice(10);
  const trimmedCurrentChatUserId = currentChatUserId.slice(10);
  const ChatIdForMe = `${trimmedCurrentUserId}_${trimmedCurrentChatUserId}`;

  return ChatIdForMe;
};

const createChatIdForCurrentChatUser = (
  currentChatUserId: string,
  currentUserId: string
): string => {
  const trimmedCurrentChatUserId = currentChatUserId.slice(10);
  const trimmedCurrentUserId = currentUserId.slice(10);

  const ChatIdForCurrentChatUser = `${trimmedCurrentChatUserId}_${trimmedCurrentUserId}`;

  return ChatIdForCurrentChatUser;
};

export { createChatIdForMe, createChatIdForCurrentChatUser };
