import Message from "@/src/models/Message";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../../styles/colors";
import { formatTimeForMessages } from "@/src/utils/timeConverter";

interface MessageBubbleProps {
  message: Partial<Message>;
  currentUserId: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUserId,
}) => {
  const isMultipleLines =
    typeof message.text === "string" && message.text.length > 35;
  const isOwnMessage = message.senderId === currentUserId;

  return (
    <View
      style={[
        styles.bubble,
        {
          backgroundColor: isOwnMessage
            ? Colors.rightMessageBox
            : Colors.leftMessageBox,
          alignSelf: isOwnMessage ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View
        style={[
          styles.messageContainer,
          { flexDirection: isMultipleLines ? "column" : "row" },
        ]}
      >
        <Text>{message.text}</Text>
        <View style={styles.timestampContainer}>
          <Text style={styles.timestamp}>
            {formatTimeForMessages(message.sentTime!)}
          </Text>
          <View style={styles.seenContainer}>
            {isOwnMessage &&
              (message.is_seen ? (
                <Ionicons
                  name="checkmark-done-outline"
                  size={13}
                  color="black"
                />
              ) : (
                <Ionicons name="checkmark-outline" size={13} color="black" />
              ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  messageContainer: {
    alignItems: "flex-end",
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 10,
    color: "#666",
    marginLeft: 5,
    flexShrink: 0,
  },
  seenContainer: {
    marginLeft: 2,
    flexShrink: 0,
  },
});

export { MessageBubble };
