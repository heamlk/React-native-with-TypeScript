import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Text>Test</Text>
      <Link href="/auth">Auth</Link>
    </View>
  );
}
