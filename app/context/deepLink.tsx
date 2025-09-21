import * as Linking from "expo-linking";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { Alert } from "react-native";

export type DeepLinkContextType = {};

const DeepLinkContext = createContext<DeepLinkContextType | null>(null);

export default function DeepLinkProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    // Handle the initial URL if the app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        Alert.alert("Initial Deep Link", url);
      }
    });

    // Listen for incoming URLs while the app is open
    const subscription = Linking.addEventListener("url", (event) => {
      Alert.alert("Deep Link Received", event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <DeepLinkContext.Provider value={{}}>{children}</DeepLinkContext.Provider>
  );
}

export const useDeepLink = () => {
  const context = useContext(DeepLinkContext);
  if (!context) throw new Error("useDeepLink can't be null");
  return context;
};
