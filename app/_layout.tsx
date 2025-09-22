import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DeeplinkProvider from "./context/deeplink";
import DescopeProvider from "./context/descope";
import ThemeProvider from "./context/theme";
import Layout from "./layout";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <DeeplinkProvider>
            <DescopeProvider>
              <Layout>
                {/* Router */}
                <Stack
                  screenOptions={{ headerShown: false }}
                  initialRouteName="index"
                >
                  <Stack.Screen name="index"></Stack.Screen>
                  <Stack.Screen name="auth"></Stack.Screen>
                </Stack>
                {/* Router - END */}
              </Layout>
            </DescopeProvider>
          </DeeplinkProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </View>
  );
}
