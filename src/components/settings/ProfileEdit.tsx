import React, { useMemo, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/src/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { ShowToast } from "../common/ShowToast";
import { useGlobalState } from "@/src/contexts/GlobalStateContext";

interface ProfileEditProps {
  name: string;
  username: string;
  about: string;
  onUpdatePress: (updatedProfile: {
    name: string;
    username: string;
    about: string;
  }) => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({
  name,
  username,
  about,
  onUpdatePress,
}) => {
  const [editedName, setEditedName] = useState(name);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedAbout, setEditedAbout] = useState(about);
  const { isProfileUpdating } = useGlobalState();

  const isButtonEnabled = useMemo(
    () =>
      (editedName !== name && editedName.length >= 2) ||
      (editedUsername !== username && editedUsername.length >= 1) ||
      (editedAbout !== about && editedAbout.length >= 1),
    [editedName, editedUsername, editedAbout, name, username, about]
  );

  const handleUpdatePress = () => {
    if (editedName.length < 2) {
      ShowToast("error", "Name", "must be at least 2 characters");
      return;
    }
    if (editedUsername.length < 1) {
      ShowToast("error", "Username", "must be at least 1 character");
      return;
    }
    if (editedAbout.length < 1) {
      ShowToast("error", "About", "must be at least 1 character");
      return;
    }

    onUpdatePress({
      name: editedName,
      username: editedUsername,
      about: editedAbout,
    });
  };

  const handleUsernameChange = (text: string) => {
    const sanitizedUsername = text.toLowerCase().replace(/[^a-z0-9.]/g, "");
    setEditedUsername(sanitizedUsername);
  };

  const handleNameChange = (text: string) => {
    const sanitizedName = text.replace(/[^a-zA-Z\s]/g, "");
    setEditedName(sanitizedName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={wp("6%")}
          color={Colors.gray}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={editedName}
          onChangeText={handleNameChange}
          placeholder="Name"
          placeholderTextColor={Colors.lightGray}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="at-outline"
          size={wp("6%")}
          color={Colors.gray}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={editedUsername}
          onChangeText={handleUsernameChange}
          placeholder="Username"
          placeholderTextColor={Colors.lightGray}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="information-circle-outline"
          size={wp("6%")}
          color={Colors.gray}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={editedAbout}
          onChangeText={setEditedAbout}
          placeholder="Username"
          placeholderTextColor={Colors.lightGray}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.updateButton,
          isButtonEnabled && styles.enabled,
          { marginBottom: hp("2%"), marginTop: hp("2%") },
        ]}
        onPress={handleUpdatePress}
        disabled={!isButtonEnabled || isProfileUpdating}
      >
        {isProfileUpdating ? (
          <ActivityIndicator color={Colors.background} />
        ) : (
          <Text
            style={[styles.updateButtonText, isButtonEnabled && styles.enabled]}
          >
            Update
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: wp("4%"),
    marginTop: hp("2%"),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: wp("3%"),
    marginBottom: hp("2%"),
    paddingHorizontal: wp("3%"),
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  icon: {
    marginRight: wp("2%"),
  },
  input: {
    flex: 1,
    padding: wp("3%"),
    fontSize: wp("4%"),
  },
  updateButton: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    padding: wp("2.5%"),
    borderRadius: wp("2.5%"),
  },
  enabled: {
    backgroundColor: Colors.primary,
    color: "#fff",
  },
  updateButtonText: {
    color: Colors.gray,
    fontSize: wp("5.5%"),
    fontWeight: "500",
  },
});

export default ProfileEdit;
