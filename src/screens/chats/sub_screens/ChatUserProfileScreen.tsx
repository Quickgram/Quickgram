import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/src/types/navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Colors } from "@/src/styles/colors";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";

type ChatUserProfileScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "ChatUserProfile"
>;

const ChatUserProfileScreen: React.FC<ChatUserProfileScreenProps> = () => {
  const { currentChatroomUser } = useAppSelector((state) => state.chatroom);
  const { hasInternetConnection } = useAppSelector((state) => state.global);
  return (
    <View style={styles.container}>
      <Text>ChatUserProfileScreen</Text>
    </View>
  );
};

export default ChatUserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
