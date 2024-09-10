import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppStackParamList, MainTabParamList } from "../../types/navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/src/styles/colors";
import { useAuth } from "../../contexts/AuthContext";
import { apiServices } from "@/src/services/api/apiServices";
import { localdbServices } from "@/src/services/db/localdbServices";

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<AppStackParamList>
>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (currentUser?.uid) {
      unsubscribe = apiServices.subscribeToUserDataChanges(
        currentUser.uid,
        async (updatedUser) => {
          setCurrentUser(updatedUser);
          await localdbServices.updateUserDataInLocaldb(updatedUser);
        }
      );
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser?.uid, setCurrentUser]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {currentUser?.name || "User"}!</Text>
      <Text>This is the Home Screen</Text>
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
  title: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    marginBottom: hp("2%"),
  },
  userInfo: {
    fontSize: wp("4%"),
    marginBottom: hp("1%"),
  },
  noUser: {
    fontSize: wp("4%"),
    color: Colors.gray,
  },
});

export default HomeScreen;
