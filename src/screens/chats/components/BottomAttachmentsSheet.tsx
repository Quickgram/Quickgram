import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { Colors } from "@/src/styles/colors";
import { hp, wp } from "@/src/styles/responsive";
import { FlashList } from "@shopify/flash-list";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";

export type Ref = BottomSheetModal;

const BottomAttachmentsSheet = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ["35%", "50%"], []);
  const { currentChatroomId, currentChatroomUser } = useAppSelector(
    (state) => state.chatroom
  );
  const { currentUser } = useAppSelector((state) => state.user);

  const renderAttachmentItem = ({
    icon,
    title,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.attachmentItem}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: Colors.lightBlue,
            },
          ]}
        >
          <Ionicons name={icon} size={28} color={Colors.secondary} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: Colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      handleIndicatorStyle={{ display: "none" }}
    >
      <View style={styles.container}>
        {renderAttachmentItem({
          icon: "images-outline",
          title: "Photos",
          onPress: async () => {
            console.log("Photos");
          },
        })}
        {renderAttachmentItem({
          icon: "videocam-outline",
          title: "Videos",
          onPress: async () => {
            console.log("Videos");
          },
        })}
        {renderAttachmentItem({
          icon: "document-outline",
          title: "Documents",
          onPress: async () => {
            console.log("Documents");
          },
        })}
        {renderAttachmentItem({
          icon: "musical-note-outline",
          title: "Audio",
          onPress: async () => {
            console.log("Audio");
          },
        })}
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(4),
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default BottomAttachmentsSheet;
