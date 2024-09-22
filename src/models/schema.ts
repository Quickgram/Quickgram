import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "users",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },
        { name: "name", type: "string" },
        { name: "about", type: "string" },
        { name: "phone_number", type: "string" },
        { name: "createdAt", type: "string" },
        { name: "lastSeenAt", type: "string" },
        { name: "email", type: "string", isOptional: true },
        { name: "username", type: "string" },
        { name: "profile_avatar_url", type: "string" },
        { name: "is_online", type: "boolean" },
        { name: "is_verified", type: "boolean" },
      ],
    }),
    tableSchema({
      name: "messages",
      columns: [
        { name: "sender_id", type: "string" },
        { name: "receiver_id", type: "string" },
        { name: "type", type: "string" },
        { name: "message_id", type: "string", isIndexed: true },
        { name: "text", type: "string" },
        { name: "replied_message", type: "string", isOptional: true },
        { name: "replied_message_id", type: "string", isOptional: true },
        { name: "replied_to", type: "string", isOptional: true },
        { name: "seenAt", type: "string", isOptional: true },
        { name: "sentAt", type: "string" },
        { name: "file_url", type: "string", isOptional: true },
        { name: "chatroom_id", type: "string" },
        { name: "delete_message_for", type: "string", isOptional: true },
        { name: "is_seen", type: "boolean" },
        { name: "is_edited", type: "boolean" },
      ],
    }),
    tableSchema({
      name: "chatrooms",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },
        { name: "chatted_users", type: "string", isOptional: true },
      ],
    }),
    tableSchema({
      name: "chattedUsers",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },
        { name: "last_message", type: "string" },
        { name: "lastMessageSentAt", type: "string" },
        { name: "last_message_id", type: "string" },
        { name: "last_message_sender_id", type: "string" },
        { name: "last_message_is_seen", type: "boolean" },
        { name: "name", type: "string" },
        { name: "about", type: "string" },
        { name: "phone_number", type: "string" },
        { name: "createdAt", type: "string" },
        { name: "lastSeenAt", type: "string" },
        { name: "email", type: "string", isOptional: true },
        { name: "username", type: "string" },
        { name: "profile_avatar_url", type: "string" },
        { name: "is_online", type: "boolean" },
        { name: "is_verified", type: "boolean" },
      ],
    }),
  ],
});
