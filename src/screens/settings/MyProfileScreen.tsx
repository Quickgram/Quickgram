import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../types/navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../styles/colors";
import { useAuth } from "../../contexts/AuthContext";
import FastImage from "react-native-fast-image";

type MyProfileScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "MyProfile"
>;

const MyProfileScreen: React.FC<MyProfileScreenProps> = () => {
  const { currentUser } = useAuth();

  return (
    <View style={styles.container}>
      <FastImage
        style={styles.profilePicture}
        source={{
          uri: currentUser?.profile_picture_url,
          cache: FastImage.cacheControl.immutable,
        }}
      />
      <Text style={styles.name}>{currentUser?.name}</Text>
      <Text style={styles.activeStatus}>
        {currentUser?.is_online ? "online" : "offline"}
      </Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>mobile</Text>
        <Text style={styles.infoValue}>{currentUser?.phone_number}</Text>
        <View style={styles.separator} />

        {currentUser?.email && (
          <>
            <Text style={styles.infoLabel}>email</Text>
            <Text style={styles.infoValue}>{currentUser?.email}</Text>
            <View style={styles.separator} />
          </>
        )}

        <Text style={styles.infoLabel}>username</Text>
        <Text style={styles.infoValue}>@{currentUser?.username}</Text>
        <View style={styles.separator} />

        <Text style={styles.infoLabel}>About</Text>
        <Text style={styles.aboutTextValue}>{currentUser?.about}</Text>
      </View>
    </View>
  );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: wp("5%"),
    backgroundColor: Colors.background,
  },
  profilePicture: {
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: wp("15%"),
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: hp("1%"),
  },
  name: {
    fontSize: wp("6%"),
    fontWeight: "600",
    marginBottom: hp("0.2%"),
  },
  activeStatus: {
    fontSize: wp("4%"),
    color: Colors.darkGray,
    marginBottom: hp("3%"),
  },
  infoContainer: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: wp("3%"),
    paddingHorizontal: wp("4%"),
  },
  infoLabel: {
    fontSize: wp("4%"),
    color: Colors.gray,
    marginTop: hp("0.8%"),
    marginBottom: hp("0.41%"),
  },
  infoValue: {
    fontSize: wp("4.5%"),
    marginBottom: hp("1.2%"),
    color: Colors.secondary,
  },
  aboutTextValue: {
    fontSize: wp("4.5%"),
    marginBottom: hp("1.2%"),
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray,
  },
});
