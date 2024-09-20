import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../styles/colors";
import { wp, hp } from "@/src/styles/responsive";
import { Alert } from "react-native";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";

const HomeScreenHeader: React.FC = () => {
  const { chatsData } = useAppSelector((state) => state.chat);
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Chats</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity
          onPress={() => {
            console.log(chatsData);
          }}
        >
          <Ionicons name="camera-outline" size={wp(7)} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons
            name="add-circle-outline"
            size={wp(7)}
            style={styles.icon}
          />
        </TouchableOpacity>
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

export default React.memo(HomeScreenHeader);
