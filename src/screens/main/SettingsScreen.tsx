import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppStackParamList, MainTabParamList } from "../../types/navigation";
import Colors from "../../styles/colors";
import ProfileHeader from "../../components/settings/ProfileHeader";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useAuth } from "../../contexts/AuthContext";
import { pickImageForProfile } from "@/src/utils/filePicker";
import { apiServices } from "../../services/api/apiServices";
import { showSnackbar } from "../../components/common/Snackbar";
import SettingItem, {
  profile,
  subItems,
  mainItems,
  support,
  renderSettingItems,
} from "../../components/settings/SettingItem";
import { useGlobalState } from "../../contexts/GlobalStateContext";
import ProfileEdit from "@/src/components/settings/ProfileEdit";

type SettingsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Settings">,
  NativeStackScreenProps<AppStackParamList>
>;

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const { isProfileEditing, setIsProfileEditing } = useGlobalState();

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
        showSnackbar("Failed to upload profile picture. Please try again");
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
        showSnackbar("Announcements");
        break;
      case "Devices":
        navigation.navigate("Devices");
        break;
      case "Account":
        showSnackbar("Account");
        break;
      case "Privacy & Security":
        showSnackbar("Privacy & Security");
        break;
      case "Chats":
        showSnackbar("Chats");
        break;
      case "Notifications":
        showSnackbar("Notifications");
        break;
      case "Storage and Data":
        showSnackbar("Storage and Data");
        break;
      case "Help":
        showSnackbar("Help");
        break;
      case "Tell a Friend":
        showSnackbar("Tell a Friend");
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
  }) => {
    try {
      //TODO: Update profile
      showSnackbar("Updating profile...");
      console.log(updatedProfile.name);
      console.log(updatedProfile.username);
    } catch (error) {
      showSnackbar("Failed to update profile. Please try again");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        overScrollMode="never"
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
    padding: wp("2%"),
    paddingTop: hp("6%"),
    backgroundColor: Colors.background,
    gap: hp("2%"),
  },
  scrollContent: {
    paddingBottom: hp("10%"),
  },
  itemText: {
    fontSize: wp("4.1%"),
    flex: 1,
  },
  block: {
    backgroundColor: "#fff",
    borderRadius: wp("2.5%"),
    marginHorizontal: wp("3.5%"),
    marginTop: hp("2.5%"),
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("2.5%"),
    gap: wp("2.7%"),
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.lightGray,
    marginLeft: wp("12.5%"),
  },
  logoutText: {
    color: Colors.primary,
    fontSize: 18,
    textAlign: "center",
  },
});

export default SettingsScreen;
