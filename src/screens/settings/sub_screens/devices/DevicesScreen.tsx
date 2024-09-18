import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/src/types/navigation";
import { wp, hp } from "@/src/styles/responsive";
import { Colors } from "@/src/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import RenderDeviceBox from "@/src/components/settings/RenderDeviceBox";
import { apiServices } from "@/src/services/api/apiServices";
import { ShowToast } from "@/src/components/common/ShowToast";
import { useAppSelector } from "@/src/redux/hooks/useAppSelector";
import { SessionInfo } from "@/src/types/SessionTypes";
import { useAppDispatch } from "@/src/redux/hooks/useAppDispatch";
import { setActiveSessionsData } from "@/src/redux/reducers/sessionReducer";
type DevicesScreenProps = NativeStackScreenProps<AppStackParamList, "Devices">;

const DevicesScreen: React.FC<DevicesScreenProps> = () => {
  const { activeSessionsData } = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();
  const currentDevice = activeSessionsData!.sessions.find(
    (session: SessionInfo) => session.isCurrent
  );
  const otherDevices = activeSessionsData!.sessions.filter(
    (session: SessionInfo) => !session.isCurrent
  );

  const handleTerminateAllOtherSessions = async () => {
    if (!activeSessionsData) return;

    const currentSessionId = currentDevice?.sessionId;
    try {
      await Promise.all(
        otherDevices.map((session: SessionInfo) => {
          if (session.sessionId !== currentSessionId) {
            return apiServices.terminateSession(session.sessionId);
          }
        })
      );
      const newSessionsResponse = await apiServices.getAllActiveSessions();
      dispatch(setActiveSessionsData(newSessionsResponse));
      ShowToast(
        "success",
        "Success",
        "All other sessions have been terminated successfully."
      );
    } catch (error) {
      ShowToast(
        "error",
        "Failed",
        "An error occurred while terminating sessions. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        overScrollMode="always"
        bounces={true}
      >
        <Text style={styles.sectionTitle}>THIS DEVICE</Text>
        {currentDevice && <RenderDeviceBox session={currentDevice} />}
        {otherDevices.length > 0 && (
          <View style={styles.otherDevicesContainer}>
            <TouchableOpacity
              style={styles.terminateButton}
              onPress={handleTerminateAllOtherSessions}
            >
              <Ionicons
                name="hand-left-outline"
                size={wp(5)}
                color={Colors.red}
              />
              <Text style={styles.terminateText}>
                Terminate all other sessions
              </Text>
            </TouchableOpacity>
            <Text style={styles.terminateDescription}>
              Logs out all devices except for this one.
            </Text>

            <Text style={styles.sectionTitle}>ACTIVE SESSIONS</Text>
            {otherDevices.map((session: SessionInfo) => (
              <RenderDeviceBox key={session.sessionId} session={session} />
            ))}
          </View>
        )}
        <Text style={styles.appInfo}>
          The official Quickgram App is available for iPhone, iPad and Android
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: wp(2),
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: hp(10),
    paddingHorizontal: wp(2.2),
  },
  sectionTitle: {
    fontSize: wp(3.5),
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  otherDevicesContainer: {
    width: "100%",
    paddingHorizontal: wp(2),
  },
  terminateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: wp(3),
    marginTop: hp(1),
  },
  terminateText: {
    color: Colors.red,
    marginLeft: wp(2),
    fontSize: wp(4),
  },
  terminateDescription: {
    fontSize: wp(3.8),
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  appInfo: {
    fontSize: wp(3.6),
    marginVertical: hp(1),
  },
});

export default DevicesScreen;
