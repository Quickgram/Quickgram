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
      ],
    }),
  ],
});
