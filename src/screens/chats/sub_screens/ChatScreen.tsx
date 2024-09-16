import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../types/navigation";
import { wp, hp } from "@/src/styles/responsive";
import { Colors } from "../../../styles/colors";
import { useGlobalState } from "../../../contexts/GlobalStateContext";
import ChatUserProfileHeader from "../components/ChatUserProfileHeader";
import User from "@/src/models/User";
import BottomChatField from "../components/BottomChatField";
import { useAuth } from "@/src/contexts/AuthContext";
import MessagesList from "../components/MessagesList";
import { ImageBackground } from "expo-image";

type ChatScreenProps = NativeStackScreenProps<AppStackParamList, "Chat">;

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const [bottomFieldHeight, setBottomFieldHeight] = useState(0);
  const { currentChatUser, currentChatId, isIos, hasInternetConnection } =
    useGlobalState();
  const { currentUser } = useAuth();
  const Wallpaper = require("../../../../assets/images/wallpaper.jpg");
  const handleBottomFieldHeightChange = (height: number) => {
    if (height !== bottomFieldHeight) {
      setBottomFieldHeight(height);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={isIos ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <SafeAreaView style={styles.container}>
        <ChatUserProfileHeader
          navigation={navigation}
          currentChatUser={currentChatUser as User}
        />
        <View style={styles.MessagesListContainer}>
          <MessagesList
            currentChatUser={currentChatUser as User}
            currentUser={currentUser as User}
            chatId={currentChatId!}
            bottomPadding={bottomFieldHeight}
          />
        </View>

        <BottomChatField
          currentChatUser={currentChatUser as User}
          currentUser={currentUser as User}
          chatId={currentChatId!}
          onHeightChange={handleBottomFieldHeightChange}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "space-between",
  },
  MessagesListContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  item: {
    backgroundColor: Colors.white,
    padding: wp(3),
    marginVertical: hp(1),
    borderRadius: wp(2),
  },
});

export default ChatScreen;
