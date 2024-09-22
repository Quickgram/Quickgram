// import * as Appwrite from "../../config/appwrite";
// import { filterAnnouncementInfo } from "../../utils/dataFilters";
// import { AnnouncementResponse } from "@/src/types/AnnouncementTypes";

// export const announcementApi = {
//   fetchAnnouncements:
//     async (): Promise<Partial<AnnouncementResponse> | null> => {
//       const response = await Appwrite.databases.listDocuments(
//         process.env.EXPO_PUBLIC_DATABASE_ID!,
//         process.env.EXPO_PUBLIC_ANNOUNCEMENTS_COLLECTION_ID!
//       );

//       if (response.documents.length > 0) {
//         return filterAnnouncementInfo(
//           response.documents
//         ) as Partial<AnnouncementResponse>;
//       }
//       return null;
//     },
// };
