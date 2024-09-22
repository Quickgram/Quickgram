import * as SecureStore from "expo-secure-store";

export const secureStorageService = {
  saveItemData: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },

  saveSignedStatus: async (value: string) => {
    await SecureStore.setItemAsync("isSigned", value);
  },

  saveCurrentUserId: async (value: string) => {
    await SecureStore.setItemAsync("currentUserId", value);
  },

  getSignedStatus: async () => {
    return await SecureStore.getItemAsync("isSigned");
  },

  getCurrentUserId: async () => {
    return await SecureStore.getItemAsync("currentUserId");
  },

  getItemData: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },

  deleteItemData: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};
