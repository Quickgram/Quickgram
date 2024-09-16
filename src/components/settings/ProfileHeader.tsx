import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/styles/colors";
import { wp, hp } from "@/src/styles/responsive";
import { Image } from "expo-image";
import { useGlobalState } from "@/src/contexts/GlobalStateContext";

interface ProfileHeaderProps {
  name: string;
  phone: string;
  username: string;
  profile_picture_url: string;
  onChangePhoto: () => void;
  onGridPress: () => void;
  onEditPress: () => void;
  onCancelPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  phone,
  username,
  profile_picture_url,
  onChangePhoto,
  onGridPress,
  onEditPress,
  onCancelPress,
}) => {
  const { isProfileEditing } = useGlobalState();
  return (
    <View style={styles.container}>
      <View style={styles.headerButton}>
        <TouchableOpacity onPress={onGridPress}>
          <Ionicons name="grid-outline" size={wp(6)} color={Colors.primary} />
        </TouchableOpacity>
        {isProfileEditing ? (
          <TouchableOpacity onPress={onCancelPress}>
            <Text style={{ color: Colors.primary, fontSize: wp(4) }}>
              Cancel
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onEditPress}>
            <Ionicons
              name="create-outline"
              size={wp(6)}
              color={Colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      <Image
        style={styles.profilePicture}
        source={{
          uri: profile_picture_url,
        }}
        placeholderContentFit="contain"
        cachePolicy="memory-disk"
      />
      <Text style={styles.profileName}>{name}</Text>
      <Text style={styles.profileInfo}>{`${phone} • @${username}`}</Text>
      <TouchableOpacity
        style={styles.changePhotoButton}
        onPress={onChangePhoto}
      >
        <Ionicons name="camera-outline" size={wp(5)} color={Colors.primary} />
        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: hp(1),
  },
  headerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: wp(2),
    marginBottom: hp(2),
  },
  profilePicture: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(15),
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profileName: {
    fontSize: wp(5),
    fontWeight: "bold",
    marginTop: hp(1),
  },
  profileInfo: {
    fontSize: wp(3.5),
    color: Colors.gray,
    marginTop: hp(0.5),
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
  },
  changePhotoText: {
    color: Colors.primary,
    marginLeft: wp(1),
    fontSize: wp(3.5),
  },
});

export default ProfileHeader;
