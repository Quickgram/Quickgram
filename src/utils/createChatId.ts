const createChatId = (userId1: string, userId2: string): string => {
  const trimmedId1 = userId1.slice(10);
  const trimmedId2 = userId2.slice(10);
  const combinedId = `${trimmedId1}_${trimmedId2}`;

  return combinedId;
};

export default createChatId;
