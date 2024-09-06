import React, { useEffect, useState, useCallback } from "react";
import { Alert, StyleSheet, Text, View, Button } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootStackParamList, MainTabParamList } from "../../types/navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/src/styles/colors";
import User from "@/src/model/User";
import { localdbServices } from "@/src/services/localdbServices";
import { apiServices } from "@/src/services/apiServices";
import database from "@/src/db/localdb";

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const fetchAndCreateUser = useCallback(async () => {
    try {
      const userData = await apiServices.getCurrentUserDocument();

      if (userData) {
        await localdbServices.createUserDataInLocalDb(userData);

        console.log("User data created in local database:", userData);
        Alert.alert("Success", "User data fetched and stored successfully");
      } else {
        console.log("No user data received from Appwrite");
        Alert.alert("Error", "Failed to fetch user data from Appwrite");
      }
    } catch (error) {
      console.error("Error fetching and creating user data:", error);
      Alert.alert("Error", "Failed to fetch and store user data");
    }
  }, []);

  const updateUserData = useCallback(async () => {
    try {
      const userData = await apiServices.getCurrentUserDocument();
      console.log("UserId:", userData.uid);
      if (userData && userData.uid) {
        const updatedUserData = {
          ...userData,
          name: userData.name + " Updated",
        };
        await localdbServices.updateUserDataInLocalDb(updatedUserData);
        console.log("User data updated in local database:", updatedUserData);
        Alert.alert("Success", "User data updated successfully");
      } else {
        console.log("No user data to update");
        Alert.alert("Error", "No user data available to update");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "Failed to update user data");
    }
  }, []);

  const logUsersData = useCallback(async () => {
    try {
      const users = await localdbServices.getAllUsersFromLocalDb();
      console.log("Users data in local database:", users);
      Alert.alert("Success", "Users data logged to console");
    } catch (error) {
      console.error("Error logging users data:", error);
      Alert.alert("Error", "Failed to log users data");
    }
  }, []);

  const checkUserInDb = useCallback(async () => {
    try {
      const userData = await apiServices.getCurrentUserDocument();
      if (userData && userData.uid) {
        const userExists = await localdbServices.checkUserExistsInLocalDb(
          userData.uid
        );
        if (userExists) {
          Alert.alert("User Check", "User exists in the local database");
        } else {
          Alert.alert(
            "User Check",
            "User does not exist in the local database"
          );
        }
      } else {
        Alert.alert("Error", "No user data available to check");
      }
    } catch (error) {
      console.error("Error checking user in database:", error);
      Alert.alert("Error", "Failed to check user in database");
    }
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Fetch and Create User" onPress={fetchAndCreateUser} />
      <Button title="Update User Data" onPress={updateUserData} />
      <Button title="Log Users Data" onPress={logUsersData} />
      <Button title="Check User in DB" onPress={checkUserInDb} />
      <Button
        title="Delete Users Database"
        onPress={async () => {
          try {
            await localdbServices.deleteAllUsersFromLocalDb();
            console.log("Users database deleted successfully");
            Alert.alert("Success", "Users database has been deleted");
          } catch (error) {
            console.error("Error deleting users database:", error);
            Alert.alert("Error", "Failed to delete users database");
          }
        }}
      />
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
});

export default HomeScreen;
