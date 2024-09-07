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
import { showSnackbar } from "../components/common/Snackbar";

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  userId: string | null;
  phoneNumber: string | null;
  setUserId: (id: string) => void;
  setPhoneNumber: (phone: string) => void;
  login: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  emailLogin: (email: string, password: string) => Promise<void>;
  createAccount: (userData: Partial<User>) => Promise<void>;
  setCurrentUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isSigned = await apiServices.getSignedStatus();
      if (isSigned === "true") {
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
          } else {
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        }
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (code: string) => {
    try {
      if (!userId) {
        showSnackbar("An unexpected error occurred. Please try again.");
        return;
      }
      await apiServices.createSession(userId, code);
      const userData = await apiServices.getUserDocumentByID(userId);
      if (userData) {
        setCurrentUser(userData as User);
        await apiServices.updateUserOnline(userId);
        await apiServices.setSignedStatus("true");
        setIsAuthenticated(true);
      }
    } catch (error) {
      showSnackbar("Incorrect OTP. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await apiServices.setSignedStatus("false");
      setCurrentUser(null);
      setUserId(null);
      setPhoneNumber(null);
      setIsAuthenticated(false);
    } catch (error) {
      showSnackbar("Logout failed. Please try again.");
    }
  };

  const emailLogin = async (email: string, password: string) => {
    try {
      const userData = await apiServices.getUserDocumentByEmail(email);
      if (userData && Object.keys(userData).length > 0) {
        try {
          await apiServices.createEmailPasswordSession(email, password);
          setCurrentUser(userData as User);
          await localdbServices.createUserDataInLocaldb(userData);
          await apiServices.updateUserOnline(userData.uid!);
          await apiServices.setSignedStatus("true");
          setIsAuthenticated(true);
        } catch (error) {
          showSnackbar("Invalid email or password. Please try again.");
        }
      } else {
        showSnackbar(
          "No user found with this email. Please check your email or sign up."
        );
      }
    } catch (error) {
      showSnackbar("An error occurred during login. Please try again.");
    }
  };

  const createAccount = async (userData: Partial<User>) => {
    try {
      if (!userId) {
        showSnackbar("An unexpected error occurred. Please try again.");
        return;
      }
      const newUser = await apiServices.createNewUser(userId, userData);
      setCurrentUser(newUser as User);
      await localdbServices.createUserDataInLocaldb(newUser);
      await apiServices.updateAccountName(newUser.name);
      await apiServices.setDataToSecureStore("currentUserId", userId);
      await apiServices.setSignedStatus("true");
      setIsAuthenticated(true);
    } catch (error) {
      showSnackbar(
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
        setUserId,
        setPhoneNumber,
        login,
        logout,
        emailLogin,
        createAccount,
        setCurrentUser,
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
