import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "@/src/styles/colors";

type SnackbarContextType = {
  showSnackbar: (message: string, duration?: number) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

let showSnackbarRef: ((message: string, duration?: number) => void) | null =
  null;

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showSnackbar = useCallback(
    (msg: string, duration: number = 2800) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setMessage(msg);
      setIsVisible(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      timeoutRef.current = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsVisible(false);
          setMessage("");
        });
      }, duration);
    },
    [fadeAnim]
  );

  showSnackbarRef = showSnackbar;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {isVisible && (
        <Animated.View style={[styles.snackbar, { opacity: fadeAnim }]}>
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      )}
    </SnackbarContext.Provider>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.darkGray,
    padding: wp("5%"),
    minHeight: hp("8%"),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});

export const showSnackbar = (message: string, duration?: number) => {
  if (showSnackbarRef) {
    showSnackbarRef(message, duration);
  } else {
    console.warn(
      "Snackbar is not ready yet. Make sure SnackbarProvider is mounted."
    );
  }
};
