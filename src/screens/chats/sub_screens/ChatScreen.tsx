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
import ChatUserProfileHeader from "../components/ChatUserProfileHeader";
import BottomChatField from "../components/BottomChatField";
import MessagesList from "../components/MessagesList";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";

type ChatScreenProps = NativeStackScreenProps<AppStackParamList, "Chat">;

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isiOS } = useAppSelector((state) => state.global);
  const { currentChatroomId, currentChatroomUser } = useAppSelector(
    (state) => state.chatroom
  );
  const [bottomFieldHeight, setBottomFieldHeight] = useState(0);
  const Wallpaper = require("../../../../assets/images/wallpaper.jpg");
  const handleBottomFieldHeightChange = (height: number) => {
    if (height !== bottomFieldHeight) {
      setBottomFieldHeight(height);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={isiOS ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <SafeAreaView style={styles.container}>
        <ChatUserProfileHeader navigation={navigation} />
        <View style={styles.MessagesListContainer}>
          <MessagesList
            chatroomId={currentChatroomId}
            bottomPadding={bottomFieldHeight}
          />
        </View>

        <BottomChatField
          chatId={currentChatroomId!}
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
