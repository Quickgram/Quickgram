const getChatroomId = (userId1: string, userId2: string) => {
  const sanitizeId = (id: string) => id.replace(/[a-zA-Z]/g, "");
  const [id1, id2] = [sanitizeId(userId1), sanitizeId(userId2)].sort();
  return `${id1}_${id2}`;
};

export { getChatroomId };
