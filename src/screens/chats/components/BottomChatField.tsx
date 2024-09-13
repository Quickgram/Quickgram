import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/styles/colors";
import { apiServices } from "@/src/services/api/apiServices";
import { wp, hp } from "@/src/styles/responsive";
import { useGlobalState } from "@/src/contexts/GlobalStateContext";
import User from "@/src/models/user";
import Message from "@/src/models/message";
import MessageType from "@/src/utils/messageType";
import * as Appwrite from "../../../config/appwrite";

interface BottomChatFieldProps {
  currentChatUser: User;
  currentUser: User;
  chatId: string;
}

const BottomChatField: React.FC<BottomChatFieldProps> = ({
  currentChatUser,
  currentUser,
  chatId,
}) => {
  const { isIos } = useGlobalState();
  const [isTyping, setIsTyping] = useState(false);
  const [textMessage, setTextMessage] = useState("");

  const textChange = (text: string) => {
    setTextMessage(text);
    setIsTyping(text.length > 0);
  };

  const sendTextMessage = async () => {
    const newMessage: Partial<Message> = {
      senderId: currentUser.uid,
      receiverId: currentChatUser.uid,
      type: MessageType.TEXT,
      messageId: Appwrite.ID.unique(),
      text: textMessage,
      repliedMessage: null,
      repliedMessageId: null,
      repliedTo: null,
      seenAt: null,
      is_seen: false,
      is_edited: false,
      is_deleted: false,
      sentTime: Date.now().toString(),
    };
    setTextMessage("");
    await apiServices.sendTextMessage(newMessage, chatId);
    setIsTyping(false);
  };

  return (
    <KeyboardAvoidingView>
      <View
        style={[
          styles.container,
          { alignItems: isTyping ? "flex-end" : "center" },
        ]}
      >
        {!isTyping && (
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-outline" size={wp("8%")} />
          </TouchableOpacity>
        )}

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputContainer}
            multiline
            placeholder="Message"
            placeholderTextColor={Colors.gray}
            onChangeText={textChange}
            value={textMessage}
          />
        </View>
        {!isTyping ? (
          <>
            <TouchableOpacity style={styles.button}>
              <Ionicons name="camera-outline" size={wp("8%")} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Ionicons name="happy-outline" size={wp("7%")} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                width: isIos ? hp("4%") : hp("5.5%"),
                height: isIos ? hp("4%") : hp("5.5%"),
              },
            ]}
            onPress={sendTextMessage}
          >
            <Ionicons name="send" size={wp("5%")} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    left: 0,
    bottom: 0,
    maxHeight: hp("10%"),
    padding: hp("1%"),
    width: wp("100%"),
    backgroundColor: Colors.background,
  },
  inputWrapper: {
    backgroundColor: Colors.white,
    flex: 1,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: wp("2%"),
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    width: hp("4%"),
    height: hp("4%"),
  },
  inputContainer: {
    height: "100%",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    fontSize: wp("4%"),
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: hp("4%"),
    height: hp("4%"),
    elevation: 2,
    marginHorizontal: wp("0.5%"),
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 24,
    elevation: 2,
  },
});

export default BottomChatField;
