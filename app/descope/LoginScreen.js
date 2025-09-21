import React from "react";
import { Button, Text } from "react-native";

const LoginScreen = ({ onLogin, request }) => (
  <>
    <Text>Expo + Descope Sample App</Text>
    <Button
      disabled={!request}
      title="Login"
      onPress={() => onLogin()}
      color="#841584"
    />
  </>
);

export default LoginScreen;
