import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { wp, hp } from "@/src/styles/responsive";
import { Colors } from "../../styles/colors";
import { SessionInfo } from "@/src/types/SessionTypes";

interface RenderDeviceBoxProps {
  session: SessionInfo;
}

const RenderDeviceBox: React.FC<RenderDeviceBoxProps> = ({ session }) => {
  const deviceName = session.deviceModel
    ? session.deviceModel
    : session.deviceName
    ? session.deviceName
    : session.deviceBrand
    ? session.deviceBrand
    : "Unknown Device";
  const version = `${session.osName} ${session.osVersion}`;
  const location = `${session.ip} • ${session.countryName} • ${
    session.isCurrent
      ? "Online"
      : new Date(session.updatedAt).toLocaleDateString()
  }`;

  const isDeviceIOS = session.osName === "iOS";

  return (
    <View style={styles.deviceCard}>
      {isDeviceIOS ? (
        <Ionicons
          name="phone-portrait-outline"
          size={wp(7)}
          color={Colors.primary}
        />
      ) : (
        <MaterialIcons
          name="phone-android"
          size={wp(7)}
          color={Colors.primary}
        />
      )}
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{deviceName}</Text>
        <Text style={styles.deviceDetails}>{version}</Text>
        <Text style={styles.deviceLocation}>{location}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  deviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: wp(4),
    marginBottom: hp(1),
  },
  deviceInfo: {
    marginLeft: wp(3),
  },
  deviceName: {
    fontSize: wp(3.8),
    fontWeight: "bold",
  },
  deviceDetails: {
    fontSize: wp(3.5),
  },
  deviceLocation: {
    fontSize: wp(3.5),
  },
});

export default RenderDeviceBox;
