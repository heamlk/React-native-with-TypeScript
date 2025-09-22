import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "./context/theme";
import useBreakpoints from "./hooks/breakpoints";
import vars from "./styles/vars";

export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const breakpoints = useBreakpoints();

  const styles = StyleSheet.create({
    root: {
      height: 100,
      flex: 1,
      fontFamily: vars.fontText,
      fontSize: 16,

      ...(theme === "dark"
        ? {
            color: vars.light1,
            backgroundColor: breakpoints === "phone" ? vars.dark1 : vars.dark2,
          }
        : theme === "light" && {
            color: vars.grey1,
            backgroundColor: vars.white,
          }),
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View style={styles.root}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
