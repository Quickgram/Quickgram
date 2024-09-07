import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppStackParamList, MainTabParamList } from "../../types/navigation";
import Colors from "@/src/styles/colors";
import ProfileHeader from "../../components/settings/ProfileHeader";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { apiServices } from "../../services/api/apiServices";

type SettingScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Settings">,
  NativeStackScreenProps<AppStackParamList>
>;

const SettingScreen: React.FC<SettingScreenProps> = ({ navigation }) => {
  const name = "Sandipan SIngh";
  const phone = "+911234567890";
  const username = "sandipansm";

  const handleChangePhoto = () => {
    // Implement photo change logic
  };

  const handleGridPress = () => {
    // Implement grid press logic
  };

  const handleEditPress = () => {
    // Implement edit press logic
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <ProfileHeader
          name={name}
          phone={phone}
          username={username}
          onChangePhoto={handleChangePhoto}
          onGridPress={handleGridPress}
          onEditPress={handleEditPress}
        />
        {/* Add other setting items here */}
      </ScrollView>
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

export default SettingScreen;
