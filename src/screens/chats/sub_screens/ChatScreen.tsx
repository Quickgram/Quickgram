import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../types/navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../../styles/colors";
import { useGlobalState } from "../../../contexts/GlobalStateContext";
import ChatUserProfileHeader from "../components/ChatUserProfileHeader";
import User from "@/src/models/user";
import BottomChatField from "../components/BottomChatField";
import { useAuth } from "@/src/contexts/AuthContext";
import createChatId from "@/src/utils/createChatId";

type ChatScreenProps = NativeStackScreenProps<AppStackParamList, "Chat">;

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const { currentChatUser, isIos } = useGlobalState();
  const { currentUser } = useAuth();
  const chatId = createChatId(currentUser!.uid, currentChatUser!.uid);

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
        {/* <MessagesList /> */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.gray,
          }}
        >
          <Text>Chat Screen</Text>
        </View>
        <BottomChatField
          currentChatUser={currentChatUser as User}
          currentUser={currentUser as User}
          chatId={chatId}
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
  },
  listContent: {
    paddingBottom: hp("10%"),
    paddingHorizontal: wp("4%"),
  },
  item: {
    backgroundColor: Colors.white,
    padding: wp("3%"),
    marginVertical: hp("1%"),
    borderRadius: wp("2%"),
  },
});

export default ChatScreen;
