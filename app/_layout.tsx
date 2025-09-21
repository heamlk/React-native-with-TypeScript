import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DeeplinkProvider from "./context/deeplink";
import DescopeProvider from "./context/descope";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {/* Safe Area */}
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          {/* DeepLink */}
          <DeeplinkProvider>
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
          </DeeplinkProvider>
          {/* DeepLink - END */}
        </SafeAreaView>
      </SafeAreaProvider>
      {/* Safe Area - END */}
    </View>
  );
}
