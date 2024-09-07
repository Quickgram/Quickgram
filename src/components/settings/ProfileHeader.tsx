import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/src/styles/colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface ProfileHeaderProps {
  name: string;
  phone: string;
  username: string;
  profile_picture_url: string;
  onChangePhoto: () => void;
  onGridPress: () => void;
  onEditPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  phone,
  username,
  profile_picture_url,
  onChangePhoto,
  onGridPress,
  onEditPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerButton}>
        <TouchableOpacity onPress={onGridPress}>
          <Ionicons name="grid-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onEditPress}>
          <Ionicons name="create-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <Image
        source={{
          uri: profile_picture_url,
        }}
        style={styles.profilePicture}
      />
      <Text style={styles.profileName}>{name}</Text>
      <Text style={styles.profileInfo}>{`${phone} • ${username}`}</Text>
      <TouchableOpacity
        style={styles.changePhotoButton}
        onPress={onChangePhoto}
      >
        <Ionicons name="camera-outline" size={20} color={Colors.primary} />
        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: hp("1%"),
  },
  headerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: wp("2%"),
    marginBottom: hp("2%"),
  },
  profilePicture: {
    width: wp("25%"),
    height: wp("25%"),
    borderRadius: wp("12.5%"),
  },
  profileName: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    marginTop: hp("1%"),
  },
  profileInfo: {
    fontSize: wp("3.5%"),
    color: Colors.gray,
    marginTop: hp("0.5%"),
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1%"),
  },
  changePhotoText: {
    color: Colors.primary,
    marginLeft: wp("1%"),
    fontSize: wp("3.5%"),
  },
});

export default ProfileHeader;
