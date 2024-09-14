const getChatId = (userId1: string, userId2: string) => {
  const [id1, id2] = [userId1, userId2].sort();
  return `${id1}_${id2}`;
};

export { getChatId };
