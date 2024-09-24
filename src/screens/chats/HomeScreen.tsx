import React, { useEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppStackParamList, MainTabParamList } from "../../types/navigation";
import { Colors } from "@/src/styles/colors";
import SearchBox from "./components/SearchBox";
import HomeScreenHeader from "./components/HomeScreenHeader";
import ChatUsersList from "./components/ChatUsersList";
import { useAppSelector } from "@/src/services/hooks/useAppSelector";
import { useAppDispatch } from "@/src/services/hooks/useAppDispatch";
import { setCurrentUser } from "@/src/redux/reducers/userReducer";
import { userApi } from "@/src/services/api/userApi";
import { localUserDb } from "@/src/services/db/localUserDb";

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<AppStackParamList>
>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const { hasInternetConnection } = useAppSelector((state) => state.global);

  useEffect(() => {
    if (hasInternetConnection) {
      let unsubscribe: (() => void) | null = null;
      if (currentUser?.userId) {
        unsubscribe = userApi.subscribeToMyUserDocumentChanges(
          currentUser.userId,
          async (updatedUser) => {
            dispatch(setCurrentUser(updatedUser));
            await localUserDb.upsertUserData(updatedUser);
          }
        );
      }

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [currentUser?.userId, setCurrentUser, hasInternetConnection, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <HomeScreenHeader navigation={navigation} />
      <SearchBox />
      <ChatUsersList navigation={navigation} />
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
