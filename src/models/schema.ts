import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "users",
      columns: [
        { name: "uid", type: "string", isIndexed: true },
        { name: "name", type: "string" },
        { name: "about", type: "string" },
        { name: "phone_number", type: "string" },
        { name: "createdAt", type: "string" },
        { name: "is_online", type: "boolean" },
        { name: "is_verified", type: "boolean" },
        { name: "lastSeenAt", type: "string" },
        { name: "email", type: "string", isOptional: true },
        { name: "username", type: "string" },
        { name: "profile_picture_url", type: "string" },
        { name: "chatted_users", type: "string", isOptional: true },
      ],
    }),
    tableSchema({
      name: "messages",
      columns: [
        { name: "senderId", type: "string" },
        { name: "receiverId", type: "string" },
        { name: "type", type: "string" },
        { name: "messageId", type: "string", isIndexed: true },
        { name: "text", type: "string" },
        { name: "repliedMessage", type: "string", isOptional: true },
        { name: "repliedMessageId", type: "string", isOptional: true },
        { name: "repliedTo", type: "string", isOptional: true },
        { name: "seenAt", type: "string", isOptional: true },
        { name: "is_seen", type: "boolean" },
        { name: "is_edited", type: "boolean" },
        { name: "is_deleted", type: "boolean" },
        { name: "sentTime", type: "string" },
        { name: "file_url", type: "string", isOptional: true },
      ],
    }),
  ],
});
