import { AppDispatch, RootState } from "../store/store";
import { authApi } from "../../services/api/authApi";
import { secureStorageService } from "../../services/storage/secureStore";
import { userApi } from "../../services/api/userApi";
import { localUserDb } from "../../services/db/localUserDb";
import { resetLocalDb } from "@/src/services/db/resetLocalDb";

import {
  setAuthenticated,
  setUserId,
  setPhoneNumber,
  setIsNewUser,
  resetAuth,
} from "../reducers/authReducer";
import { setCurrentUser } from "../reducers/userReducer";
import { setActiveSessionsData } from "../reducers/sessionReducer";
import { ShowToast } from "../../components/common/ShowToast";
import User from "@/src/models/User";
import * as Appwrite from "../../config/appwrite";

export const checkAuthStatus = () => async (dispatch: AppDispatch) => {
  const isSigned = await secureStorageService.getSignedStatus();
  if (isSigned === "true") {
    try {
      const sessionsResponse = await authApi.getAllActiveSessions();
      dispatch(setActiveSessionsData(sessionsResponse));

      const localdbUserData = await localUserDb.getCurrentUserData();
      if (localdbUserData) {
        dispatch(setCurrentUser(localdbUserData));
        dispatch(setAuthenticated(true));
      } else {
        const apiUserData = await userApi.fetchCurrentUserDocument();
        if (apiUserData) {
          dispatch(setCurrentUser(apiUserData));
          dispatch(setAuthenticated(true));
          await localUserDb.upsertUserData(apiUserData);
        }
      }
    } catch (error) {
      dispatch(setAuthenticated(false));
      await resetLocalDb.resetLocalDatabase();
      await secureStorageService.saveSignedStatus("false");
      await secureStorageService.saveCurrentUserId("");
    }
  }
};

export const initiatePhoneLogin =
  (phoneNumber: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { userId } = await authApi.createPhoneToken(
        Appwrite.ID.unique(),
        `+91${phoneNumber}`
      );
      dispatch(setUserId(userId));
      dispatch(setPhoneNumber(`+91${phoneNumber}`));
      return userId;
    } catch (error) {
      ShowToast("error", "Failed", "Failed to send OTP. Please try again.");
      throw error;
    }
  };

export const verifyOtp =
  (code: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { userId } = getState().auth;
    if (!userId) {
      ShowToast(
        "error",
        "Login Failed",
        "An unexpected error occurred. Please try again."
      );
      return;
    }

    try {
      await authApi.createSession(userId, code);

      const userData = await userApi.fetchUserDocumentById(userId);
      if (userData) {
        dispatch(setIsNewUser(false));
        dispatch(setCurrentUser(userData));
        await secureStorageService.saveSignedStatus("true");
        await secureStorageService.saveCurrentUserId(userId);
        await userApi.updateUserActiveStatus(true);
        const sessionsResponse = await authApi.getAllActiveSessions();
        dispatch(setActiveSessionsData(sessionsResponse));
        dispatch(setAuthenticated(true));
        await localUserDb.upsertUserData(userData as User);
      }
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes(
          "Rate limit for the current endpoint has been exceeded"
        )
      ) {
        ShowToast(
          "error",
          "Login Failed",
          "Too many requests. Please try again after some time."
        );
      } else {
        ShowToast("error", "Login Failed", "Incorrect OTP. Please try again.");
      }
    }
  };

export const createAccount =
  (userData: Partial<User>) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { userId } = getState().auth;
    try {
      if (!userId) {
        ShowToast(
          "error",
          "Account Creation Failed",
          "An unexpected error occurred. Please try again."
        );
        return;
      }
      const newUser = await userApi.createNewUser(userId, userData);
      if (newUser) {
        dispatch(setCurrentUser(newUser));
        await userApi.updateName(newUser.name!);
        await secureStorageService.saveCurrentUserId(userId);
        await userApi.updateUserActiveStatus(true);
        const sessionsResponse = await authApi.getAllActiveSessions();
        dispatch(setActiveSessionsData(sessionsResponse));
        dispatch(setAuthenticated(true));
        await localUserDb.upsertUserData(newUser);
      }
    } catch (error) {
      ShowToast(
        "error",
        "Account Creation Failed",
        "Oops! Something went wrong while creating your account. Please try again."
      );
    }
  };

export const initiateLogout =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const { currentUser } = getState().user;
    try {
      if (currentUser?.uid) {
        await userApi.updateUserActiveStatus(false);
      }
      await secureStorageService.saveSignedStatus("false");
      await secureStorageService.saveCurrentUserId("");
      await resetLocalDb.resetLocalDatabase();
      await authApi.terminateCurrentSession();
      dispatch(resetAuth());
      dispatch(setCurrentUser(null));
    } catch (error) {
      ShowToast("error", "Logout Failed", "Please try again.");
    }
  };

export const initiateEmailLogin =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await authApi.createEmailPasswordSession(
        email,
        password
      );
      const userData = await userApi.fetchUserDocumentById(response.userId);
      if (userData) {
        dispatch(setCurrentUser(userData));
        await secureStorageService.saveSignedStatus("true");
        await secureStorageService.saveCurrentUserId(userData.uid as string);
        await userApi.updateUserActiveStatus(true);
        const sessionsResponse = await authApi.getAllActiveSessions();
        dispatch(setActiveSessionsData(sessionsResponse));
        dispatch(setAuthenticated(true));
        await localUserDb.upsertUserData(userData);
      }
    } catch (error: unknown) {
      console.log(error);
      if (
        error instanceof Error &&
        error.message.includes(
          "Rate limit for the current endpoint has been exceeded"
        )
      ) {
        ShowToast(
          "error",
          "Login Failed",
          "Too many requests. Please try again after some time."
        );
      } else {
        ShowToast(
          "error",
          "Login Failed",
          "No user found with this email or invalid email/password. Please check your email or sign up and try again."
        );
      }
    }
  };
