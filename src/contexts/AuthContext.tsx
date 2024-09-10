import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { apiServices } from "../services/api/apiServices";
import User from "../models/user";
import { localdbServices } from "../services/db/localdbServices";
import { ShowToast } from "../components/common/ShowToast";
import { SessionResponse } from "../types/sessionList";
import { filterSessionInfo } from "../utils/filterSessionInfo";

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  userId: string | null;
  phoneNumber: string | null;
  isNewUser: boolean;
  activeSessionsData: SessionResponse | null;
  setUserId: (id: string) => void;
  setPhoneNumber: (phone: string) => void;
  login: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  emailLogin: (email: string, password: string) => Promise<void>;
  createAccount: (userData: Partial<User>) => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  setActiveSessionsData: (data: SessionResponse) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(true);
  const [activeSessionsData, setActiveSessionsData] = useState<SessionResponse>(
    {
      sessions: [],
      totalSessions: 0,
    }
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isSigned = await apiServices.getSignedStatus();
      if (isSigned === "true") {
        try {
          const sessionsResponse = await apiServices.getAllActiveSessions();
          const filteredSessionsData = filterSessionInfo(sessionsResponse);
          setActiveSessionsData(filteredSessionsData);

          const localdbUserData =
            await localdbServices.getCurrentUserDataFromLocaldb();
          if (localdbUserData) {
            setCurrentUser(localdbUserData as User);
            setIsAuthenticated(true);
          } else {
            const apiUserData = await apiServices.getCurrentUserDocument();
            if (apiUserData) {
              setCurrentUser(apiUserData as User);
              setIsAuthenticated(true);
            }
          }
        } catch (error) {
          setIsAuthenticated(false);
          await localdbServices.deleteAllUsersDataFromLocaldb();
          await apiServices.setSignedStatus("false");
          await apiServices.setDataToSecureStore("currentUserId", "");
        }
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (code: string) => {
    if (!userId) {
      ShowToast(
        "error",
        "Login Failed",
        "An unexpected error occurred. Please try again."
      );
      return;
    }

    try {
      await apiServices.createSession(userId, code);

      const userData = await apiServices.getUserDocumentByID(userId);
      if (userData) {
        setIsNewUser(false);
        setCurrentUser(userData as User);
        await apiServices.setSignedStatus("true");
        await apiServices.setDataToSecureStore("currentUserId", userId);
        await apiServices.updateUserOnline(userId);
        const sessionsResponse = await apiServices.getAllActiveSessions();
        const filteredSessionsData = filterSessionInfo(sessionsResponse);
        setActiveSessionsData(filteredSessionsData);
        setIsAuthenticated(true);
        await localdbServices.updateUserDataInLocaldb(userData);
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

  const logout = async () => {
    try {
      await apiServices.updateUserOffline(currentUser!.uid!);
      await apiServices.setSignedStatus("false");
      await apiServices.setDataToSecureStore("currentUserId", "");
      await localdbServices.deleteAllUsersDataFromLocaldb();
      await apiServices.terminateCurrentSession();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setUserId(null);
      setPhoneNumber(null);
    } catch (error) {
      ShowToast("error", "Logout Failed", "Please try again.");
    }
  };

  const emailLogin = async (email: string, password: string) => {
    try {
      const response = await apiServices.createEmailPasswordSession(
        email,
        password
      );
      const userData = await apiServices.getUserDocumentByID(response.userId);
      if (userData) {
        setCurrentUser(userData as User);
        await apiServices.setSignedStatus("true");
        await apiServices.setDataToSecureStore("currentUserId", userData.uid!);
        await apiServices.updateUserOnline(userData.uid!);
        const sessionsResponse = await apiServices.getAllActiveSessions();
        const filteredSessionsData = filterSessionInfo(sessionsResponse);
        setActiveSessionsData(filteredSessionsData);
        setIsAuthenticated(true);
        await localdbServices.updateUserDataInLocaldb(userData);
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
        ShowToast(
          "error",
          "Login Failed",
          "No user found with this email or invalid email/password. Please check your email or sign up and try again."
        );
      }
    }
  };

  const createAccount = async (userData: Partial<User>) => {
    try {
      if (!userId) {
        ShowToast(
          "error",
          "Account Creation Failed",
          "An unexpected error occurred. Please try again."
        );
        return;
      }
      const newUser = await apiServices.createNewUser(userId, userData);
      setCurrentUser(newUser as User);
      await apiServices.updateAccountName(newUser.name);
      await apiServices.setDataToSecureStore("currentUserId", userId);
      await apiServices.setSignedStatus("true");
      const sessionsResponse = await apiServices.getAllActiveSessions();
      const filteredSessionsData = filterSessionInfo(sessionsResponse);
      setActiveSessionsData(filteredSessionsData);
      setIsAuthenticated(true);
      await localdbServices.createUserDataInLocaldb(newUser);
    } catch (error) {
      ShowToast(
        "error",
        "Account Creation Failed",
        "Oops! Something went wrong while creating your account. Please try again."
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        userId,
        phoneNumber,
        isNewUser,
        activeSessionsData,
        setUserId,
        setPhoneNumber,
        login,
        logout,
        emailLogin,
        createAccount,
        setCurrentUser,
        setActiveSessionsData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
