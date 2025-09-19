import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    // <AutoLayout>
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {/* Descope */}
      {/* <AuthProvider projectId='P2fawBqqYZBLazNBF0lZ03UdzLQB'> */}
      {/* Safe Area */}
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Router */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index"></Stack.Screen>
          </Stack>
          {/* Router - END */}
        </SafeAreaView>
      </SafeAreaProvider>
      {/* Safe Area - END */}
      {/* </AuthProvider> */}
      {/* Descope - END */}
    </View>
    // </AutoLayout>
  );
}
