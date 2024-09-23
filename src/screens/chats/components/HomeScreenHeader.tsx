import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../styles/colors";
import { wp, hp } from "@/src/styles/responsive";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
import { userApi } from "@/src/services/api/userApi";
import {
  setCurrentChatroomId,
  setCurrentChatroomUser,
} from "@/src/redux/reducers/chatroomReducer";
import { getChatroomId } from "@/src/utils/getChatId";

const HomeScreenHeader = ({ navigation }: { navigation: any }) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);

  const handleAddUser = () => {
    Alert.prompt(
      "Enter Username",
      "Please enter the username of the user you want to chat with",
      async (username) => {
        if (!username) {
          Alert.alert("Username is required", "Please enter a username");
          return;
        }
        if (username) {
          const userData = await userApi.fetchUserDocumentByUsername(username);
          if (userData) {
            dispatch(setCurrentChatroomUser(userData));
            dispatch(
              setCurrentChatroomId(
                getChatroomId(currentUser?.userId, userData.userId!)
              )
            );
            navigation.navigate("Chat");
          } else {
            Alert.alert(
              "User not found",
              "The username you entered does not exist."
            );
          }
        }
      }
    );
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Chats</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity>
          <Ionicons name="camera-outline" size={wp(7)} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddUser}>
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
