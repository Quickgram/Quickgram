import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useAppDispatch } from "./useAppDispatch";
import { setHasInternetConnection } from "@/src/redux/reducers/globalReducer";

export const useInternetConnection = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setHasInternetConnection(!!state.isConnected));
    });

    return () => unsubscribe();
  }, [dispatch]);
};
