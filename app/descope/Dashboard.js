import React from "react";
import { Button, Text } from "react-native";

const Dashboard = ({ userInfo, onLogout }) => (
  <>
    <Text>Welcome, {userInfo ? userInfo.email : "User"}!</Text>
    <Button title="Logout" onPress={() => onLogout()} color="#841584" />
  </>
);

export default Dashboard;
