import { View, StyleSheet, Text } from "react-native";
import React, { forwardRef, useMemo } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
export type Ref = BottomSheetModal;

const BottomFileShareSheet = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ["50%", "75%"], []);

  return (
    <BottomSheetModal ref={ref} index={0} snapPoints={snapPoints}>
      <View style={styles.contentContainer}>
        <Text style={styles.containerHeadline}>Bottom Modal 😎</Text>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: "600",
    padding: 20,
  },
});

export default BottomFileShareSheet;
