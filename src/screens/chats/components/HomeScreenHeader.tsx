import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../styles/colors";
import { wp, hp } from "@/src/styles/responsive";

const HomeScreenHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Chats</Text>
      <View style={styles.headerIcons}>
        <Ionicons name="camera-outline" size={24} style={styles.icon} />
        <Ionicons name="add-circle-outline" size={24} style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.22),
    paddingTop: Platform.OS === "ios" ? hp(1) : hp(5),
  },
  headerTitle: {
    fontSize: wp(9.68),
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: wp(4),
  },
});

export default HomeScreenHeader;
