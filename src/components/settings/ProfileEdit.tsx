import React, { useState } from "react";
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
import { showSnackbar } from "../common/Snackbar";

interface ProfileEditProps {
  name: string;
  username: string;
  onUpdatePress: (updatedProfile: { name: string; username: string }) => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({
  name,
  username,
  onUpdatePress,
}) => {
  const [editedName, setEditedName] = useState(name);
  const [editedUsername, setEditedUsername] = useState(username);

  const handleUpdatePress = () => {
    if (editedName.length < 2) {
      showSnackbar("Name must be at least 2 characters");
      return;
    }
    if (editedUsername.length < 1) {
      showSnackbar("Username must be at least 1 character");
      return;
    }

    onUpdatePress({
      name: editedName,
      username: editedUsername,
    });
  };

  const handleUsernameChange = (text: string) => {
    const sanitizedUsername = text.toLowerCase().replace(/[^a-z0-9.]/g, "");
    setEditedUsername(sanitizedUsername);
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
          onChangeText={setEditedName}
          placeholder="Name"
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
        />
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePress}>
        <Text style={styles.updateButtonText}>Update</Text>
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
    backgroundColor: Colors.primary,
    padding: wp("2.5%"),
    borderRadius: wp("2.5%"),
  },
  updateButtonText: {
    color: Colors.white,
    fontSize: wp("4%"),
    fontWeight: "bold",
  },
});

export default ProfileEdit;
