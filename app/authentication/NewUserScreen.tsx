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
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import * as Appwrite from "react-native-appwrite";
import appwriteConfig from "../../src/appwrite/AppwriteConfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import profileImage from "../../assets/images/defualt_user_image.png";

type NewUserScreenRouteParams = {
  userId: string;
  phoneNumber: string;
};

type NewUserScreenProps = NativeStackScreenProps<any, "NewUserScreen"> & {
  route: {
    params: NewUserScreenRouteParams;
  };
};

const client = new Appwrite.Client();
client
  .setEndpoint(appwriteConfig.config.endpoint)
  .setProject(appwriteConfig.config.project);
const account = new Appwrite.Account(client);

const NewUserScreen: React.FC<NewUserScreenProps> = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const { userId } = route.params;
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");

  const createNewUser = async () => {};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={profileImage} style={styles.profilePic}></Image>

        <TextInput
          value={name}
          placeholder="Name"
          placeholderTextColor="#555"
          onChangeText={setName}
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

export default NewUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    backgroundColor: Colors.background,
    gap: 20,
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
    fontSize: 18, // Increased font size
    padding: 12, // Increased padding
    marginTop: 5,
    borderRadius: 16, // More rounded corners
    borderColor: Colors.gray,
    borderWidth: 1,
  },
  profilePic: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
    width: 140, // Smaller width
    height: 140, // Smaller height
    borderRadius: 70, // Adjusted to match the new width and height
  },
});
