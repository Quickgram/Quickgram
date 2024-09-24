// import React from "react";
// import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// import { Image } from "expo-image";
// import { Colors } from "@/src/styles/colors";
// import { wp, hp } from "@/src/styles/responsive";
// import { AnnouncementInfo } from "@/src/types/AnnouncementTypes";

// interface AnnouncementCardProps {
//   item: AnnouncementInfo;
// }

// const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ item }) => (
//   <TouchableOpacity style={styles.announcementItem}>
//     {item.imageUrl && (
//       <Image
//         source={{
//           uri: item.imageUrl,
//         }}
//         style={styles.announcementImage}
//         placeholderContentFit="contain"
//         cachePolicy="memory-disk"
//       />
//     )}
//     <View style={styles.announcementContent}>
//       <Text style={styles.announcementTitle}>{item.title}</Text>
//       <Text style={styles.announcementDescription}>{item.description}</Text>
//       <Text style={styles.announcementDateAndExpiry}>
//         Created: {item.createdAt} | Expires: {item.expiryDate}
//       </Text>
//       <View style={styles.tagsContainer}>
//         {item.tags.map((tag, index) => (
//           <Text key={index} style={styles.tag}>
//             {tag.trim()}
//           </Text>
//         ))}
//       </View>
//     </View>
//   </TouchableOpacity>
// );

// export default AnnouncementCard;

// const styles = StyleSheet.create({
//   announcementTitle: {
//     fontSize: wp(4.5),
//     fontWeight: "bold",
//     marginBottom: hp(1),
//     color: Colors.primary,
//   },
//   announcementImage: {
//     width: "100%",
//     height: hp(20),
//     resizeMode: "cover",
//   },
//   announcementDescription: {
//     fontSize: wp(3.5),
//     marginBottom: hp(1),
//     color: Colors.darkGrey,
//   },
//   announcementItem: {
//     backgroundColor: Colors.white,
//     borderRadius: wp(2),
//     marginTop: hp(2),
//     marginBottom: hp(2),
//     overflow: "hidden",
//     elevation: 3,
//     shadowColor: Colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   announcementContent: {
//     padding: wp(3),
//   },
//   announcementDateAndExpiry: {
//     fontSize: wp(3),
//     color: Colors.grey,
//     marginBottom: hp(1),
//   },
//   tagsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   tag: {
//     backgroundColor: Colors.lightBlue,
//     paddingHorizontal: wp(2),
//     paddingVertical: hp(0.5),
//     borderRadius: wp(1),
//     marginRight: wp(1),
//     marginBottom: hp(0.5),
//     fontSize: wp(3),
//     color: Colors.secondary,
//   },
// });
