import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/styles/colors";
import { wp, hp } from "@/src/styles/responsive";
import Message from "@/src/models/Message";
import MessageEnum from "@/src/utils/messageEnum";
import * as Appwrite from "../../../config/appwrite";
import { chatApi } from "@/src/services/api/chatApi";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface BottomChatFieldProps {
  chatroomId: string;
  onHeightChange: (height: number) => void;
  bottomSheetRef: React.RefObject<BottomSheetModal>;
}

const BottomChatField: React.FC<BottomChatFieldProps> = ({
  chatroomId,
  onHeightChange,
  bottomSheetRef,
}) => {
  const { isiOS } = useAppSelector((state) => state.global);
  const { currentChatroomId, currentChatroomUser } = useAppSelector(
    (state) => state.chatroom
  );
  const { currentUser } = useAppSelector((state) => state.user);
  const [isTyping, setIsTyping] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const MAX_HEIGHT = hp(6);

  const textChange = (text: string) => {
    setTextMessage(text);
    setIsTyping(text.length > 0);
  };

  const sendTextMessage = async () => {
    const newMessage: Partial<Message> = {
      senderId: currentUser.userId,
      receiverId: currentChatroomUser.userId,
      type: MessageEnum.TEXT,
      messageId: Appwrite.ID.unique(),
      text: textMessage,
      repliedMessage: null,
      repliedMessageId: null,
      repliedTo: null,
      seenAt: null,
      sentAt: Date.now().toString(),
      fileUrl: null,
      chatroomId: chatroomId,
      deleteMessageFor: [],
      isSeen: false,
      isEdited: false,
    };

    setTextMessage("");
    await chatApi.sendTextMessage(newMessage);
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
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => bottomSheetRef.current?.present()}
          >
            <Ionicons name="add-outline" size={wp(8)} />
          </TouchableOpacity>
        )}

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputContainer}
            multiline
            placeholder="Message"
            placeholderTextColor={Colors.grey}
            onChangeText={textChange}
            value={textMessage}
            onContentSizeChange={(event) => {
              const { height } = event.nativeEvent.contentSize;
              if (height <= MAX_HEIGHT) {
                onHeightChange(height + hp(4.9));
              } else {
                onHeightChange(MAX_HEIGHT + hp(4.9));
              }
            }}
          />
        </View>
        {!isTyping ? (
          <>
            <TouchableOpacity style={styles.button}>
              <Ionicons name="camera-outline" size={wp(7)} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {}}>
              <Ionicons name="happy-outline" size={wp(6)} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                width: isiOS ? hp(4) : hp(5.5),
                height: isiOS ? hp(4) : hp(5.5),
              },
            ]}
            onPress={sendTextMessage}
          >
            <Ionicons name="send" size={wp(5)} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    maxHeight: hp(10.2),
    padding: hp(1),
    backgroundColor: Colors.background,
  },
  inputWrapper: {
    backgroundColor: Colors.white,
    flex: 1,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: wp(2),
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    width: hp(4),
    height: hp(4),
  },
  inputContainer: {
    height: "100%",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    fontSize: wp(4),
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: hp(4),
    height: hp(4),
    elevation: 2,
    marginHorizontal: wp(0.5),
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
