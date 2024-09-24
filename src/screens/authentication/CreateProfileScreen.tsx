import { Colors } from "@/src/styles/colors";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { wp, hp } from "@/src/styles/responsive";
import { ShowToast } from "@/src/components/common/ShowToast";
import TextInputBox from "@/src/components/common/TextInputBox";
import { AppStackParamList } from "@/src/types/navigation";
import User from "@/src/models/User";
import { pickImageForProfile } from "@/src/utils/filePicker";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { createAccount } from "@/src/redux/actions/authActions";
import { storageApi } from "@/src/services/api/storageApi";
import { userApi } from "@/src/services/api/userApi";

type CreateProfileScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "CreateProfile"
>;

const CreateProfileScreen: React.FC<CreateProfileScreenProps> = ({
  navigation,
}) => {
  const defaultProfileImage = require("../../../assets/images/defualt_user_image.png");
  const dispatch = useAppDispatch();
  const { userId, phoneNumber } = useAppSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [username, setUsername] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("");
  const [localProfileAvatarUri, setLocalProfileAvatarUri] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const localUri = await pickImageForProfile();
    if (localUri) {
      setLocalProfileAvatarUri(localUri);
      try {
        const avatarUrl = await storageApi.uploadProfileAvatar(
          userId!,
          localUri
        );
        setProfileAvatarUrl(avatarUrl);
      } catch (error) {
        ShowToast("error", "Profile Picture Upload Failed", "Please try again");
      }
    }
  };

  const handleCreateNewUser = async () => {
    if (name.trim() === "") {
      ShowToast(
        "error",
        "Profile Creation Failed",
        "Please enter a name to create your profile"
      );
      return;
    }

    if (username.trim() === "") {
      ShowToast("error", "Profile Creation Failed", "Please enter a username");
      return;
    }

    const isUsernameAvailable = await userApi.checkUsernameAvailability(
      username
    );

    if (!isUsernameAvailable) {
      ShowToast(
        "error",
        "Profile Creation Failed",
        "Username is already taken. Please choose a different one"
      );
      return;
    }

    if (localProfileAvatarUri !== "" && profileAvatarUrl === "") {
      ShowToast(
        "info",

        "Profile Picture Uploading",
        "Please wait. Your profile picture is being uploaded"
      );
      return;
    }

    try {
      setLoading(true);

      const newUser: Partial<User> = {
        userId: userId!,
        name: name,
        about:
          about ||
          "Simplify your chats with Quickgram - The easiest way to connect and chat with friends.",
        phoneNumber: phoneNumber!,
        createdAt: Date.now().toString(),
        lastSeenAt: Date.now().toString(),
        username: username,
        profileAvatarUrl: profileAvatarUrl || profileAvatarUrl,
        isOnline: true,
        isVerified: false,
      };

      await dispatch(createAccount(newUser));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      ShowToast(
        "error",
        "Profile Creation Failed",
        "Oops! Something went wrong while creating your account. Please contact the app developer for support!"
      );
    }
  };

  const handleUsernameChange = (text: string) => {
    const sanitizedUsername = text.toLowerCase().replace(/[^a-z0-9.]/g, "");
    setUsername(sanitizedUsername);
  };

  const handleNameChange = (text: string) => {
    const sanitizedName = text.replace(/[^a-zA-Z\s]/g, "");
    setName(sanitizedName);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.profileAvatarContainer}>
          <Image
            source={
              localProfileAvatarUri
                ? { uri: localProfileAvatarUri }
                : defaultProfileImage
            }
            style={styles.profileAvatar}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={styles.addAvatarButton}
            onPress={handlePickImage}
          >
            <Ionicons name="add-circle" size={wp(7.5)} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={wp(5)}
              color={Colors.grey}
              style={styles.inputIcon}
            />
            <TextInputBox
              value={name}
              placeholder="Name"
              onChangeText={handleNameChange}
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="at-outline"
              size={wp(5)}
              color={Colors.grey}
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
              size={wp(5)}
              color={Colors.grey}
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
            { marginBottom: hp(5), marginTop: hp(7.5) },
          ]}
          onPress={handleCreateNewUser}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={[styles.buttonText, name !== "" && styles.enabled]}>
              Next
            </Text>
          )}
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
    padding: wp(5),
    paddingTop: hp(6),
    backgroundColor: Colors.background,
    gap: hp(2),
  },
  inputContainer: {
    marginVertical: hp(3),
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: wp(2.5),
    marginVertical: wp(1.5),
    height: hp(6),
  },
  inputIcon: {
    paddingLeft: wp(3),
  },
  input: {
    flex: 1,
    marginLeft: wp(2),
    height: "100%",
    paddingVertical: 0,
  },
  profileAvatarContainer: {
    position: "relative",
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  profileAvatar: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(17.5),
  },
  addAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: wp(3.75),
    padding: wp(0.5),
  },
  button: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.lightGrey,
    padding: wp(2.5),
    borderRadius: wp(2.5),
  },
  enabled: {
    backgroundColor: Colors.primary,
    color: "#fff",
  },
  buttonText: {
    color: Colors.grey,
    fontSize: wp(5.5),
    fontWeight: "500",
  },
});
