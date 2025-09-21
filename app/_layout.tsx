import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DeepLinkProvider from "./context/deepLink";
import DescopeProvider from "./descope/descopeProvider";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {/* Safe Area */}
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          {/* DeepLink */}
          <DeepLinkProvider>
            {/* Descope */}
            <DescopeProvider>
              {/* Router */}
              <Stack
                screenOptions={{ headerShown: true }}
                initialRouteName="index"
              >
                <Stack.Screen name="index"></Stack.Screen>
                <Stack.Screen name="auth"></Stack.Screen>
              </Stack>
              {/* Router - END */}
            </DescopeProvider>
            {/* Descope - END */}
          </DeepLinkProvider>
          {/* DeepLink - END */}
        </SafeAreaView>
      </SafeAreaProvider>
      {/* Safe Area - END */}
    </View>
  );
}
