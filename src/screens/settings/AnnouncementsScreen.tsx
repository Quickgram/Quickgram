import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../types/navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../styles/colors";
import { FlashList } from "@shopify/flash-list";
import { apiServices } from "@/src/services/api/apiServices";
import AnnouncementCard from "@/src/components/settings/AnnouncementCard";
import { AnnouncementResponse } from "@/src/types/announcementInfo";
import Ionicons from "react-native-vector-icons/Ionicons";

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
      <TouchableOpacity style={styles.floatingButton}>
        <Ionicons name="add" size={wp("8%")} color={Colors.white} />
      </TouchableOpacity>
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
    paddingBottom: hp("10%"),
    paddingHorizontal: wp("4%"),
  },
  floatingButton: {
    position: "absolute",
    bottom: hp("5%"),
    right: wp("5%"),
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
