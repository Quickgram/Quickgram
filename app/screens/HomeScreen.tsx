import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
import { account, databases } from "../../src/appwrite/AppwriteConfig";

const HomeScreen = () => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [about, setAbout] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);

        const userAbout = await databases.getDocument(
          process.env.EXPO_PUBLIC_DATABASE_ID!,
          process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!,
          currentUser.$id
        );
        setAbout(userAbout.about);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeScreen</Text>
      {user && (
        <>
          <Text style={styles.userInfo}>Name: {user.name}</Text>
          {user.phone && (
            <Text style={styles.userInfo}>Phone: {user.phone}</Text>
          )}
          {user.email && (
            <Text style={styles.userInfo}>Email: {user.email}</Text>
          )}
        </>
      )}
      {about && <Text style={styles.about}>About: {about}</Text>}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  about: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
});
