import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  renderAccountSettingItems,
  mainItems,
  subItems,
} from "@/src/components/settings/AccountSettingItem";
import { AppStackParamList } from "@/src/types/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import Colors from "@/src/styles/colors";

type AccountScreenProps = NativeStackScreenProps<AppStackParamList, "Account">;

const AccountScreen: React.FC<AccountScreenProps> = ({ navigation }) => {
  const { currentUser } = useAuth();

  const handleItemPress = (item: any) => {
    switch (item) {
      case "Email & Password":
        navigation.navigate("SetEmailAndPassword");
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
        overScrollMode="always"
        bounces={true}
      >
        {renderAccountSettingItems(mainItems, handleItemPress)}
        {renderAccountSettingItems(subItems, handleItemPress)}
      </ScrollView>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp("2%"),
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: hp("18%"),
  },
});
