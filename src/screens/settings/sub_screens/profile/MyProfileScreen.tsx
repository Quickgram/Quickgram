import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { wp, hp } from "@/src/styles/responsive";
import { Colors } from "@/src/styles/colors";
import { Image } from "expo-image";
import { AppStackParamList } from "@/src/types/navigation";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";

type MyProfileScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "MyProfile"
>;

const MyProfileScreen: React.FC<MyProfileScreenProps> = () => {
  const { currentUser } = useAppSelector((state) => state.user);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        overScrollMode="always"
        bounces={true}
      >
        <Image
          style={styles.profilePicture}
          source={{
            uri: currentUser?.profileAvatarUrl,
          }}
          placeholderContentFit="contain"
          cachePolicy="memory-disk"
        />
        <Text style={styles.name}>{currentUser?.name}</Text>
        <Text style={styles.activeStatus}>
          {currentUser?.isOnline ? "online" : "offline"}
        </Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Mobile</Text>
          <Text style={styles.infoValue}>{currentUser?.phoneNumber}</Text>
          <View style={styles.separator} />
          {currentUser?.email && (
            <>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{currentUser?.email}</Text>
              <View style={styles.separator} />
            </>
          )}
          <Text style={styles.infoLabel}>Username</Text>
          <Text style={styles.infoValue}>@{currentUser?.username}</Text>
          <View style={styles.separator} />

          <Text style={styles.infoLabel}>About</Text>
          <Text style={styles.aboutTextValue}>{currentUser?.about}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(2),
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: hp(10),
    paddingHorizontal: wp(2.2),
  },
  profilePicture: {
    width: wp(50),
    height: wp(50),
    alignSelf: "center",
    borderRadius: wp(25),
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: hp(1),
  },
  name: {
    fontSize: wp(6),
    fontWeight: "600",
    marginBottom: hp(0.2),
    textAlign: "center",
  },
  activeStatus: {
    fontSize: wp(4),
    color: Colors.darkGray,
    marginBottom: hp(3),
    textAlign: "center",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
  },
  infoLabel: {
    fontSize: wp(4),
    color: Colors.black,
    marginTop: hp(0.8),
    marginBottom: hp(0.41),
  },
  infoValue: {
    fontSize: wp(4.5),
    marginBottom: hp(1.2),
    color: Colors.secondary,
  },
  aboutTextValue: {
    fontSize: wp(4.5),
    marginBottom: hp(1.2),
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray,
  },
});
