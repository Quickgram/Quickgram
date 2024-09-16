import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppStackParamList, MainTabParamList } from "../../types/navigation";
import { Colors } from "../../styles/colors";
import ProfileHeader from "../../components/settings/ProfileHeader";
import { wp, hp } from "@/src/styles/responsive";
import { pickImageForProfile } from "@/src/utils/filePicker";
import { apiServices } from "../../services/api/apiServices";
import {
  profile,
  subItems,
  mainItems,
  support,
  renderSettingItems,
} from "../../components/settings/SettingItem";
import { useGlobalState } from "../../contexts/GlobalStateContext";
import ProfileEdit from "@/src/components/settings/ProfileEdit";
import { ShowToast } from "@/src/components/common/ShowToast";
import { useAuth } from "@/src/contexts/AuthContext";

type SettingsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Settings">,
  NativeStackScreenProps<AppStackParamList>
>;

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { isProfileEditing, setIsProfileEditing, setIsProfileUpdating } =
    useGlobalState();

  const handleChangePhoto = async () => {
    const localUri = await pickImageForProfile();
    if (localUri) {
      try {
        const photoUrl = await apiServices.uploadProfilePicture(
          currentUser!.uid,
          localUri
        );
        await apiServices.updateProfilePicture(currentUser!.uid, photoUrl);
      } catch (error) {
        ShowToast(
          "error",
          "Profile Picture Upload Failed",
          "Failed to upload profile picture. Please try again"
        );
      }
    }
  };

  const handleGridPress = () => {
    // Implement grid press logic
  };

  const handleItemPress = (item: any) => {
    switch (item) {
      case "My Profile":
        navigation.navigate("MyProfile");
        break;
      case "Announcements":
        navigation.navigate("Announcements");
        break;
      case "Devices":
        navigation.navigate("Devices");
        break;
      case "Account":
        navigation.navigate("Account");
        break;
      case "Privacy & Security":
        ShowToast("info", "Privacy & Security", "Privacy & Security");
        break;
      case "Chats":
        ShowToast("info", "Chats", "Chats");
        break;
      case "Notifications":
        ShowToast("info", "Notifications", "Notifications");
        break;
      case "Storage":
        ShowToast("info", "Storage", "Storage");
        break;
      case "Help":
        ShowToast("info", "Help", "Help");
        break;
      case "Invite":
        ShowToast("success", "Invite", "Invite");
        break;
      default:
        break;
    }
  };

  const handleEditPress = () => {
    setIsProfileEditing(true);
  };

  const handleUpdatePress = async (updatedProfile: {
    name: string;
    username: string;
    about: string;
  }) => {
    try {
      setIsProfileUpdating(true);
      if (
        updatedProfile.name !== currentUser!.name &&
        updatedProfile.username !== currentUser!.username &&
        updatedProfile.about !== currentUser!.about
      ) {
        const isUsernameAvailable = await apiServices.checkUsernameAvailability(
          updatedProfile.username
        );
        if (!isUsernameAvailable) {
          ShowToast(
            "error",
            "Profile Update Failed",
            "Username is already taken. Please choose a different one"
          );
          return;
        }
        await apiServices.updateNameAndUsernameAndAbout(
          currentUser!.uid,
          updatedProfile.name,
          updatedProfile.username,
          updatedProfile.about
        );
      } else if (updatedProfile.name !== currentUser!.name) {
        await apiServices.updateName(currentUser!.uid, updatedProfile.name);
      } else if (updatedProfile.username !== currentUser!.username) {
        const isUsernameAvailable = await apiServices.checkUsernameAvailability(
          updatedProfile.username
        );
        if (!isUsernameAvailable) {
          ShowToast(
            "error",
            "Profile Update Failed",
            "Username is already taken. Please choose a different one"
          );
          return;
        }
        await apiServices.updateUsername(
          currentUser!.uid,
          updatedProfile.username
        );
      } else if (updatedProfile.about !== currentUser!.about) {
        await apiServices.updateAbout(currentUser!.uid, updatedProfile.about);
      }
      setIsProfileUpdating(false);
    } catch (error) {
      setIsProfileUpdating(false);
      ShowToast(
        "error",
        "Profile Update Failed",
        "Failed to update profile. Please try again"
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        overScrollMode="always"
        bounces={true}
      >
        <ProfileHeader
          name={currentUser!.name}
          phone={currentUser!.phone_number}
          username={currentUser!.username}
          profile_picture_url={currentUser!.profile_picture_url}
          onChangePhoto={handleChangePhoto}
          onGridPress={handleGridPress}
          onEditPress={handleEditPress}
          onCancelPress={() => setIsProfileEditing(false)}
        />

        {isProfileEditing ? (
          <ProfileEdit
            name={currentUser!.name}
            username={currentUser!.username}
            about={currentUser!.about}
            onUpdatePress={handleUpdatePress}
          />
        ) : (
          <>
            {renderSettingItems(profile, handleItemPress)}
            {renderSettingItems(subItems, handleItemPress)}
            {renderSettingItems(mainItems, handleItemPress)}
            {renderSettingItems(support, handleItemPress)}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: wp(2),
    paddingTop: hp(6),
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: hp(18),
  },
});

export default SettingsScreen;
