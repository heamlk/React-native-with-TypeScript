import { Stack } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DeeplinkProvider from "./context/deeplink";
import DescopeProvider from "./context/descope";
import ThemeProvider from "./context/theme";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider>
        {/* Safe Area */}
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
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
            </ScrollView>
          </SafeAreaView>
        </SafeAreaProvider>
        {/* Safe Area - END */}
      </ThemeProvider>
    </View>
  );
}
