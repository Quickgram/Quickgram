import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppStackParamList, MainTabParamList } from "../../types/navigation";
import { Colors } from "../../styles/colors";
import ProfileHeader from "./components/ProfileHeader";
import { wp, hp } from "@/src/styles/responsive";
import { pickImageForProfile } from "@/src/utils/filePicker";
import {
  profile,
  subItems,
  mainItems,
  support,
  renderSettingItems,
} from "./components/SettingItem";
import ProfileEdit from "@/src/screens/settings/components/ProfileEdit";
import { ShowToast } from "@/src/components/common/ShowToast";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
import { storageApi } from "@/src/services/api/storageApi";
import { userApi } from "@/src/services/api/userApi";
import {
  setIsProfileEditing,
  setIsProfileUpdating,
} from "@/src/redux/reducers/globalReducer";
import { resetLocalDb } from "@/src/services/db/resetLocalDb";
import { secureStorageService } from "@/src/services/storage/secureStore";
import { authApi } from "@/src/services/api/authApi";

type SettingsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Settings">,
  NativeStackScreenProps<AppStackParamList>
>;

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isProfileEditing, isProfileUpdating, isiOS, hasInternetConnection } =
    useAppSelector((state) => state.global);
  const { currentUser } = useAppSelector((state) => state.user);

  const handleChangeAvatar = async () => {
    const localUri = await pickImageForProfile();
    if (localUri) {
      try {
        const photoUrl = await storageApi.uploadProfileAvatar(
          currentUser!.userId,
          localUri
        );
        await userApi.updateProfileAvatar(photoUrl);
      } catch (error) {
        ShowToast(
          "error",
          "Profile Picture Upload Failed",
          "Failed to upload profile picture. Please try again"
        );
      }
    }
  };

  const handleGridPress = async () => {
    await resetLocalDb.resetLocalDatabase();
    console.log("Local database reset");
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
    dispatch(setIsProfileEditing(true));
  };

  const handleUpdatePress = async (updatedProfile: {
    name: string;
    username: string;
    about: string;
  }) => {
    try {
      dispatch(setIsProfileUpdating(true));
      if (
        updatedProfile.name !== currentUser!.name &&
        updatedProfile.username !== currentUser!.username &&
        updatedProfile.about !== currentUser!.about
      ) {
        const isUsernameAvailable = await userApi.checkUsernameAvailability(
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
        await userApi.updateNameAndUsernameAndAbout(
          updatedProfile.name,
          updatedProfile.username,
          updatedProfile.about
        );
      } else if (updatedProfile.name !== currentUser!.name) {
        await userApi.updateName(updatedProfile.name);
      } else if (updatedProfile.username !== currentUser!.username) {
        const isUsernameAvailable = await userApi.checkUsernameAvailability(
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
        await userApi.updateUsername(updatedProfile.username);
      } else if (updatedProfile.about !== currentUser!.about) {
        await userApi.updateAbout(updatedProfile.about);
      }
      dispatch(setIsProfileUpdating(false));
    } catch (error) {
      dispatch(setIsProfileUpdating(false));
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
          phone={currentUser!.phoneNumber}
          username={currentUser!.username}
          profileAvatarUrl={currentUser!.profileAvatarUrl}
          onChangeAvatar={handleChangeAvatar}
          onGridPress={handleGridPress}
          onEditPress={handleEditPress}
          onCancelPress={() => dispatch(setIsProfileEditing(false))}
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
