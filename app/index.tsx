import { StyleSheet, View } from "react-native";
import { useTheme } from "./context/theme";
import useBreakpoints from "./hooks/breakpoints";

export default function Index() {
  const { theme } = useTheme();
  const breakpoints = useBreakpoints();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return <View style={styles.container}></View>;
}
