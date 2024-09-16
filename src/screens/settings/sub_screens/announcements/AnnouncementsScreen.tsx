import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { wp, hp } from "@/src/styles/responsive";
import { Colors } from "@/src/styles/colors";
import { FlashList } from "@shopify/flash-list";
import { apiServices } from "@/src/services/api/apiServices";
import AnnouncementCard from "@/src/components/settings/AnnouncementCard";
import { AppStackParamList } from "@/src/types/navigation";
import { AnnouncementResponse } from "@/src/types/AnnouncementInfo";

type AnnouncementsScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "Announcements"
>;

const AnnouncementsScreen: React.FC<AnnouncementsScreenProps> = () => {
  const [announcementResponse, setAnnouncementResponse] =
    useState<AnnouncementResponse>({
      announcements: [],
      totalAnnouncements: 0,
    });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const announcements = await apiServices.getAnnouncements();
      setAnnouncementResponse(announcements);
    };
    fetchAnnouncements();
  }, []);

  return (
    <View style={styles.container}>
      <FlashList
        data={announcementResponse.announcements}
        renderItem={({ item }) => <AnnouncementCard item={item} />}
        estimatedItemSize={200}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default AnnouncementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: hp(10),
    paddingHorizontal: wp(4),
  },
});
