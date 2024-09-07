import * as ImagePicker from "expo-image-picker";
import { showSnackbar } from "../components/common/Snackbar";

export const pickImageForProfile = async (): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return null;

    const localUri = result.assets[0].uri;
    if (!localUri) {
      showSnackbar("Failed to pick image. Please try again.");
      return null;
    }

    return localUri;
  } catch (error) {
    showSnackbar("Failed to pick image. Please try again");
    return null;
  }
};
