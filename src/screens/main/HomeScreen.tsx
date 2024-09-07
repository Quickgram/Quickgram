import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppStackParamList, MainTabParamList } from "../../types/navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/src/styles/colors";
import { CurrentUserContext } from "@/src/contexts/CurrentUserContext";

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<AppStackParamList>
>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const currentUser = useContext(CurrentUserContext);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      {currentUser ? (
        <>
          <Text style={styles.userInfo}>Name: {currentUser.name}</Text>
          <Text style={styles.userInfo}>Username: {currentUser.username}</Text>
          <Text style={styles.userInfo}>About: {currentUser.about}</Text>
          <Text style={styles.userInfo}>Phone: {currentUser.phone_number}</Text>
          <Text style={styles.userInfo}>Email: {currentUser.email}</Text>
        </>
      ) : (
        <Text style={styles.noUser}>No user information available</Text>
      )}
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
