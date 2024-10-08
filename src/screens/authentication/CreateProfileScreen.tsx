import Colors from "@/src/styles/colors";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { showSnackbar } from "../../components/common/Snackbar";
import TextInputBox from "../../components/common/TextInputBox";
import { apiServices } from "../../services/api/apiServices";
import { AppStackParamList } from "../../types/navigation";
import User from "../../models/user";
import { useAuth } from "../../contexts/AuthContext";
import { pickImageForProfile } from "../../utils/filePicker";

type CreateProfileScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "CreateProfile"
>;

const CreateProfileScreen: React.FC<CreateProfileScreenProps> = ({
  navigation,
}) => {
  const defaultProfileImage = require("../../../assets/images/defualt_user_image.png");
  const { createAccount, userId, phoneNumber } = useAuth();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [username, setUsername] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [localProfilePictureUri, setLocalProfilePictureUri] = useState("");
  const defaultProfilePicture =
    "https://firebasestorage.googleapis.com/v0/b/quickgram-gbt-in.appspot.com/o/profile_pictures%2Fdefualt_user_image.png?alt=media&token=d6692ce7-ec63-4ff5-ae0e-ac403105a05d";

  const handlePickImage = async () => {
    const localUri = await pickImageForProfile();
    if (localUri) {
      setLocalProfilePictureUri(localUri);

      try {
        const photoUrl = await apiServices.uploadProfilePicture(
          userId!,
          localUri
        );
        setProfilePictureUrl(photoUrl);
      } catch (error) {
        showSnackbar("Failed to upload profile picture. Please try again");
      }
    }
  };

  const handleCreateNewUser = async () => {
    if (name.trim() === "") {
      showSnackbar("Please enter a name to create your profile");
      return;
    }

    if (username.trim() === "") {
      showSnackbar("Please enter a username");
      return;
    }

    const isUsernameAvailable = await apiServices.checkUsernameAvailability(
      username
    );

    if (!isUsernameAvailable) {
      showSnackbar("Username is already taken. Please choose a different one");
      return;
    }

    if (localProfilePictureUri !== "" && profilePictureUrl === "") {
      showSnackbar("Please wait. Your profile picture is being uploaded");
      return;
    }

    try {
      const newUser: Partial<User> = {
        uid: userId!,
        name: name,
        about:
          about ||
          "Simplify your chats with Quickgram - The easiest way to connect and chat with friends.",
        phone_number: phoneNumber!,
        createdAt: Date.now().toString(),
        is_online: true,
        is_verified: false,
        lastSeenAt: Date.now().toString(),
        username: username,
        profile_picture_url: profilePictureUrl || defaultProfilePicture,
      };

      await createAccount(newUser);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "MainTabs", params: { screen: "Home" } }],
        })
      );
    } catch (error) {
      showSnackbar(
        "Oops! Something went wrong while creating your account. Please contact the app developer for support!"
      );
    }
  };

  const handleUsernameChange = (text: string) => {
    const sanitizedUsername = text.toLowerCase().replace(/[^a-z0-9.]/g, "");
    setUsername(sanitizedUsername);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              localProfilePictureUri
                ? { uri: localProfilePictureUri }
                : defaultProfileImage
            }
            style={styles.profilePic}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={handlePickImage}
          >
            <Ionicons
              name="add-circle"
              size={wp("7.5%")}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={wp("5%")}
              color={Colors.gray}
              style={styles.inputIcon}
            />
            <TextInputBox
              value={name}
              placeholder="Name"
              onChangeText={setName}
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="at-outline"
              size={wp("5%")}
              color={Colors.gray}
              style={styles.inputIcon}
            />
            <TextInputBox
              value={username}
              placeholder="Username"
              onChangeText={handleUsernameChange}
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="information-circle-outline"
              size={wp("5%")}
              color={Colors.gray}
              style={styles.inputIcon}
            />
            <TextInputBox
              value={about}
              placeholder="About"
              onChangeText={setAbout}
              style={styles.input}
            />
          </View>
        </View>

        <View style={{ flex: 1 }}></View>

        <TouchableOpacity
          style={[
            styles.button,
            name !== "" && styles.enabled,
            { marginBottom: hp("5%"), marginTop: hp("7.5%") },
          ]}
          onPress={handleCreateNewUser}
        >
          <Text style={[styles.buttonText, name !== "" && styles.enabled]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: wp("5%"),
    paddingTop: hp("6%"),
    backgroundColor: Colors.background,
    gap: hp("2%"),
  },
  inputContainer: {
    marginVertical: hp("3%"),
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: wp("2.5%"),
    marginVertical: wp("1.5%"),
    height: hp("6%"),
  },
  inputIcon: {
    paddingLeft: wp("3%"),
  },
  input: {
    flex: 1,
    marginLeft: wp("2%"),
    height: "100%",
    paddingVertical: 0,
  },
  profileImageContainer: {
    position: "relative",
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
  },
  profilePic: {
    width: wp("35%"),
    height: wp("35%"),
    borderRadius: wp("17.5%"),
  },
  addImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: wp("3.75%"),
    padding: wp("0.5%"),
  },
  button: {
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
  buttonText: {
    color: Colors.gray,
    fontSize: wp("5.5%"),
    fontWeight: "500",
  },
});
