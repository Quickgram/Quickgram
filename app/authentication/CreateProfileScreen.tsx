import Colors from "@/src/styles/Colors";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import * as Appwrite from "../../src/appwrite/AppwriteConfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import defaultProfileImage from "../../assets/images/defualt_user_image.png";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

type CreateProfileScreenRouteParams = {
  userId: string;
  phoneNumber: string;
};

type CreateProfileScreenProps = NativeStackScreenProps<
  any,
  "CreateProfileScreen"
> & {
  route: {
    params: CreateProfileScreenRouteParams;
  };
};

const CreateProfileScreen: React.FC<CreateProfileScreenProps> = ({
  route,
  navigation,
}) => {
  const { phoneNumber } = route.params;
  const { userId } = route.params;
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [username, setUsername] = useState("");
  const createNewUser = async () => {
    try {
      await Appwrite.databases.createDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID!,
        process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
        userId,
        {
          name: name,
          about: about,
          phoneNumber: phoneNumber,
          uid: userId,
          createdAt: new Date().getTime().toString(),
          isOnline: true,
          isVerified: false,
          lastActive: new Date().getTime().toString(),
          profilePic: profileImageUrl || "default",
          username:
            username ||
            "Simplify your chats with Quickgram - The easiest way to connect and chat with friends.",
        }
      );
      await Appwrite.account.updateName(name);
      await SecureStore.setItemAsync("isSigned", "true");
      navigation.navigate("HomeScreen");
    } catch (error) {
      alert("Failed to create user profile. Please try again later.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.profileImageContainer}>
          <Image source={defaultProfileImage} style={styles.profilePic} />
          <TouchableOpacity style={styles.addImageButton}>
            <Ionicons name="add-circle" size={30} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <TextInput
          value={name}
          placeholder="Name"
          placeholderTextColor="#555"
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          value={username}
          placeholder="Username"
          placeholderTextColor="#555"
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          value={about}
          placeholder="About"
          placeholderTextColor="#555"
          onChangeText={setAbout}
          style={styles.input}
        />

        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            styles.button,
            name !== "" ? styles.enabled : null,
            { marginBottom: 20, marginTop: 30 },
          ]}
          onPress={createNewUser}
        >
          <Text
            style={[styles.buttonText, name !== "" ? styles.enabled : null]}
          >
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
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    backgroundColor: Colors.background,
    gap: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginTop: 20,
    marginBottom: 20,
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  addImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 2,
  },
  button: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    padding: 10,
    borderRadius: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
    color: "#fff",
  },
  buttonText: {
    color: Colors.gray,
    fontSize: 22,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    fontSize: 18,
    padding: 12,
    marginTop: 5,
    borderRadius: 16,
    borderColor: Colors.gray,
    borderWidth: 1,
  },
});
