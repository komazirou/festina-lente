import { View } from "react-native";
import React from "react";
import Todo from "../Todo";

export default function DayScreen({ route }) {
  const { period } = route.params;
  return (
    <View>
      <Todo period={period} />
    </View>
  );
}
