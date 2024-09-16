import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Platform } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppStackParamList, MainTabParamList } from "../../types/navigation";
import { Colors } from "@/src/styles/colors";
import { useAuth } from "../../contexts/AuthContext";
import { apiServices } from "@/src/services/api/apiServices";
import { localdbServices } from "@/src/services/db/localdbServices";
import SearchBox from "./components/SearchBox";
import { useGlobalState } from "@/src/contexts/GlobalStateContext";
import User from "@/src/models/User";
import HomeScreenHeader from "./components/HomeScreenHeader";
import ChatUsersList from "./components/ChatUsersList";

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<AppStackParamList>
>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { currentUser, setCurrentUser } = useAuth();
  const { setCurrentChatUser, setCurrentChatId } = useGlobalState();
  const [chattedUsers, setChattedUsers] = useState<User[]>([]);
  const chattedUsersIds = currentUser?.chatted_users || [];
  const {
    homeScreenSearchQuery,
    isHomeScreenScrolling,
    setIsHomeScreenScrolling,
  } = useGlobalState();

  useEffect(() => {
    const fetchChattedUsers = async () => {
      const chattedUsersData = await apiServices.getChattedUsers(
        chattedUsersIds
      );
      setChattedUsers(chattedUsersData as User[]);
    };

    fetchChattedUsers();
  }, []);

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
    <SafeAreaView style={styles.container}>
      <HomeScreenHeader />
      <SearchBox />
      <ChatUsersList
        currentUser={currentUser!}
        chattedUsers={chattedUsers}
        setCurrentChatUser={setCurrentChatUser}
        navigation={navigation}
        setCurrentChatId={setCurrentChatId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default HomeScreen;
