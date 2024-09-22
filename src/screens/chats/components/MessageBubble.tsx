import Message from "@/src/models/Message";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Colors } from "../../../styles/colors";
import { formatTimeForMessages } from "@/src/utils/timeConverter";
import { wp, hp } from "@/src/styles/responsive";

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
    <TouchableOpacity>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isOwnMessage
              ? Colors.rightMessageBox
              : Colors.leftMessageBox,
            alignSelf: isOwnMessage ? "flex-end" : "flex-start",
            maxWidth: wp(80),
          },
        ]}
      >
        <View
          style={[
            styles.messageContainer,
            { flexDirection: isMultipleLines ? "column" : "row" },
          ]}
        >
          <Text style={{ fontSize: wp(3.7) }}>{message.text}</Text>
          <View
            style={[
              styles.timestampContainer,
              { paddingTop: isMultipleLines ? 3 : 0 },
            ]}
          >
            <Text style={styles.timestamp}>
              {formatTimeForMessages(message.sentAt!)}
            </Text>
            <View style={styles.seenContainer}>
              {isOwnMessage &&
                (message.isSeen ? (
                  <Ionicons
                    name="checkmark-done-outline"
                    size={wp(3)}
                    color={Colors.primary}
                  />
                ) : (
                  <Ionicons
                    name="checkmark-outline"
                    size={wp(3)}
                    color={Colors.black}
                  />
                ))}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: wp(2.5),
    margin: wp(0.9),
    borderRadius: wp(2.5),
  },
  messageContainer: {
    alignItems: "flex-end",
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    fontSize: wp(2.5),
    color: "#666",
    marginLeft: wp(1.25),
    flexShrink: 0,
  },
  seenContainer: {
    marginLeft: wp(0.5),
    flexShrink: 0,
  },
});

export { MessageBubble };
